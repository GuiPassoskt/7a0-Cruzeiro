# Phase 1 — Data Model: Jogo 7AOCRUZEIRO

Modelo de domínio derivado da spec (Key Entities) e das clarificações. Tipos são descritos de
forma agnóstica; na implementação são objetos JS planos manipulados pela camada `game/` e
guardados no store. Campos marcados `(deriv.)` são calculados, não persistidos.

## Atleta histórico (Player)

Origem: `src/game/data/squads/CRU-<ano>.json` (campo `f` ofuscado, de-ofuscado em `force.js`).

| Campo | Tipo | Regra / Nota |
|-------|------|--------------|
| `playerId` | string | Identidade única do atleta. Único por elenco montado (FR-005). |
| `name` | string | Nome de exibição. |
| `positions` | string[] | Códigos de posição que o atleta pode ocupar (ver POSITION_CODES). |
| `number` | number | Número da camisa (cosmético). |
| `legend` | boolean | Marca ídolo/destaque (cosmético). |
| `force` | number (0–255) | `(deriv.)` de `realForce(player)`. Base de ratings/força. |
| `era` | string | `(deriv.)` ano/escalação de origem (ex.: `"1966"`), p/ exibir mistura multi-época. |

## Escalação histórica (Squad / DATASET entry)

Carregada por `teams/squads.js` via `import.meta.glob('./data/squads/*.json')`.

| Campo | Tipo | Regra / Nota |
|-------|------|--------------|
| `sel` | string | Código da seleção (ex.: `CRU`). |
| `copa` | number\|string | Ano/edição histórica. |
| `name` | string | Nome de exibição do clube. |
| `crest` | string\|null | Caminho do escudo. |
| `squad` | Player[] | Atletas (com `force` de-ofuscado). |
| `avg` | number | `(deriv.)` média de força do elenco. |

## Formação tática (Formation)

De `teams/formations.js`. Cada formação+estilo define 11 slots.

| Campo | Tipo | Regra / Nota |
|-------|------|--------------|
| `key` | string | Ex.: `"4-3-3"`. |
| `style` | string | `defensivo` \| `equilibrado` \| `ofensivo`. |
| `slots` | Slot[] | 11 slots `{ pos, x, y }`; `pos` define a posição exigida. |

## Elenco montado (Lineup / time do jogador)

Entidade central da feature; vive no `game-store`.

| Campo | Tipo | Regra / Nota |
|-------|------|--------------|
| `formation` | string | Formação escolhida. |
| `style` | string | Estilo tático. |
| `slots` | Slot[] | Slots da formação+estilo. |
| `players` | (Player\|null)[] | Aligned aos slots; pode misturar `era` distintas (FR-002). |
| `sourceEras` | string[] | `(deriv.)` épocas presentes no elenco. |
| `complete` | boolean | `(deriv.)` todos os slots preenchidos (FR-004). |
| `ratings` | `{attack,defense,overall}` | `(deriv.)` de `ratings.js` (FR-006). |

Regras: nenhum `playerId` repetido entre slots (FR-005); confirmar só se `complete` (FR-004);
`ratings` recalculado a cada mudança de jogador/formação (US1 cenário 2).

## Time adversário (Opponent)

NOVO — origem: `src/game/data/adversarys/<competicao>.json` (clarificação Q1).

| Campo | Tipo | Regra / Nota |
|-------|------|--------------|
| `id` | string | Identificador do adversário. |
| `label` | string | Nome de exibição (ex.: `"Atlético-MG"`). |
| `crest` | string\|null | Escudo (opcional). |
| `force` | number (0–255) | Força fixa nesta competição (banda 0–255). |

Nota: força fixa por competição; o mesmo clube pode ter `force` diferente entre arquivos de
competições distintas.

## Competição / Campeonato (Championship)

De `game/championships/<comp>.js` (lê `data/adversarys`). Substitui o `TOURNAMENTS` inline.

| Campo | Tipo | Regra / Nota |
|-------|------|--------------|
| `key` | string | `MINEIRO`\|`BRASILEIRAO`\|`COPA_DO_BRASIL`\|`SULAMERICANA`\|`LIBERTADORES`\|`MUNDIAL`. |
| `name` | string | Nome de exibição. |
| `phases` | Phase[] | Sequência de fases. |
| `model` | object | Parâmetros (default herdado de `simConfig.SIM.model`). |

### Phase

| Campo | Tipo | Regra / Nota |
|-------|------|--------------|
| `key` | string | Identificador da fase. |
| `type` | enum | `league` \| `group` \| `knockout` \| `knockout_two_legs`. |
| `rounds` | number? | Para `league` (ex.: 38) — define confrontos. |
| `opponents` | Opponent[]? | Para `league`/`group`: adversários da fase. |
| `opponent` | Opponent? | Para `knockout`/`knockout_two_legs`: adversário do confronto. |
| `advance` | number? | Quantos classificam (group). |

## Partida (Match)

Resultado de `simulate.js`.

| Campo | Tipo | Regra / Nota |
|-------|------|--------------|
| `phase` | string | Fase de origem. |
| `opp` / `oppId` | string | Adversário enfrentado. |
| `oppForce` | number | Força do adversário usada (0–255). |
| `gf` / `ga` | number | Gols pró/contra (Poisson força-dependente). |
| `outcome` | enum | `V` \| `E` \| `D`. |
| `home` | boolean? | Mando de campo aplicado (R9). |
| `scorers` | object[] | Marcadores (cosmético/estatística). |
| `goals` | object[] | Linha do tempo de gols (cosmético). |
| `penalties` | `{me,them,winner}`? | Presente quando houve decisão por pênaltis (FR-015b). |

## Confronto de mata-mata (Tie)

| Campo | Tipo | Regra / Nota |
|-------|------|--------------|
| `type` | enum | `knockout` \| `knockout_two_legs`. |
| `legs` | Match[] | 1 (jogo único) ou 2 (ida e volta). |
| `aggregate` | `{me,them}` | `(deriv.)` soma de gols (ida-e-volta). |
| `decidedByPenalties` | boolean | `(deriv.)` empate resolvido por pênaltis (FR-015b). |
| `winner` | enum | `me` \| `opp`. Sem regra de gol fora (R4). |

## Classificação (Standings)

De `simulation/standings.js`. Linha por equipe.

| Campo | Tipo | Regra / Nota |
|-------|------|--------------|
| `teamId` | string | `me` (Cruzeiro) ou `id` do adversário. |
| `pts` | number | 3/1/0. |
| `gf` / `ga` / `gd` | number | Gols pró/contra/saldo. |
| `w` / `d` / `l` | number | Vitórias/empates/derrotas. |
| `pos` | number | `(deriv.)` posição após ordenação. |

Ordenação (FR-015): `pts → gd → gf → confronto direto → RNG semeável`.

## Estatística (Stats)

De `game/stats.js` (FR-018). Agregado por equipe/competição.

| Campo | Tipo | Regra / Nota |
|-------|------|--------------|
| `played` | number | Jogos disputados. |
| `w`/`d`/`l` | number | Resultados. |
| `gf`/`ga`/`gd` | number | Gols. |
| `winRate` | number | `(deriv.)` aproveitamento (%). |
| `topScorers` | object[] | `(deriv.)` artilheiros (agrega `scorers`). |

Consistência (SC-006): soma de `w+d+l` == nº de partidas; `gf/ga` conferem com as partidas.

## Seed

| Campo | Tipo | Regra / Nota |
|-------|------|--------------|
| `value` | string | String de seed efetiva (exibida ao jogador). |
| `manual` | boolean | `true` se informada pelo jogador (FR-021). |

Determinismo: mesma `value` + mesmas entradas → mesmos resultados (FR-010/SC-002). Geração
automática deriva de entradas + contador de sessão via `rng.js` (sem `Math.random()`).

## Estado de sessão (game-store)

| Campo | Tipo | Nota |
|-------|------|------|
| `lineup` | Lineup | Elenco montado atual (FR-020). |
| `availableEras` | string[] | Escalações históricas disponíveis para mistura. |
| `selectedEras` | string[] | Épocas escolhidas para compor o pool. |
| `championshipKey` | string\|null | Competição ativa. |
| `seed` | Seed | Seed efetiva do torneio (FR-021). |
| `tournament` | object\|null | Estado/resultados do campeonato em andamento (FR-020). |

## Diagrama de relacionamentos (texto)

- `Squad` 1—N `Player`; `Lineup` referencia N `Player` (de 1+ `Squad` distintas → multi-época).
- `Championship` 1—N `Phase`; `Phase` referencia N `Opponent` (de `data/adversarys`).
- `Phase(group/league)` → `Standings` (N linhas); `Phase(knockout*)` → `Tie` (1—N `Match`).
- `Championship` → `Stats` (agregado de todas as `Match`).
- `Seed` parametriza toda simulação (`Match`, `Tie`, desempates).
