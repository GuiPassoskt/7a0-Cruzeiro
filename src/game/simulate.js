// Match & campaign simulation, reconstructed from the original 7a0 engine.

import { makeRng, clamp } from './rng.js'
import { SIM, KNOCKOUT_DRAW_BIAS } from './simConfig.js'
import { POSITION_BUCKET } from './positions.js'

// ---------------------------------------------------------------------------
// Match scoring
// ---------------------------------------------------------------------------

function lambda(myRating, oppRating) {
  const { baseLambda, slope, minLambda, maxLambda } = SIM.model
  return clamp(baseLambda + (myRating - oppRating) * slope, minLambda, maxLambda)
}

/** Knuth Poisson sampler. */
function poisson(rng, lam) {
  if (lam <= 0) return 0
  const L = Math.exp(-lam)
  let k = 0
  let p = 1
  do {
    k++
    p *= rng()
  } while (p > L)
  return k - 1
}

/** One regulation result. gf uses attack vs opp, ga uses opp vs defense. */
function scoreMatch(rng, attack, defense, oppOverall) {
  const gf = poisson(rng, lambda(attack, oppOverall))
  const ga = poisson(rng, lambda(oppOverall, defense))
  return { gf, ga, outcome: gf > ga ? 'V' : gf < ga ? 'D' : 'E' }
}

// ---------------------------------------------------------------------------
// Goal scorers & minutes (cosmetic timeline)
// ---------------------------------------------------------------------------

const SCORE_W = { GK: 0.01, DEF: 0.12, VOL: 0.22, MID: 0.45, MEI: 0.7, ATT: 1 }
const SPECIAL_GKS = new Set(['rogerio-ceni', 'jose-luis-chilavert', 'rene-higuita'])

function pickScorers(rng, players, nGoals, { isKnockout } = {}) {
  if (nGoals <= 0 || players.length === 0) return []
  const isGK = (p) => p.positions.includes('GOL')
  const isSpecialGK = (p) => !!p.playerId && SPECIAL_GKS.has(p.playerId)
  const baseW = (p) =>
    Math.max(...p.positions.map((pos) => SCORE_W[POSITION_BUCKET[pos]] ?? 0.1)) * p.force

  const w = players.map((p) =>
    isGK(p) && !isSpecialGK(p) ? 0 : isGK(p) && isSpecialGK(p) ? 0.25 * p.force : baseW(p),
  )

  const out = []
  for (let i = 0; i < nGoals; i++) {
    const last = i === nGoals - 1
    const allowGK = isKnockout === true && last
    const ww = w.map((wi, idx) => {
      const p = players[idx]
      return isGK(p) && !isSpecialGK(p) ? (allowGK ? 0.15 * baseW(p) : 0) : wi
    })
    const total = ww.reduce((s, x) => s + x, 0)
    if (total <= 0) {
      out.push(players[0].name)
      continue
    }
    let r = rng() * total
    let j = 0
    for (; j < ww.length - 1 && !((r -= ww[j]) <= 0); j++);
    out.push(players[j].name)
    w[j] *= 0.45
  }
  return out
}

function goalMinutes(rng, count) {
  if (count <= 0) return []
  const set = new Set()
  let guard = 0
  while (set.size < count && guard < 1000) {
    guard++
    set.add(1 + Math.floor(90 * Math.pow(rng(), 0.85)))
  }
  return [...set].sort((a, b) => a - b)
}

/** Merge scored + conceded goals into a sorted timeline. */
function buildGoals(rng, scorers, conceded) {
  const mins = goalMinutes(rng, scorers.length)
  const concMins = goalMinutes(rng, conceded.length)
  return [
    ...mins.map((m, i) => ({ min: m, scorer: scorers[i], opp: false })),
    ...concMins.map((m, i) => ({ min: m, scorer: conceded[i], opp: true })),
  ].sort((a, b) => a.min - b.min)
}

// ---------------------------------------------------------------------------
// Penalty shootout (best of 5 + sudden death), cosmetic
// ---------------------------------------------------------------------------

const sum = (a) => a.reduce((s, x) => s + x, 0)

function shootout(rng, meWon) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const me = Array.from({ length: 5 }, () => +(0.78 > rng()))
    const them = Array.from({ length: 5 }, () => +(0.78 > rng()))
    const o = sum(me)
    const i = sum(them)
    if ((meWon ? o : i) > (meWon ? i : o)) {
      return { me, them, score: `${o}–${i}` }
    }
    if (o === i) {
      const sdMe = []
      const sdThem = []
      let dMe = o
      let dThem = i
      let g = 0
      while (dMe === dThem && g < 5) {
        g++
        const a = +(0.78 > rng())
        const b = +(0.78 > rng())
        if (a !== b) {
          const x = +!!meWon
          const y = +!meWon
          sdMe.push(x)
          sdThem.push(y)
          dMe += x
          dThem += y
        } else {
          sdMe.push(a)
          sdThem.push(b)
          dMe += a
          dThem += b
        }
      }
      return { me, them, score: `${dMe}–${dThem}`, sd: { me: sdMe, them: sdThem } }
    }
  }
  return meWon
    ? { me: [1, 0, 0, 0, 0], them: [0, 0, 0, 0, 0], score: '1–0' }
    : { me: [0, 0, 0, 0, 0], them: [1, 0, 0, 0, 0], score: '0–1' }
}

// ---------------------------------------------------------------------------
// Group standings
// ---------------------------------------------------------------------------

function computeGroupTable(rng, myResults, oppOveralls) {
  const me = {
    pts: myResults.reduce((s, r) => s + (r.outcome === 'V' ? 3 : +(r.outcome === 'E')), 0),
    gd: myResults.reduce((s, r) => s + (r.gf - r.ga), 0),
    gf: myResults.reduce((s, r) => s + r.gf, 0),
    me: true,
    oppIndex: -1,
  }
  const rows = oppOveralls.map((ov, i) => {
    const r = myResults[i]
    return {
      pts: r.outcome === 'D' ? 3 : +(r.outcome === 'E'),
      gd: r.ga - r.gf,
      gf: r.ga,
      me: false,
      oppIndex: i,
    }
  })
  for (let i = 0; i < oppOveralls.length; i++) {
    for (let j = i + 1; j < oppOveralls.length; j++) {
      const r = scoreMatch(rng, oppOveralls[i], oppOveralls[i], oppOveralls[j])
      if (r.outcome === 'V') rows[i].pts += 3
      else if (r.outcome === 'E') {
        rows[i].pts += 1
        rows[j].pts += 1
      } else rows[j].pts += 3
      rows[i].gd += r.gf - r.ga
      rows[i].gf += r.gf
      rows[j].gd += r.ga - r.gf
      rows[j].gf += r.ga
    }
  }
  const standings = [me, ...rows].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
  return { standings, advanced: standings.findIndex((r) => r.me) < 2 }
}

// ---------------------------------------------------------------------------
// Campaign driver
// ---------------------------------------------------------------------------

/**
 * @param {object} args
 * @param {number} args.attack
 * @param {number} args.defense
 * @param {string} args.seed base seed string (e.g. `${SEED}:copa`)
 * @param {object[]} args.squad my 11 players (with .force)
 * @returns campaign result object
 */
export function runCampaign({ attack, defense, seed, squad }) {
  const rng = makeRng(seed)
  const goalsRng = makeRng(`${seed}:gols`)
  const avg = (attack + defense) / 2
  const campaign = []
  let wins = 0
  let draws = 0
  let losses = 0
  let gf = 0
  let ga = 0
  let eliminated = false
  let fixtureIdx = 0

  for (const phase of SIM.phases) {
    if (eliminated) break

    if (phase.type === 'group') {
      const myResults = []
      for (const opp of phase.opponents) {
        const m = scoreMatch(rng, attack, defense, opp.overall)
        const minSeed = fixtureIdx++
        gf += m.gf
        ga += m.ga
        if (m.outcome === 'V') wins++
        else if (m.outcome === 'E') draws++
        else losses++
        const scorers = pickScorers(goalsRng, squad, m.gf, { isKnockout: false })
        campaign.push({
          phase: phase.key,
          opp: opp.label,
          oppOverall: opp.overall,
          gf: m.gf,
          ga: m.ga,
          outcome: m.outcome,
          advanced: true,
          scorers,
          goals: buildGoals(
            makeRng(`${seed}:min:${minSeed}`),
            scorers,
            Array(m.ga).fill('Adversário'),
          ),
        })
        myResults.push(m)
      }
      if (KNOCKOUT_DRAW_BIAS >= 2) {
        const { standings, advanced } = computeGroupTable(
          rng,
          myResults,
          phase.opponents.map((o) => o.overall),
        )
        if (!advanced) eliminated = true
        campaign[campaign.length - 1].groupTable = standings
      }
      continue
    }

    // knockout
    const opp = phase.opponent
    const m = scoreMatch(rng, attack, defense, opp.overall)
    const minSeed = fixtureIdx++
    gf += m.gf
    ga += m.ga

    let advanced
    if (m.outcome === 'V') advanced = true
    else if (m.outcome === 'D') advanced = false
    else {
      const { base, slope, min, max } = SIM.penalty
      const pWin = clamp(base + (avg - opp.overall) * slope, min, max)
      advanced = rng() < pWin
    }
    advanced ? wins++ : losses++
    const wasDraw = m.outcome === 'E'
    const scorers = pickScorers(goalsRng, squad, m.gf, { isKnockout: true })
    campaign.push({
      phase: phase.key,
      opp: opp.label,
      oppOverall: opp.overall,
      gf: m.gf,
      ga: m.ga,
      outcome: m.outcome,
      advanced,
      penalties: wasDraw,
      scorers,
      goals: buildGoals(
        makeRng(`${seed}:min:${minSeed}`),
        scorers,
        new Array(m.ga).fill('Adversário'),
      ),
      pens: wasDraw ? shootout(makeRng(`${seed}:pen:${minSeed}`), advanced) : undefined,
    })
    if (!advanced) eliminated = true
  }

  const champion = !eliminated
  const perfect = champion && wins === 7 && draws === 0 && losses === 0
  const muralha = champion && ga === 0
  const badge =
    perfect && gf - ga >= SIM.badge.esmagadorGD
      ? 'ESMAGADOR DE RECORDES'
      : muralha
        ? 'MURALHA'
        : null
  const sevenZero = campaign.some((m) => m.gf - m.ga >= 7)

  return {
    record: `${wins}-${losses}`,
    champion,
    perfect,
    muralha,
    sevenZero,
    unbeaten: losses === 0,
    wins,
    draws,
    losses,
    gf,
    ga,
    campaign,
    badge,
  }
}
