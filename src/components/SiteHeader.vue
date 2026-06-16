<template>
  <header :class="variant === 'home' ? 'site-header site-header--home' : 'draft-header'">
    <div class="site-header-left">
      <router-link
        v-if="variant !== 'home'"
        class="home-link logo"
        to="/"
        aria-label="Voltar para a home"
      >
        <span class="lk-horz">
          <ScoreMark />
          <span class="lk-horz-words">
            <span class="lk-horz-name">SEIS<br />A UM</span>
            <span class="lk-horz-sub">monte · simule · 6 a 1</span>
          </span>
        </span>
      </router-link>
    </div>

    <div class="site-header-right draft-header-right">
      <router-link v-if="variant === 'home'" class="profile-link" to="/perfil" aria-label="Perfil">
        <svg class="profile-link-ic" viewBox="0 0 40 40" aria-hidden="true">
          <rect x="7" y="9" width="26" height="22" rx="2" />
          <circle cx="15" cy="18" r="3.2" />
          <path d="M10.5 26.5c1.2-3 7.6-3 8.8 0" />
          <line x1="24" y1="16" x2="29.5" y2="16" />
          <line x1="24" y1="21" x2="29.5" y2="21" />
        </svg>
        <span class="profile-link-label">Perfil</span>
      </router-link>
      <SettingsPanel />
    </div>
  </header>
</template>

<script setup>
import ScoreMark from './ScoreMark.vue'
import SettingsPanel from './SettingsPanel.vue'

defineProps({
  variant: {
    type: String,
    default: 'home', // 'home' | 'draft'
  },
})
</script>
