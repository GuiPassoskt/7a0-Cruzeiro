// Box-score ratings: attack & defense are position-weighted means (keyed off
// the slot position), overall is the plain mean of the filled players' force.

import { ATTACK_WEIGHTS, DEFENSE_WEIGHTS } from './positions.js'

/**
 * @param {{pos:string}[]} slots formation slots
 * @param {(object|null)[]} filled players aligned to slots (each has .force)
 * @returns {{attack:number, defense:number, overall:number}}
 */
export function computeRatings(slots, filled) {
  let aNum = 0
  let aDen = 0
  let dNum = 0
  let dDen = 0
  let oSum = 0
  let oCount = 0

  slots.forEach((slot, i) => {
    const player = filled[i]
    const wA = ATTACK_WEIGHTS[slot.pos] ?? 0
    const wD = DEFENSE_WEIGHTS[slot.pos] ?? 0
    aDen += wA
    dDen += wD
    if (player) {
      aNum += player.force * wA
      dNum += player.force * wD
      oSum += player.force
      oCount++
    }
  })

  return {
    attack: aDen > 0 ? Math.round(aNum / aDen) : 0,
    defense: dDen > 0 ? Math.round(dNum / dDen) : 0,
    overall: oCount > 0 ? Math.round(oSum / oCount) : 0,
  }
}
