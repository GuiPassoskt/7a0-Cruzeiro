// Lineup / formation-fit helpers.

import { FORMATION_KEYS, getSlots } from './formations.js'

/** Greedy best-XI assignment for a squad into a formation+style. */
export function greedyFill(squad, formation, style) {
  const slots = getSlots(formation, style)
  const used = new Set()
  return slots.map((slot) => {
    const candidate = [...squad]
      .filter((p) => !used.has(p.playerId) && p.positions.includes(slot.pos))
      .sort((a, b) => b.force - a.force)[0]
    if (candidate) {
      used.add(candidate.playerId)
      return candidate
    }
    return null
  })
}

/** Can this squad field a complete XI in this formation+style? */
export function canFill(squad, formation, style) {
  return greedyFill(squad, formation, style).every(Boolean)
}

/**
 * Choose a formation the drawn squad can actually field — prefer the one the
 * player already picked, then fall back to the first fillable in UI order.
 */
export function pickFillableFormation(squad, style, preferred) {
  if (preferred && canFill(squad, preferred, style)) return preferred
  const fit = FORMATION_KEYS.find((f) => canFill(squad, f, style))
  return fit || preferred || FORMATION_KEYS[0]
}
