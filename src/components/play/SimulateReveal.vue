<template>
  <section class="simulate">
    <div class="sim-top">
      <div class="sim-title-block">
        <span class="eyebrow">A campanha · seed #{{ result.seed }}</span>
        <h1 class="sim-title">{{ result.champion ? 'Rumo ao 7 a 0' : 'A campanha' }}</h1>
      </div>
      <div class="rr-sel" style="font-size: 22px">
        <span class="rr-flag">
          <img v-if="result.draw.crest" :src="result.draw.crest" :alt="result.draw.name" />
        </span>
        <span>{{ result.draw.name }}</span>
        <span class="rr-copa num" style="margin: 0 0 0 6px">{{ result.draw.copa }}</span>
      </div>
    </div>

    <!-- Fixtures -->
    <div class="sim-bracket">
      <template v-for="(m, i) in result.campaign" :key="i">
        <div class="fixture" :class="fixtureClass(m)">
          <span class="fx-phase eyebrow">{{ m.phase }}</span>
          <span class="fx-opp">
            <span class="fx-vs">vs</span>
            <span class="fx-name">{{ m.opp }}</span>
          </span>
          <span class="fx-score num">
            {{ m.gf }}–{{ m.ga }}
            <span v-if="m.penalties && m.pens" class="fx-pen">pên {{ m.pens.score }}</span>
          </span>
          <span class="fx-mark">{{ mark(m) }}</span>

          <span v-if="m.scorers && m.scorers.length" class="fx-scorers">
            <span class="fx-lbl">gols</span>{{ m.scorers.join(', ') }}
          </span>
        </div>
      </template>
    </div>

    <!-- Champion / elimination seal -->
    <div v-if="result.champion" class="sim-seal">
      <div class="sim-seal-l">
        <span class="eyebrow sim-champ">Campeão</span>
        <span class="sim-seal-mark num">{{ result.gf }}–{{ result.ga }}</span>
      </div>
      <div class="sim-seal-r">
        <span v-if="result.perfect" class="sim-perfect">Campanha perfeita · invicto</span>
        <div class="sim-stats">
          <span class="sim-stat"><b class="num">{{ result.wins }}</b><i>vitórias</i></span>
          <span class="sim-stat"><b class="num">{{ result.gf }}</b><i>gols pró</i></span>
          <span class="sim-stat"><b class="num">{{ result.ga }}</b><i>sofridos</i></span>
        </div>
        <span v-if="result.badge" class="badge-record">★ {{ badgeLabel }}</span>
      </div>
    </div>
    <div v-else class="sim-seal">
      <div class="sim-seal-l">
        <span class="eyebrow sim-champ">Eliminado nas {{ eliminatedPhase }}</span>
        <span class="sim-seal-mark num">{{ result.wins }}–{{ result.losses }}</span>
      </div>
      <div class="sim-seal-r">
        <div class="sim-stats">
          <span class="sim-stat"><b class="num">{{ result.wins }}</b><i>vitórias</i></span>
          <span class="sim-stat"><b class="num">{{ result.gf }}</b><i>gols pró</i></span>
          <span class="sim-stat"><b class="num">{{ result.ga }}</b><i>sofridos</i></span>
        </div>
      </div>
    </div>

    <div class="sim-foot">
      <button type="button" class="btn btn-primary sim-cta" @click="emit('again')">
        Jogar de novo
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  result: { type: Object, required: true },
})
const emit = defineEmits(['again'])

const badgeLabel = computed(() => {
  if (props.result.badge === 'ESMAGADOR DE RECORDES') return 'ESMAGADOR DE RECORDES'
  if (props.result.badge === 'MURALHA') return 'MURALHA'
  return props.result.badge
})

const eliminatedPhase = computed(() => {
  const lost = [...props.result.campaign].reverse().find((m) => m.advanced === false)
  return lost ? lost.phase : 'GRUPOS'
})

function fixtureClass(m) {
  return {
    'is-final': m.phase === 'FINAL' && m.advanced,
    'is-loss': m.advanced === false,
  }
}

function mark(m) {
  if (m.phase === 'FINAL' && m.advanced) return '★'
  if (m.advanced === false) return '✕'
  return '✓'
}
</script>
