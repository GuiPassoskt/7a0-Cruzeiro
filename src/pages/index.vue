<template>
  <div class="page-root">
    <main>
      <router-view />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup>
// Shared shell: a flex column with the routed page above the global footer.
import SiteFooter from '@/components/SiteFooter.vue'
</script>
