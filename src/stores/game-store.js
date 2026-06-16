import { defineStore, acceptHMRUpdate } from 'pinia'
import { GAME_CONFIG, getSlots } from '@/game/formations.js'
import { computeRatings } from '@/game/ratings.js'
import { sortPositions, POSITION_ORDER } from '@/game/positions.js'
import { roll as drawRoll, reroll as drawReroll, canReroll } from '@/game/draw.js'
import { runCampaign } from '@/game/simulate.js'
import { pickFillableFormation } from '@/game/lineup.js'

function makeSeed() {
  // Short human-friendly base36 seed; safe to use Math.random at runtime.
  return Math.floor(Math.random() * 0xffffff)
    .toString(36)
    .padStart(4, '0')
}

export const useGameStore = defineStore('game', {
  state: () => ({
    seed: makeSeed(),
    rollIndex: 0,
    mode: GAME_CONFIG.defaultMode,
    formation: GAME_CONFIG.defaultFormation,
    style: GAME_CONFIG.defaultStyle,

    /** 'idle' | 'building' | 'result' */
    stage: 'idle',
    spinning: false,

    draw: null, // current drawn entry { sel, copa, name, crest, squad, avg }
    rerollsUsed: 0,

    filled: new Array(11).fill(null), // player|null aligned to slots
    activeSlot: null, // index of slot being targeted, or null

    result: null,
  }),

  getters: {
    slots() {
      return getSlots(this.formation, this.style)
    },

    statsVisible() {
      return GAME_CONFIG.modes[this.mode].statsVisible
    },

    rerollsLeft() {
      return Math.max(0, GAME_CONFIG.modes[this.mode].rerolls - this.rerollsUsed)
    },

    ratings() {
      return computeRatings(this.slots, this.filled)
    },

    filledCount() {
      return this.filled.filter(Boolean).length
    },

    isComplete() {
      return this.filledCount === 11
    },

    usedIds() {
      return new Set(this.filled.filter(Boolean).map((p) => p.playerId))
    },

    /** Pool rows sorted by position then force desc, with flags. */
    pool() {
      if (!this.draw) return []
      const used = this.usedIds
      const active = this.activeSlot
      const activePos = active != null ? this.slots[active].pos : null
      return [...this.draw.squad]
        .sort((a, b) => {
          const pa = POSITION_ORDER[sortPositions(a.positions)[0]]
          const pb = POSITION_ORDER[sortPositions(b.positions)[0]]
          return pa - pb || b.force - a.force
        })
        .map((p) => {
          const isUsed = used.has(p.playerId)
          const eligible = activePos
            ? p.positions.includes(activePos)
            : this.slots.some((s, i) => !this.filled[i] && p.positions.includes(s.pos))
          return {
            ...p,
            positionsSorted: sortPositions(p.positions),
            used: isUsed,
            selectable: !isUsed && eligible,
          }
        })
    },
  },

  actions: {
    startSession() {
      this.seed = makeSeed()
      this.rollIndex = 0
      this.stage = 'idle'
      this.draw = null
      this.rerollsUsed = 0
      this.result = null
      this.activeSlot = null
      this.resetLineup()
    },

    resetLineup() {
      this.filled = new Array(this.slots.length).fill(null)
      this.activeSlot = null
    },

    setMode(mode) {
      if (!GAME_CONFIG.modes[mode]) return
      this.mode = mode
      this.rerollsUsed = 0
    },

    setFormation(formation) {
      this.formation = formation
      this.reassignLineup()
    },

    setStyle(style) {
      this.style = style
      this.reassignLineup()
    },

    /** Re-distribute current players into the new slot set, greedily. */
    reassignLineup() {
      const players = this.filled.filter(Boolean)
      const next = new Array(this.slots.length).fill(null)
      // Place least-flexible players first (fewest eligible positions).
      players
        .slice()
        .sort((a, b) => a.positions.length - b.positions.length)
        .forEach((p) => {
          const idx = this.slots.findIndex((s, i) => !next[i] && p.positions.includes(s.pos))
          if (idx !== -1) next[idx] = p
        })
      this.filled = next
      this.activeSlot = null
    },

    /** Switch to a formation the drawn squad can actually field. */
    ensureFillableFormation() {
      if (!this.draw) return
      this.formation = pickFillableFormation(this.draw.squad, this.style, this.formation)
    },

    roll() {
      this.spinning = true
      this.rollIndex += 1
      this.draw = drawRoll(this.seed, this.rollIndex)
      this.rerollsUsed = 0
      this.stage = 'building'
      this.ensureFillableFormation()
      this.resetLineup()
      // brief spin flag for the snap animation; consumer clears via timeout
      setTimeout(() => {
        this.spinning = false
      }, 520)
    },

    reroll(axis) {
      if (!this.draw || this.rerollsLeft <= 0) return
      if (!canReroll(axis, this.draw)) return
      this.spinning = true
      this.rerollsUsed += 1
      this.draw = drawReroll(this.seed, this.rollIndex, this.rerollsUsed, axis, this.draw)
      this.ensureFillableFormation()
      //this.resetLineup()
      setTimeout(() => {
        this.spinning = false
      }, 520)
    },

    canReroll(axis) {
      return this.draw ? canReroll(axis, this.draw) : false
    },

    selectSlot(index) {
      if (this.filled[index]) {
        // tapping a filled slot frees it
        this.filled[index] = null
        this.activeSlot = null
        return
      }
      this.activeSlot = this.activeSlot === index ? null : index
    },

    placePlayer(playerId) {
      if (!this.draw) return
      if (this.usedIds.has(playerId)) return
      const player = this.draw.squad.find((p) => p.playerId === playerId)
      if (!player) return

      // Targeted slot first.
      if (this.activeSlot != null) {
        const slot = this.slots[this.activeSlot]
        if (player.positions.includes(slot.pos)) {
          this.filled[this.activeSlot] = player
          this.activeSlot = null
          return
        }
      }
      // Otherwise drop into the first eligible empty slot.
      const idx = this.slots.findIndex(
        (s, i) => !this.filled[i] && player.positions.includes(s.pos),
      )
      if (idx !== -1) this.filled[idx] = player
      this.activeSlot = null
    },

    autofill() {
      // Fill empty slots with the strongest eligible unused players, keeping
      // any picks the player has already made.
      if (!this.draw) return
      const used = new Set(this.usedIds)
      this.slots.forEach((slot, i) => {
        if (this.filled[i]) return
        const candidate = [...this.draw.squad]
          .filter((p) => !used.has(p.playerId) && p.positions.includes(slot.pos))
          .sort((a, b) => b.force - a.force)[0]
        if (candidate) {
          this.filled[i] = candidate
          used.add(candidate.playerId)
        }
      })
      this.activeSlot = null
    },

    simulate() {
      if (!this.isComplete || !this.draw) return
      const { attack, defense } = this.ratings
      const squad = this.filled.filter(Boolean)
      const seedBase = `${this.seed}:${this.rollIndex}:copa`
      this.result = {
        ...runCampaign({ attack, defense, seed: seedBase, squad }),
        ratings: this.ratings,
        draw: {
          sel: this.draw.sel,
          copa: this.draw.copa,
          name: this.draw.name,
          crest: this.draw.crest,
        },
        mode: this.mode,
        seed: this.seed,
        lineup: this.slots.map((s, i) => ({ slot: s, player: this.filled[i] })),
      }
      this.stage = 'result'
    },

    playAgain() {
      this.startSession()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
}
