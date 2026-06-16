<template>
  <router-view />
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings-store.js'

// Apply the saved theme class to <html> as early as possible.
const settings = useSettingsStore()
settings.init()
</script>
