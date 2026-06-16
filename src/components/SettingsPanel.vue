<template>
  <div ref="root" class="settings">
    <button
      type="button"
      class="theme-toggle settings-btn"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="open = !open"
    >
      <span class="tt-label">Ajustes ▾</span>
    </button>

    <div v-if="open" class="settings-panel" role="menu">
      <div class="settings-title">
        Ajustes
        <small>{{ settings.theme === 'cruzeiro' ? 'ficha técnica' : 'painel de controle' }}</small>
      </div>

      <div class="settings-row">
        <span class="settings-k">Tema</span>
        <div class="settings-chips">
          <button
            type="button"
            class="chip"
            :class="{ 'is-active': settings.theme === 'cruzeiro' }"
            @click="settings.setTheme('cruzeiro')"
          >
            Cruzeiro
          </button>
          <button
            type="button"
            class="chip"
            :class="{ 'is-active': settings.theme === 'panini' }"
            @click="settings.setTheme('panini')"
          >
            Claro
          </button>
        </div>
        <span class="settings-hint">alterna entre o álbum de figurinhas e o modo arquibancada</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useSettingsStore } from '@/stores/settings-store.js'

const settings = useSettingsStore()
const open = ref(false)
const root = ref(null)

function onDocClick(e) {
  if (open.value && root.value && !root.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>
