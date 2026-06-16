// Loads every bundled squad JSON, de-obfuscates player force, and exposes
// helpers to look squads up. For this build only Cruzeiro (CRU) elencos ship.

import { deobfuscatePlayer } from './force.js'

// Eagerly import every squad JSON at build time.
const modules = import.meta.glob('./data/squads/*.json', { eager: true })

/** Display metadata per "seleção" code. */
export const TEAMS = {
  CRU: { code: 'CRU', name: 'Cruzeiro', crest: 'crests/cruzeiro.png' },
  NKT: { code: 'NKT', name: 'Captain Tsubasa', crest: 'crests/captain-tsubasa.png' },
}

function teamMeta(code) {
  return TEAMS[code] || { code, name: code, crest: null }
}

/**
 * dataset: array of { sel, copa, name, crest, squad, avg }
 * squad players carry { playerId, name, positions, number, legend, force }
 */
export const DATASET = Object.values(modules)
  .map((m) => m.default || m)
  .map((raw) => {
    const squad = raw.squad.map(deobfuscatePlayer)
    const avg = squad.reduce((s, p) => s + p.force, 0) / (squad.length || 1)
    const meta = teamMeta(raw.sel)
    return { sel: raw.sel, copa: raw.copa, name: meta.name, crest: meta.crest, squad, avg }
  })
  .sort((a, b) => a.copa - b.copa)

/** All distinct seleção codes present in the dataset. */
export const SELECTIONS = [...new Set(DATASET.map((d) => d.sel))]

/** Find one dataset entry by sel + copa. */
export function findEntry(sel, copa) {
  return DATASET.find((d) => d.sel === sel && d.copa === copa) || null
}

/** Squad players for a sel + copa (empty array if unknown). */
export function squadOf(sel, copa) {
  return findEntry(sel, copa)?.squad || []
}
