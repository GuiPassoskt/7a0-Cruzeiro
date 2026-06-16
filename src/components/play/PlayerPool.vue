<template>
  <div>
    <div class="draft-pool-head">
      <span class="eyebrow">
        {{ game.activeSlot != null ? `Escolha p/ ${activePosLabel}` : 'Escolha um jogador' }}
      </span>
      <span class="eyebrow num">{{ game.filledCount }}/11</span>
    </div>

    <div class="draft-pool">
      <button
        v-for="p in game.pool"
        :key="p.playerId"
        type="button"
        class="pool-row"
        :class="{ 'not-selectable': !p.selectable }"
        :disabled="!p.selectable"
        @click="game.placePlayer(p.playerId)"
      >
        <span class="pool-num num">{{ p.number }}</span>
        <span class="pool-name">{{ p.name }}</span>
        <span class="pool-pos">{{ p.positionsSorted.join(' · ') }}</span>
        <span v-if="game.statsVisible" class="pool-force num">{{ p.force }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/game-store.js'

const game = useGameStore()

const activePosLabel = computed(() =>
  game.activeSlot != null ? game.slots[game.activeSlot].pos : '',
)
</script>
