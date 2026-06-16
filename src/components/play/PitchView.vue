<template>
  <div class="col-pitch">
    <div class="pitch-outer">
      <div class="pitch-wrap">
        <div class="pitch"></div>
        <svg class="pitch-markings" viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="200" x2="300" y2="200" />
          <circle cx="150" cy="200" r="46" />
          <circle cx="150" cy="200" r="2.4" class="mk-fill" />
          <path d="M62 0 V60 H238 V0" />
          <path d="M112 0 V22 H188 V0" />
          <circle cx="150" cy="40" r="2.4" class="mk-fill" />
          <path d="M110.8 60 A44 44 0 0 0 189.2 60" />
          <path d="M62 400 V340 H238 V400" />
          <path d="M112 400 V378 H188 V400" />
          <circle cx="150" cy="360" r="2.4" class="mk-fill" />
          <path d="M110.8 340 A44 44 0 0 1 189.2 340" />
        </svg>

        <div
          v-for="(slot, i) in game.slots"
          :key="i"
          class="disc"
          :class="discClass(i)"
          :style="{ left: slot.x + '%', top: slot.y + '%' }"
          @click="game.selectSlot(i)"
        >
          <span class="disc-circle">
            {{ game.filled[i] ? game.filled[i].number : slot.pos }}
          </span>
          <span v-if="game.filled[i]" class="disc-name">{{ game.filled[i].name }}</span>
        </div>
      </div>

      <p class="pitch-hint">
        {{
          game.activeSlot != null
            ? 'Escolha um jogador na lista · toque na vaga de novo pra cancelar'
            : 'Toque numa vaga e escolha um craque que jogou ali'
        }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/game-store.js'

const game = useGameStore()

function discClass(i) {
  if (game.filled[i]) return 'filled'
  return game.activeSlot === i ? 'empty slot-pickable is-active' : 'empty'
}
</script>
