# Quickstart — Jogo 7AOCRUZEIRO (feature 001)

Guia rápido para desenvolver e validar esta feature localmente.

## Pré-requisitos

- Node `>=22` (recomendado conforme `engines`).
- Dependências instaladas: `npm install` (instala Quasar/Vue/Pinia).

## Rodar o app

```bash
npm run dev      # quasar dev — abre o SPA com hot reload
npm run build    # build de produção
npm run lint     # prettier + eslint
```

## Estrutura da camada de domínio (alvo desta feature)

```
src/game/
├── data/squads/        # escalações históricas CRU-*.json (existente)
├── data/adversarys/    # NOVO — adversários por competição (força fixa 0–255)
├── championships/      # NOVO — config por competição (lê data/adversarys)
├── simulation/         # rng, draw, force, simulate, standings, knockout, seed
├── teams/              # formations, lineup (multi-época), positions, squads
├── ratings/            # ratings
├── simConfig.js        # parâmetros globais do modelo
└── stats.js            # NOVO — agregação de estatísticas
```

> Regra de ouro (Constituição): toda regra de futebol vive em `src/game/`. Componentes/pages
> não calculam força nem resultado; stores só guardam estado.

## Fluxo de jogo (o que a feature entrega)

1. **Montar elenco** (US1): escolher épocas → o pool une atletas multi-época → escolher
   formação/estilo → preencher os 11 slots (sem repetir jogador). Força exibida ao vivo.
2. **Simular partida** (US2): com elenco completo, simular contra adversário; placar
   força-dependente com fator aleatório (seed). Mesma seed → mesmo placar.
3. **Disputar campeonato** (US3): escolher competição (Mineiro, Brasileirão, Copa do Brasil,
   Sul-Americana, Libertadores, Mundial) e formato; o sistema gera o torneio, simula todas as
   partidas, conduz fases até um campeão e mostra classificação/resultados/estatísticas.

## Seeds e reprodutibilidade (FR-010/FR-021)

- A seed é gerada automaticamente e exibida; informe uma seed manual para reproduzir um
  campeonato. Mesma seed + mesmo elenco/competição → resultado idêntico.

## Testes (Vitest — dev-only)

```bash
npx vitest run        # roda tests/game/*
```

Cobertura mínima alvo:
- `determinism.spec.js` — mesma seed reproduz partida e campeonato (SC-002).
- `standings.spec.js` — ordem pts→gd→gf→confronto direto→RNG (FR-015).
- `knockout.spec.js` — empate decidido por pênaltis, sem gol fora (FR-015b).
- `distribution.spec.js` — em 1000 jogos forte×fraco: favorito ≥60%, surpresa ≥10% (SC-003);
  ≥95% placares realistas (SC-004).

## Validação manual rápida

1. `npm run dev`, abrir a página de jogo (`pages/index/play.vue`).
2. Selecionar 2+ épocas e montar um XI completo misturando jogadores; conferir força.
3. Anotar a seed exibida; rodar um campeonato; repetir com a mesma seed e conferir resultados
   idênticos.
4. Conferir que classificação/resultados/estatísticas são consistentes entre si (SC-006).
