<template>
  <div class="col-roll">
    <div class="roll-panel">
      <!-- Setup: mode / formation / style -->
      <div class="play-setup sticker">
        <div class="setup-group">
          <span class="settings-k">Modo · dificuldade</span>
          <div class="settings-chips">
            <button
              v-for="m in modes"
              :key="m.key"
              type="button"
              class="chip"
              :class="{ 'is-active': game.mode === m.key }"
              @click="game.setMode(m.key)"
            >
              {{ m.label }}
            </button>
          </div>
        </div>
        <div class="setup-group">
          <span class="settings-k">Formação</span>
          <div class="settings-chips">
            <button
              v-for="f in formations"
              :key="f"
              type="button"
              class="chip"
              :class="{ 'is-active': game.formation === f }"
              @click="game.setFormation(f)"
            >
              {{ f }}
            </button>
          </div>
        </div>
        <div class="setup-group">
          <span class="settings-k">Estilo</span>
          <div class="settings-chips">
            <button
              v-for="s in styles"
              :key="s.key"
              type="button"
              class="chip"
              :class="{ 'is-active': game.style === s.key }"
              @click="game.setStyle(s.key)"
            >
              {{ s.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Draw result -->
      <div v-if="game.draw" class="roll-result sticker" :class="{ 'is-spinning': game.spinning }">
        <div class="rr-sel">
          <span class="rr-flag">
            <img v-if="game.draw.crest" :src="game.draw.crest" :alt="game.draw.name" />
          </span>
          <span>{{ game.draw.name }}</span>
        </div>
        <div class="rr-copa num">Copa {{ game.draw.copa }}</div>
      </div>
      <div v-else class="roll-idle">Role para sortear uma seleção e uma Copa</div>

      <!-- Roll / reroll -->
      <button v-if="!game.draw" type="button" class="btn btn-primary roll-btn" @click="game.roll()">
        {{ game.spinning ? 'Sorteando…' : 'Rolar' }}
      </button>
      <div v-else class="reroll-box">
        <span class="eyebrow reroll-label">
          Não curtiu? Re-sorteie ·
          {{ game.rerollsLeft }} {{ game.rerollsLeft === 1 ? 'restante' : 'restantes' }}
        </span>
        <div class="reroll-btns">
          <button
            type="button"
            class="btn btn-secondary reroll-btn"
            :disabled="game.rerollsLeft <= 0 || !game.canReroll('selecao')"
            @click="game.reroll('selecao')"
          >
            ↺ Outra seleção
          </button>
          <button
            type="button"
            class="btn btn-secondary reroll-btn"
            :disabled="game.rerollsLeft <= 0 || !game.canReroll('copa')"
            @click="game.reroll('copa')"
          >
            ↺ Outra Copa
          </button>
        </div>
      </div>

      <!-- Player pool -->
      <PlayerPool v-if="game.draw" />
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/game-store.js'
import { FORMATION_KEYS } from '@/game/formations.js'
import PlayerPool from './PlayerPool.vue'

const game = useGameStore()

const modes = [
  { key: 'classico', label: 'Clássico' },
  { key: 'almanaque', label: 'De almanaque' },
]
const formations = FORMATION_KEYS
const styles = [
  { key: 'defensivo', label: 'Defensivo' },
  { key: 'equilibrado', label: 'Equilibrado' },
  { key: 'ofensivo', label: 'Ofensivo' },
]
</script>
