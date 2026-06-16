<template>
  <div class="col-box">
    <div class="box-head">
      <div>
        <span class="eyebrow">Box score</span>
        <div class="num" style="font-size: clamp(28px, 5vw, 40px); line-height: 0.9">
          {{ game.filledCount }}/11
        </div>
      </div>
    </div>

    <div v-if="game.statsVisible" class="box-ratings">
      <span class="box-rating box-rating-atk">
        <span class="num">{{ game.ratings.attack }}</span> ataque
      </span>
      <span class="box-rating box-rating-def">
        <span class="num">{{ game.ratings.defense }}</span> defesa
      </span>
      <span class="box-rating">
        <span class="num">{{ game.ratings.overall }}</span> overall
      </span>
    </div>

    <table class="boxscore">
      <tbody>
        <tr v-for="(slot, i) in game.slots" :key="i">
          <td class="pos">{{ slot.pos }}</td>
          <td class="pl-name">{{ game.filled[i] ? game.filled[i].name : '—' }}</td>
          <td class="val num">
            {{ game.filled[i] && game.statsVisible ? game.filled[i].force : '' }}
          </td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 10px">
      <button
        v-if="!game.isComplete"
        type="button"
        class="btn btn-secondary"
        style="min-height: 44px; font-size: 14px"
        @click="game.autofill()"
      >
        Completar automaticamente
      </button>
      <button
        type="button"
        class="btn btn-primary"
        style="min-height: 48px; font-size: 18px"
        :disabled="!game.isComplete"
        @click="emit('simulate')"
      >
        {{ game.isComplete ? 'Simular a Copa →' : 'Escalação incompleta' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/game-store.js'

const game = useGameStore()
const emit = defineEmits(['simulate'])
</script>
