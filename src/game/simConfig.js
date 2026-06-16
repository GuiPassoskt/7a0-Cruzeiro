// Simulation tuning.
//
// The match model (lambda/Poisson, penalty tilt, badge threshold) is taken
// verbatim from the original build. The opponent strengths, however, are
// re-scaled: the original ships opponent "overall" values on a 0–99 band,
// while the squad files de-obfuscate to a 0–255 force band — comparing the
// two directly makes every team win 7–0. To keep results PLAUSIBLE (as opted
// for), opponents are placed on the same 0–255 force band and escalate from
// the group stage to a championship-hard final.

export const SIM = {
  phases: [
    {
      key: 'GRUPOS',
      type: 'group',
      opponents: [
        { label: 'Grupo · 1º jogo', overall: 95 },
        { label: 'Grupo · 2º jogo', overall: 110 },
        { label: 'Grupo · 3º jogo', overall: 125 },
      ],
    },
    { key: 'OITAVAS', type: 'knockout', opponent: { label: 'Oitavas', overall: 140 } },
    { key: 'QUARTAS', type: 'knockout', opponent: { label: 'Quartas', overall: 152 } },
    { key: 'SEMI', type: 'knockout', opponent: { label: 'Semifinal', overall: 164 } },
    { key: 'FINAL', type: 'knockout', opponent: { label: 'Final', overall: 176 } },
  ],
  model: { baseLambda: 1.4, slope: 0.08, minLambda: 0.15, maxLambda: 5 },
  penalty: { base: 0.5, slope: 0.012, min: 0.1, max: 0.9 },
  badge: { esmagadorGD: 18 },
}

export const TOURNAMENTS = {
  MINEIRO: {
    name: 'Campeonato Mineiro',
    phases: [
      {
        key: 'CLASSIFICACAO',
        type: 'group',
        opponents: [
          { label: 'América-MG', overall: 140 },
          { label: 'Atlético-MG', overall: 190 },
          { label: 'Tombense', overall: 125 },
          { label: 'Villa Nova', overall: 115 },
          { label: 'Athletic', overall: 135 },
          { label: 'Pouso Alegre', overall: 120 },
        ],
      },
      {
        key: 'SEMI',
        type: 'knockout',
        opponent: { label: 'Semifinal', overall: 170 },
      },
      {
        key: 'FINAL',
        type: 'knockout',
        opponent: { label: 'Final', overall: 185 },
      },
    ],
    model: { baseLambda: 1.4, slope: 0.08, minLambda: 0.15, maxLambda: 5 },
    penalty: { base: 0.5, slope: 0.012, min: 0.1, max: 0.9 },
    badge: { esmagadorGD: 18 },
  },

  BRASILEIRAO: {
    name: 'Campeonato Brasileiro',
    phases: [
      {
        key: 'PONTOS_CORRIDOS',
        type: 'league',
        rounds: 38,
      },
    ],
    model: { baseLambda: 1.4, slope: 0.08, minLambda: 0.15, maxLambda: 5 },
    penalty: { base: 0.5, slope: 0.012, min: 0.1, max: 0.9 },
    badge: { esmagadorGD: 18 },
  },

  COPA_DO_BRASIL: {
    name: 'Copa do Brasil',
    phases: [
      {
        key: 'TERCEIRA_FASE',
        type: 'knockout',
        opponent: { label: '3ª Fase', overall: 145 },
      },
      {
        key: 'OITAVAS',
        type: 'knockout',
        opponent: { label: 'Oitavas', overall: 160 },
      },
      {
        key: 'QUARTAS',
        type: 'knockout',
        opponent: { label: 'Quartas', overall: 170 },
      },
      {
        key: 'SEMI',
        type: 'knockout',
        opponent: { label: 'Semi', overall: 180 },
      },
      {
        key: 'FINAL',
        type: 'knockout',
        opponent: { label: 'Final', overall: 190 },
      },
    ],
    model: { baseLambda: 1.4, slope: 0.08, minLambda: 0.15, maxLambda: 5 },
    penalty: { base: 0.5, slope: 0.012, min: 0.1, max: 0.9 },
    badge: { esmagadorGD: 18 },
  },

  SULAMERICANA: {
    name: 'Copa Sul-Americana',
    phases: [
      {
        key: 'GRUPOS',
        type: 'group',
        opponents: [
          { label: 'Grupo 1', overall: 145 },
          { label: 'Grupo 2', overall: 155 },
          { label: 'Grupo 3', overall: 165 },
        ],
      },
      {
        key: 'PLAYOFF',
        type: 'knockout',
        opponent: { label: 'Playoff', overall: 170 },
      },
      {
        key: 'OITAVAS',
        type: 'knockout',
        opponent: { label: 'Oitavas', overall: 180 },
      },
      {
        key: 'QUARTAS',
        type: 'knockout',
        opponent: { label: 'Quartas', overall: 190 },
      },
      {
        key: 'SEMI',
        type: 'knockout',
        opponent: { label: 'Semi', overall: 200 },
      },
      {
        key: 'FINAL',
        type: 'knockout',
        opponent: { label: 'Final', overall: 210 },
      },
    ],
    model: { baseLambda: 1.4, slope: 0.08, minLambda: 0.15, maxLambda: 5 },
    penalty: { base: 0.5, slope: 0.012, min: 0.1, max: 0.9 },
    badge: { esmagadorGD: 18 },
  },

  LIBERTADORES: {
    name: 'Copa Libertadores',
    phases: [
      {
        key: 'GRUPOS',
        type: 'group',
        opponents: [
          { label: 'Grupo 1', overall: 180 },
          { label: 'Grupo 2', overall: 190 },
          { label: 'Grupo 3', overall: 200 },
        ],
      },
      {
        key: 'OITAVAS',
        type: 'knockout',
        opponent: { label: 'Oitavas', overall: 210 },
      },
      {
        key: 'QUARTAS',
        type: 'knockout',
        opponent: { label: 'Quartas', overall: 220 },
      },
      {
        key: 'SEMI',
        type: 'knockout',
        opponent: { label: 'Semi', overall: 230 },
      },
      {
        key: 'FINAL',
        type: 'knockout',
        opponent: { label: 'Final', overall: 240 },
      },
    ],
    model: { baseLambda: 1.4, slope: 0.08, minLambda: 0.15, maxLambda: 5 },
    penalty: { base: 0.5, slope: 0.012, min: 0.1, max: 0.9 },
    badge: { esmagadorGD: 18 },
  },
}

/** Number of group matches considered before standings are computed. */
export const KNOCKOUT_DRAW_BIAS = 3

/** Phase labels for display. */
export const PHASE_LABELS = {
  GRUPOS: 'GRUPOS',
  OITAVAS: 'OITAVAS',
  QUARTAS: 'QUARTAS',
  SEMI: 'SEMI',
  FINAL: 'FINAL',
}
