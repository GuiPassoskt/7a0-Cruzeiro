// Deterministic PRNG utilities — reverse-engineered from the original 7a0 build.
// Seeds are deterministic strings so a given draw/campaign always replays identically.

/**
 * mulberry32 generator seeded by an xmur3-hashed string.
 * @param {string} str seed string
 * @returns {() => number} function yielding floats in [0, 1)
 */
export function makeRng(str) {
  const seed = (function hash(s) {
    let h = 0x6a09e667 ^ s.length
    for (let i = 0; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i), 0xcc9e2d51)
      h = (h << 13) | (h >>> 19)
    }
    return h >>> 0
  })(str)

  let a = seed
  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000
  }
}

/** Pick a uniform random element. */
export function pick(rng, arr) {
  if (arr.length === 0) throw new Error('pick: array vazio')
  return arr[Math.floor(rng() * arr.length)]
}

/** Pick a weighted random element (weights aligned with items). */
export function pickWeighted(rng, items, weights) {
  if (items.length === 0) throw new Error('pickWeighted: array vazio')
  const total = weights.reduce((s, w) => s + w, 0)
  let r = rng() * total
  for (let i = 0; i < items.length; i++) {
    if ((r -= weights[i]) <= 0) return items[i]
  }
  return items[items.length - 1]
}

/** Clamp a number into [lo, hi]. */
export function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x))
}
