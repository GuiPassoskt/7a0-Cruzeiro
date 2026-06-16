<template>
  <div class="home-wrap tx-paper">
    <SiteHeader variant="home" />

    <div class="home-grid">
      <section class="home-hero">
        <span class="eyebrow home-eyebrow">Time dos sonhos · Cruzeiro · 1966 — 2026</span>
        <div class="home-mark">
          <ScoreMark />
        </div>
        <h1 class="home-headline">Role o dado.<br />Monte sua seleção<br />dos sonhos</h1>
        <p class="home-sub">
          Role o dado: sai um elenco do Cruzeiro de uma temporada. Escale os craques que estiveram
          lá, complete os 11 e simule — seu time faz 7 a 0?
        </p>
        <div class="home-ctas">
          <router-link class="btn btn-primary home-cta-main" to="/play">Jogar agora →</router-link>
        </div>
      </section>

      <aside class="home-preview">
        <HomePitch />
      </aside>
    </div>

    <section class="home-steps sticker">
      <div class="how-step">
        <span class="step-no num">01</span>
        <span class="step-ic-wrap">
          <svg
            viewBox="0 0 40 40"
            class="step-ic"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
          >
            <rect x="6" y="6" width="28" height="28" rx="2" />
            <circle cx="14" cy="14" r="2.2" fill="currentColor" stroke="none" />
            <circle cx="26" cy="14" r="2.2" fill="currentColor" stroke="none" />
            <circle cx="20" cy="20" r="2.2" fill="currentColor" stroke="none" />
            <circle cx="14" cy="26" r="2.2" fill="currentColor" stroke="none" />
            <circle cx="26" cy="26" r="2.2" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <div class="step-txt">
          <span class="step-t">Role</span>
          <span class="step-d">Sorteia um elenco e uma temporada</span>
        </div>
      </div>
      <div class="how-step">
        <span class="step-no num">02</span>
        <span class="step-ic-wrap">
          <svg
            viewBox="0 0 40 40"
            class="step-ic"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
          >
            <rect x="5" y="6" width="30" height="28" rx="1.5" />
            <line x1="5" y1="20" x2="35" y2="20" />
            <circle cx="20" cy="20" r="4.5" />
            <rect x="13" y="6" width="14" height="5" />
            <rect x="13" y="29" width="14" height="5" />
          </svg>
        </span>
        <div class="step-txt">
          <span class="step-t">Monte</span>
          <span class="step-d">Escale um craque que jogou ali</span>
        </div>
      </div>
      <div class="how-step">
        <span class="step-no num">03</span>
        <span class="step-ic-wrap">
          <svg
            viewBox="0 0 40 40"
            class="step-ic"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
            stroke-linecap="round"
          >
            <path d="M8 9h8v9h8" />
            <path d="M8 31h8v-9" />
            <path d="M24 18h8" />
            <circle cx="33" cy="18" r="2.4" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <div class="step-txt">
          <span class="step-t">Simule</span>
          <span class="step-d">Veja se seu time faz 7 a 0</span>
        </div>
      </div>
    </section>

    <footer class="home-foot">
      <div class="foot-counts">
        <span class="num">{{ squadCount }}</span> elencos
        <span class="foot-dot">·</span>
        <span class="num">{{ playerCount }}</span> jogadores do Cruzeiro
      </div>
    </footer>
  </div>
</template>

<script setup>
import SiteHeader from '@/components/SiteHeader.vue'
import ScoreMark from '@/components/ScoreMark.vue'
import HomePitch from '@/components/HomePitch.vue'
import { DATASET } from '@/game/squads.js'

const squadCount = DATASET.length
const playerCount = DATASET.reduce((s, d) => s + d.squad.length, 0)
</script>
