<template>
  <div class="home-wrap tx-paper">
    <SiteHeader variant="draft" />
    <section class="home-hero" style="padding: 48px 0">
      <span class="eyebrow">Sócio-torcedor</span>
      <h1 class="home-headline" style="font-size: clamp(32px, 6vw, 56px)">Ficha do Jogador</h1>
      <p class="home-sub">
        O perfil — conquistas, histórico e amigos — depende de uma conta online e fica fora do
        escopo desta reconstrução. Volte para montar seu time.
      </p>
      <div class="home-ctas">
        <router-link class="btn btn-primary home-cta-main" to="/play">Jogar agora →</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import SiteHeader from '@/components/SiteHeader.vue'
</script>
