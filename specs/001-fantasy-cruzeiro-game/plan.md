# Implementation Plan: Jogo 7AOCRUZEIRO — Elenco Histórico, Simulação e Campeonatos

**Branch**: `001-fantasy-cruzeiro-game` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-fantasy-cruzeiro-game/spec.md`

## Summary

Entregar a experiência central do 7AOCRUZEIRO: montar um elenco do Cruzeiro misturando
atletas de escalações históricas de épocas diferentes, calcular a força do time, simular
partidas determinísticas (com fator aleatório controlado), gerar campeonatos completos nos
quatro formatos (liga, grupos, mata-mata, ida e volta) para as seis competições suportadas,
e apresentar classificação, resultados e estatísticas.

Abordagem técnica: aproveitar o motor já reconstruído na camada `src/game/` (RNG
determinístico `mulberry32`/`xmur3`, modelo de gols de Poisson em `simulate.js`, força
de-ofuscada em `force.js`, formações/lineup/ratings). O trabalho desta feature concentra-se
em: (1) permitir composição de elenco multi-época em `teams/lineup`; (2) externalizar os
adversários para dados (`game/data/adversarys`) conforme clarificação; (3) implementar a
classificação de liga e os critérios de desempate (FR-015) e a decisão por pênaltis no
mata-mata (FR-015b); (4) expor seed automática com override manual (FR-021); e (5)
apresentar standings/resultados/estatísticas nas pages, sem regra de jogo na UI.

## Technical Context

**Language/Version**: JavaScript (ES Modules), Node `>=22` (engines: `>=26 || ^24 || ^22.12`)

**Primary Dependencies**: Quasar `^2.20`, Vue `^3.5` (Composition API), Pinia `^3`,
vue-router `^5`. Sem novas dependências de runtime.

**Storage**: Offline-first. Dados históricos e adversários como JSON empacotado em
`src/game/data/` (carregados via `import.meta.glob`). Estado de sessão em stores Pinia
(elenco montado, torneio ativo, resultados). Persistência entre sessões fica como evolução.

**Testing**: Vitest (dev-only) para testes determinísticos da camada `game/` — ver
[research.md](./research.md). Justificado pela Constituição (verificação de determinismo) e
não embarcado no bundle.

**Target Platform**: SPA no navegador (Quasar/Vite), capaz de operar offline.

**Project Type**: Aplicação single-project (frontend Quasar SPA). Camadas: `game/` (domínio)
· `stores/` (estado) · `pages/` (orquestração) · `components/` (apresentação).

**Performance Goals**: Simular um campeonato completo em <100ms; UI a 60fps; montagem de
elenco responde a interações em <50ms.

**Constraints**: Determinismo total por seed (FR-010, SC-002); offline-capable (FR-019);
regras de futebol exclusivamente em `game/` (Constituição I/II); toda aleatoriedade via
`rng.js` (Constituição III/VI).

**Scale/Scope**: 6 competições · 4 formatos de torneio · ~11+ escalações históricas (CRU) ·
elenco de 11 titulares · poucas dezenas de adversários pré-definidos · ~6 pages.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Avaliação contra os princípios I–VI da [constituição](../../.specify/memory/constitution.md):

| Princípio | Avaliação | Status |
|-----------|-----------|--------|
| I. Separação de camadas | Toda lógica nova vai para `game/`; pages só orquestram; cálculo de força/standings fora de componentes. | PASS |
| II. Regras de futebol em `game/` | Standings, desempate, pênaltis, league → módulos em `game/`; adversários em `game/data`. Fontes canônicas preservadas (`force.js`, `simulate.js`, `simConfig.js`). | PASS |
| III. Determinismo & `rng.js` | RNG semeável já central; novas decisões (desempate, pênaltis, seed auto) consomem `rng.js`. Nenhum `Math.random()` novo. | PASS |
| IV. Estado global em stores | Elenco, torneio, resultados em Pinia; `game/` permanece sem estado de app. | PASS |
| V. Realismo com surpresa | Modelo de Poisson força-dependente mantido; favorito vence a maioria com zebras possíveis (SC-003/004). | PASS |
| VI. Stack mínima offline-first | Sem deps de runtime novas; Vitest é dev-only e justificado. | PASS (com justificativa) |

**Resultado do gate (pré-Phase 0)**: PASS. Nenhuma violação. Ver Complexity Tracking (vazio).

**Re-avaliação pós-Phase 1**: PASS. O design (data-model + contratos) mantém regras em
`game/`, estado em stores e determinismo via `rng.js`; nenhuma nova violação introduzida.

## Project Structure

### Documentation (this feature)

```text
specs/001-fantasy-cruzeiro-game/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Phase 0 (/speckit-plan)
├── data-model.md        # Phase 1 (/speckit-plan)
├── quickstart.md        # Phase 1 (/speckit-plan)
├── contracts/           # Phase 1 (/speckit-plan)
│   ├── game-simulation.md
│   ├── game-teams.md
│   ├── game-championships.md
│   └── store-game.md
└── tasks.md             # Phase 2 (/speckit-tasks — NÃO criado aqui)
```

### Source Code (repository root)

Estrutura-alvo de `src/game/` adotada nesta feature (alinhada ao roadmap da Constituição),
preservando as responsabilidades canônicas dos módulos durante a migração:

```text
src/
├── game/
│   ├── data/
│   │   ├── squads/                 # Escalações históricas CRU-*.json (existente)
│   │   └── adversarys/             # NOVO: adversários por competição (força fixa)
│   │       ├── mineiro.json
│   │       ├── brasileirao.json
│   │       ├── copa-do-brasil.json
│   │       ├── sulamericana.json
│   │       ├── libertadores.json
│   │       └── mundial.json
│   ├── championships/              # NOVO: config por competição (lê data/adversarys)
│   │   ├── index.js                # registro/lookup de competições
│   │   ├── mineiro.js
│   │   ├── brasileirao.js
│   │   ├── copa-do-brasil.js
│   │   ├── sulamericana.js
│   │   ├── libertadores.js
│   │   └── mundial.js
│   ├── simulation/
│   │   ├── rng.js                  # (movido) PRNG determinístico
│   │   ├── draw.js                 # (movido)
│   │   ├── force.js                # (movido) cálculo/de-ofuscação de força
│   │   ├── simulate.js             # (movido) partidas + drivers de torneio
│   │   ├── standings.js            # NOVO: tabela de liga/grupos + desempate (FR-015)
│   │   ├── knockout.js             # NOVO: jogo único / ida-e-volta / pênaltis (FR-015b)
│   │   └── seed.js                 # NOVO: geração/normalização de seed (FR-021)
│   ├── teams/
│   │   ├── formations.js           # (movido)
│   │   ├── lineup.js               # (movido) + composição multi-época
│   │   ├── positions.js            # (movido)
│   │   └── squads.js               # (movido) carga de escalações
│   ├── ratings/
│   │   └── ratings.js              # (movido)
│   ├── simConfig.js                # parâmetros globais de modelo (model/penalty/badge)
│   └── stats.js                    # NOVO: agregação de estatísticas (FR-018)
├── stores/
│   ├── game-store.js               # elenco montado + torneio ativo + resultados
│   └── settings-store.js           # seed manual opcional, preferências
├── pages/
│   └── index/
│       ├── play.vue                # orquestra montagem + simulação
│       ├── (index).vue
│       └── ...                     # standings/resultados/estatísticas
└── components/
    └── play/                       # PitchView, PlayerPool, BoxScore, etc. (apresentação)

tests/
└── game/                           # NOVO: testes Vitest da camada de domínio
    ├── determinism.spec.js
    ├── standings.spec.js
    ├── knockout.spec.js
    └── distribution.spec.js        # SC-003/SC-004 (estatístico)
```

**Structure Decision**: Aplicação single-project Quasar SPA. Adota-se a estrutura-alvo de
`src/game/` (`championships/`, `simulation/`, `teams/`, `ratings/`) já nesta feature, pois
ela toca praticamente todos esses módulos — concentrar a migração aqui evita refatoração
dupla. A migração move arquivos sem alterar contratos: `force.js`, `simulate.js`, `rng.js`,
`draw.js` e a configuração de competições permanecem os pontos canônicos de suas
responsabilidades. Imports são atualizados no mesmo passo. `simConfig.js` permanece na raiz
de `game/` como fonte dos parâmetros globais do modelo; a configuração específica de cada
competição passa a `championships/`.

## Complexity Tracking

> Nenhuma violação da Constituição a justificar. Seção intencionalmente vazia.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (nenhuma) | — | — |
