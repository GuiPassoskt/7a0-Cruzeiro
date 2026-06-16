# Contract — `game/teams/*` e `game/ratings/*`

Composição de elenco multi-época, fit de formação e cálculo de ratings/força. Sem estado de
app (Constituição I/IV); regras de futebol exclusivamente aqui (Constituição II).

## `squads.js` (existente — movido)

```js
DATASET: SquadEntry[]                 // todas as escalações CRU carregadas + de-ofuscadas
SELECTIONS: string[]                  // códigos de seleção distintos
findEntry(sel, copa): SquadEntry|null
```

## `positions.js` (existente — movido)

```js
POSITION_ORDER: Record<string, number>
POSITION_CODES: string[]
ATTACK_WEIGHTS / DEFENSE_WEIGHTS: Record<string, number>
POSITION_BUCKET: Record<string, string>
```

## `formations.js` (existente — movido)

```js
FORMATIONS: Record<string, Record<style, Slot[]>>
FORMATION_KEYS: string[]
getSlots(formation, style): Slot[]    // 11 slots { pos, x, y }
```

## `lineup.js` (existente — estendido p/ multi-época)

```js
// Pool de jogadores = união de atletas das escalações selecionadas (FR-001/FR-002).
// Cada jogador carrega `era`; nenhum playerId repetido.
buildPlayerPool(selectedEras: string[]): Player[]

// Preenchimento guloso do melhor XI (existente).
greedyFill(squad, formation, style): (Player|null)[]

// Pode escalar XI completo nessa formação+estilo? (FR-004)
canFill(squad, formation, style): boolean

// Escolhe formação que o elenco consegue preencher (existente).
pickFillableFormation(squad, style, preferred): string

// Coloca/troca um jogador num slot, garantindo unicidade de playerId (FR-005).
assignToSlot(lineup, slotIndex, player): Lineup     // rejeita duplicado

// Lineup está completo? (todos os slots preenchidos)
isComplete(lineup): boolean
```

Regras:
- `assignToSlot` MUST recusar um `playerId` já presente em outro slot (FR-005).
- A confirmação do elenco MUST exigir `isComplete === true` (FR-004).
- O pool PODE conter atletas de múltiplas eras simultaneamente (FR-002).

## `ratings/ratings.js` (existente — movido)

```js
// attack/defense = médias ponderadas por posição; overall = média de força (FR-006).
computeRatings(slots: Slot[], filled: (Player|null)[])
  : { attack: number, defense: number, overall: number }
```

## `force.js` (existente — movido, contrato mantido)

```js
realForce(player): number             // 0–255 de-ofuscado
deobfuscatePlayer(player): Player      // + campo `force`
```
