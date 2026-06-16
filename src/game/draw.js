// Roll / reroll logic: draws a seleção + copa weighted by squad strength.

import { makeRng, pickWeighted } from './rng.js'
import { DATASET } from './squads.js'

/** Weight a list of entries by average force: 0.25..1 spread between min/max. */
function weightsFor(entries) {
  const avgs = entries.map((e) => e.avg)
  const min = Math.min(...avgs)
  const max = Math.max(...avgs)
  const span = max - min || 1
  return entries.map((e) => 0.25 + 0.75 * ((e.avg - min) / span))
}

function drawFrom(rng, entries) {
  if (entries.length === 1) return entries[0]
  return pickWeighted(rng, entries, weightsFor(entries))
}

/**
 * Initial roll for a given base seed + roll index.
 * @returns dataset entry { sel, copa, name, crest, squad, avg }
 */
export function roll(seed, rollIndex) {
  const rng = makeRng(`${seed}:roll:${rollIndex}`)
  return drawFrom(rng, DATASET)
}

/**
 * Re-roll one axis while keeping the other fixed.
 * axis = 'copa'    → keep seleção, draw another copa
 * axis = 'selecao' → keep copa, draw another seleção
 */
export function reroll(seed, rollIndex, rerollNo, axis, current) {
  const rng = makeRng(`${seed}:roll:${rollIndex}:rr:${rerollNo}:${axis}`)
  let pool
  if (axis === 'copa') {
    pool = DATASET.filter((d) => d.sel === current.sel && d.copa !== current.copa)
  } else {
    pool = DATASET.filter((d) => d.copa === current.copa && d.sel !== current.sel)
  }
  if (pool.length === 0) return current // nothing else to draw on this axis
  return drawFrom(rng, pool)
}

/** Whether a given reroll axis has any alternative to offer. */
export function canReroll(axis, current) {
  if (axis === 'copa') {
    return DATASET.some((d) => d.sel === current.sel && d.copa !== current.copa)
  }
  return DATASET.some((d) => d.copa === current.copa && d.sel !== current.sel)
}
