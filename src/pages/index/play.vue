<template>
  <div class="tx-paper" style="position: relative">
    <SiteHeader v-if="game.stage !== 'result'" variant="draft" />

    <!-- Draft: roll → build the lineup -->
    <div v-if="game.stage !== 'result'" class="draft-layout">
      <RollPanel />
      <PitchView />
      <BoxScore @simulate="game.simulate()" />
    </div>

    <!-- Result reveal -->
    <SimulateReveal v-else :result="game.result" @again="game.playAgain()" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGameStore } from '@/stores/game-store.js'
import SiteHeader from '@/components/SiteHeader.vue'
import RollPanel from '@/components/play/RollPanel.vue'
import PitchView from '@/components/play/PitchView.vue'
import BoxScore from '@/components/play/BoxScore.vue'
import SimulateReveal from '@/components/play/SimulateReveal.vue'

const game = useGameStore()

onMounted(() => {
  if (game.stage === 'idle' && !game.draw) game.startSession()
})
</script>
