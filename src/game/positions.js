// Position codes, display order, and the per-position rating weights.

/** Canonical display/sort order of the 12 position codes. */
export const POSITION_ORDER = {
  GOL: 0,
  LD: 1,
  LE: 2,
  ZAG: 3,
  MD: 4,
  ME: 5,
  VOL: 6,
  MC: 7,
  MEI: 8,
  PD: 9,
  PE: 10,
  CA: 11,
}

export const POSITION_CODES = Object.keys(POSITION_ORDER)

/** Attack contribution per slot position (used for the box "ataque" rating). */
export const ATTACK_WEIGHTS = {
  GOL: 0,
  LD: 0,
  ZAG: 0,
  LE: 0,
  MD: 0.5,
  ME: 0.5,
  VOL: 0.2,
  MC: 0.5,
  MEI: 0.8,
  PD: 1,
  CA: 1,
  PE: 1,
}

/** Defense contribution per slot position (used for the box "defesa" rating). */
export const DEFENSE_WEIGHTS = {
  GOL: 1,
  LD: 1,
  ZAG: 1,
  LE: 1,
  MD: 0.5,
  ME: 0.5,
  VOL: 0.8,
  MC: 0.5,
  MEI: 0.2,
  PD: 0,
  CA: 0,
  PE: 0,
}

/** Coarse buckets used only for goal-scorer attribution. */
export const POSITION_BUCKET = {
  GOL: 'GK',
  LD: 'DEF',
  ZAG: 'DEF',
  LE: 'DEF',
  MD: 'MID',
  ME: 'MID',
  VOL: 'VOL',
  MC: 'MID',
  MEI: 'MEI',
  PD: 'ATT',
  CA: 'ATT',
  PE: 'ATT',
}

/** Sort player positions into canonical order. */
export function sortPositions(positions) {
  return [...positions].sort((a, b) => POSITION_ORDER[a] - POSITION_ORDER[b])
}
