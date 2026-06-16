# Contract — `game/simulation/*`

Contratos das funções puras de simulação. Toda aleatoriedade passa por `rng.js`
(Constituição III). Funções são determinísticas: mesmas entradas + mesma seed → mesma saída.

## `rng.js` (existente — contrato mantido)

```js
makeRng(seedString: string): () => number   // float [0,1), determinístico
pick(rng, arr): any
pickWeighted(rng, items, weights): any
clamp(x, min, max): number
```

## `seed.js` (NOVO)

```js
// Gera uma string de seed determinística a partir de entradas + contador de sessão.
// NÃO usa Math.random().
generateSeed(inputs: { eras: string[], championshipKey: string, counter: number,
                       stamp?: string }): string

// Normaliza/valida uma seed manual fornecida pelo jogador.
normalizeSeed(raw: string): string

// Retorna { value, manual } pronto para o store.
resolveSeed(manualRaw?: string, autoInputs?: object): { value: string, manual: boolean }
```

Regras: `manual=true` quando `manualRaw` não vazio; caso contrário gera via `generateSeed`.

## `simulate.js` (existente — estendido)

```js
// Resolve UMA partida (regulation). Determinística pelo rng passado.
scoreMatch(rng, attack: number, defense: number, oppForce: number)
  : { gf: number, ga: number, outcome: 'V'|'E'|'D' }

// Aplica mando de campo opcional (R9) sobre attack/overall do mandante.
withHomeAdvantage(ratings, isHome: boolean): { attack, defense, overall }

// Driver de torneio: percorre as fases da competição e produz o resultado completo.
runTournament(args: {
  championshipKey: string,
  lineup: { ratings, players },
  seed: string,
}): {
  championshipKey: string,
  seed: string,
  phases: PhaseResult[],     // por fase: matches/standings/ties conforme type
  champion: 'me'|'opp'|null, // único campeão ao final (FR-014)
  stats: Stats,              // agregado (via stats.js)
}
```

Regras:
- `runTournament` MUST concluir com exatamente um campeão e nenhuma partida pendente quando o
  formato define um vencedor (SC-005).
- Placar via Poisson força-dependente; favorito vence a maioria, com zebras (SC-003/004).
- Eliminação interrompe fases seguintes em mata-mata.

## `standings.js` (NOVO)

```js
// Tabela de liga/grupos com ordenação determinística (FR-015).
computeStandings(rng, entries: StandingInput[]): Standing[]
// Ordem: pts → gd → gf → confronto direto → RNG semeável.

// Quem avança numa fase de grupos.
qualifiers(standings: Standing[], advance: number): teamId[]
```

## `knockout.js` (NOVO)

```js
// Confronto jogo único. Empate → pênaltis via rng (FR-015b).
playKnockout(rng, me, opp): Tie

// Confronto ida e volta. Agregado; empate agregado → pênaltis (sem gol fora).
playTwoLegs(rng, me, opp): Tie
// Tie: { type, legs: Match[], aggregate, decidedByPenalties, winner }
```

## `stats.js` (NOVO)

```js
// Agrega estatísticas de uma competição a partir das partidas (FR-018).
aggregateStats(matches: Match[]): Stats
// Stats consistente com as partidas (SC-006).
```
