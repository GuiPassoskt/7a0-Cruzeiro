# Contract — `stores/game-store.js` (Pinia)

Estado global de sessão (Constituição IV). O store NÃO contém regra de futebol — delega à
camada `game/`. Pages consomem o store; componentes recebem props/emitem eventos.

## State

```js
{
  availableEras: string[],     // escalações históricas disponíveis
  selectedEras: string[],      // épocas escolhidas p/ compor o pool (multi-época)
  lineup: Lineup,              // elenco montado (slots/players/formation/style)
  championshipKey: string|null,
  seed: { value: string, manual: boolean },
  tournament: TournamentResult|null,  // resultado/estado do torneio (FR-020)
}
```

## Getters (derivados — delegam a `game/`)

```js
playerPool        // buildPlayerPool(selectedEras)
ratings           // computeRatings(lineup.slots, lineup.players)
isLineupComplete  // isComplete(lineup)  (FR-004)
sourceEras        // épocas presentes no lineup (multi-época)
standingsByPhase  // standings/ties por fase do tournament
stats             // aggregateStats(tournament matches)  (FR-018)
```

## Actions (orquestram a camada `game/`; sem regra própria)

```js
toggleEra(era)                 // adiciona/remove época do pool
setFormation(key, style)       // recalcula slots; mantém jogadores compatíveis
assignPlayer(slotIndex, player)// game.assignToSlot — rejeita playerId duplicado (FR-005)
clearSlot(slotIndex)
autoFill()                     // greedyFill do pool atual
selectChampionship(key)        // define competição ativa
setSeed(manualRaw?)            // resolveSeed(); manual ou auto (FR-021)
runTournament()                // exige isLineupComplete; chama simulate.runTournament
                               // e guarda tournament + champion + stats
reset()                        // limpa torneio mantendo elenco
```

Invariantes:
- `runTournament` só executa com `isLineupComplete === true` (FR-004).
- Toda simulação usa `seed.value`; repetir com a mesma seed reproduz resultados (SC-002).
- Estado preservado durante a sessão (FR-020); persistência entre sessões fica p/ evolução.

## `settings-store.js` (existente)

```js
{ manualSeed: string|'' , /* preferências de UI */ }
```
Fornece a seed manual opcional consumida por `setSeed` (FR-021).
