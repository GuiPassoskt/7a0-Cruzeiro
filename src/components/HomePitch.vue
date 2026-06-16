<template>
  <div class="home-pitch" aria-label="Time dos sonhos: lendas do Cruzeiro">
    <svg class="pitch-markings" viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1="200" x2="300" y2="200" />
      <circle cx="150" cy="200" r="46" />
      <circle cx="150" cy="200" r="2.4" class="mk-fill" />
      <path d="M62 0 V60 H238 V0" />
      <path d="M112 0 V22 H188 V0" />
      <circle cx="150" cy="40" r="2.4" class="mk-fill" />
      <path d="M110.8 60 A44 44 0 0 0 189.2 60" />
      <path d="M62 400 V340 H238 V400" />
      <path d="M112 400 V378 H188 V400" />
      <circle cx="150" cy="360" r="2.4" class="mk-fill" />
      <path d="M110.8 340 A44 44 0 0 1 189.2 340" />
    </svg>

    <div
      v-for="(d, i) in discs"
      :key="i"
      class="hp-disc"
      :style="{ left: d.left, top: d.top }"
    >
      <span class="hp-c num">{{ d.n }}</span>
      <span class="hp-n">{{ d.name }}</span>
    </div>
  </div>
</template>

<script setup>
// Decorative "dream team" of Cruzeiro idols, mirroring the original home preview.
const discs = [
  { left: '50%', top: '88%', n: 1, name: 'Fábio' },
  { left: '82%', top: '70%', n: 2, name: 'Nelinho' },
  { left: '60%', top: '74%', n: 3, name: 'Darío Conca' },
  { left: '40%', top: '74%', n: 4, name: 'Léo' },
  { left: '18%', top: '70%', n: 6, name: 'Fabiano' },
  { left: '30%', top: '48%', n: 8, name: 'Piazza' },
  { left: '50%', top: '52%', n: 5, name: 'Dirceu Lopes' },
  { left: '70%', top: '48%', n: 10, name: 'Alex' },
  { left: '78%', top: '24%', n: 7, name: 'Marcelo Moreno' },
  { left: '50%', top: '18%', n: 9, name: 'Tostão' },
  { left: '22%', top: '24%', n: 11, name: 'Sorín' },
]
</script>
