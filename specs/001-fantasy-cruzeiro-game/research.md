# Phase 0 — Research: Jogo 7AOCRUZEIRO

Consolida decisões que resolvem os "NEEDS CLARIFICATION" do Technical Context e os pontos
diferidos da clarificação (fórmula de força, mando de campo). Todos os itens abaixo estão
RESOLVIDOS.

## R1 — Framework de testes

- **Decision**: Adotar **Vitest** como dependência de desenvolvimento, com testes em
  `tests/game/`.
- **Rationale**: O projeto usa Vite (`@quasar/app-vite`); Vitest é nativo de Vite, sem custo
  de configuração extra, roda em Node puro e é ideal para testar a camada `game/` (funções
  puras determinísticas). A Constituição exige determinismo verificável (SC-002) e
  distribuição estatística (SC-003/SC-004) — testar isso requer um runner. Como é dev-only e
  não vai ao bundle, respeita o princípio VI ("sem dependências desnecessárias" de runtime).
- **Alternatives considered**: Jest (mais pesado, não-Vite); sem testes automatizados
  (rejeitado — impossível validar SC-002/003/004 com confiança).

## R2 — Origem e modelagem dos adversários (clarificação Q1)

- **Decision**: Adversários são clubes pré-definidos em `src/game/data/adversarys/<comp>.json`,
  cada um com **força fixa por competição** na mesma banda 0–255 da força de-ofuscada dos
  elencos. `championships/<comp>.js` carrega esses dados e define fases/formato. O jogador
  monta apenas o Cruzeiro.
- **Rationale**: Menor escopo que viabiliza campeonatos realistas e determinísticos; evita
  obrigar o jogador a montar ~20 elencos. A banda 0–255 evita o problema histórico de
  "vitórias 7–0" documentado em `simConfig.js` (adversários a 0–99 vs força 0–255).
- **Alternatives considered**: (B) montar todos os times com o motor de força — alto custo de
  dados/UX; (C) força procedural por faixa — menos previsível e mais difícil de balancear.
  Ambos rejeitados na clarificação.

## R3 — Critérios de desempate de liga/grupos (clarificação Q2)

- **Decision**: Ordem determinística: **pontos → saldo de gols → gols marcados → confronto
  direto → desempate final via RNG semeável**. Implementado em `simulation/standings.js`.
- **Rationale**: Padrão dominante no futebol brasileiro/CONMEBOL; o RNG semeável garante
  desempate total mantendo reprodutibilidade (FR-010). O `computeGroupTable` atual ordena só
  por `pts → gd → gf`; será estendido para incluir confronto direto + RNG.
- **Alternatives considered**: ordenar por vitórias antes do saldo (B); confronto direto antes
  do saldo (C). Rejeitados na clarificação.

## R4 — Desempate de mata-mata (clarificação Q3)

- **Decision**: Empate em jogo único ou no agregado de ida-e-volta → **pênaltis via RNG
  semeável**, com leve vantagem ao time de maior força; **sem regra de gol fora**.
  Implementado em `simulation/knockout.js`, reaproveitando a lógica de pênaltis já existente
  em `simulate.js` (tilt por `penalty.base/slope`).
- **Rationale**: Simples, determinístico e realista para o futebol atual (gol fora foi
  abolido na maioria das competições). A função de pênaltis já existe no engine reconstruído.
- **Alternatives considered**: gol fora como 1º critério (B); prorrogação simulada (C).
  Rejeitados na clarificação.

## R5 — Origem da seed (clarificação Q4)

- **Decision**: O sistema **gera a seed automaticamente** e a registra/exibe; o jogador pode
  **opcionalmente informar uma seed manual**. Normalização e geração em `simulation/seed.js`;
  a seed efetiva é guardada no `game-store` junto ao torneio.
- **Rationale**: Equilibra simplicidade (jogador casual não precisa pensar em seed) com
  reprodutibilidade verificável (FR-010/SC-002) e compartilhamento de partidas memoráveis.
- **Implementação determinística da geração automática**: a seed automática NÃO usa
  `Math.random()` (proibido pela Constituição III). Deriva-se de um contador/monotônico de
  sessão + entradas do jogador (ex.: composição do elenco + timestamp fornecido pela UI),
  combinados via `rng.js` numa string de seed. A semente exibida é essa string.
- **Alternatives considered**: seed sempre manual (B, atrito); seed interna não exposta (C,
  perde reprodutibilidade para o usuário).

## R6 — Fórmula de força do elenco (diferido do clarify)

- **Decision**: Manter a abordagem já implementada: força do jogador = `realForce` (0–255
  de-ofuscado em `force.js`); ratings do time (`attack`/`defense`/`overall`) calculados em
  `ratings/ratings.js` como médias ponderadas por posição da escalação. A simulação consome
  `attack`/`defense`/`overall` por partida.
- **Rationale**: Já existe, é testável e produz resultados plausíveis; alterar a fórmula é
  risco sem necessidade para o escopo. Mistura multi-época não muda a fórmula — apenas a
  origem dos jogadores selecionados para os slots.
- **Alternatives considered**: nova fórmula com química/idade/posição-natural — fora de
  escopo; pode entrar no roadmap.

## R7 — Composição de elenco multi-época (FR-001/FR-002)

- **Decision**: Introduzir um modo de composição em `teams/lineup.js` no qual o pool de
  jogadores é a **união de atletas de múltiplas escalações históricas** selecionadas pelo
  jogador, mantendo `playerId` único por slot (FR-005) e validando preenchimento total da
  formação (FR-004) via `canFill`/`greedyFill` já existentes.
- **Rationale**: O engine atual sorteia uma escalação inteira (`draw.js`); a feature exige
  permitir misturar jogadores. Reusar `greedyFill`/`canFill` minimiza novo código e mantém a
  regra de fit de posição na camada `game/`.
- **Alternatives considered**: reescrever o lineup do zero (desnecessário); permitir mistura
  só na UI (violaria Constituição I/II).

## R8 — Formato de liga (pontos corridos) e formatos de torneio (FR-012)

- **Decision**: `simulation/simulate.js` (driver) + `simulation/standings.js` passam a suportar
  os quatro formatos: **liga** (todos contra todos por `rounds`), **grupos** (tabela parcial,
  classificados avançam), **mata-mata** (jogo único) e **mata-mata ida-e-volta** (agregado).
  A configuração por competição em `championships/` declara o(s) formato(s) de cada fase.
- **Rationale**: O config atual já tem `type: 'league' | 'group' | 'knockout'`, mas o driver
  `runCampaign` implementa group/knockout; falta `league` completo e ida-e-volta. Consolidar
  no driver mantém a regra em `game/`.
- **Alternatives considered**: drivers separados por competição (duplicaria regra — viola
  Constituição "não duplicar").

## R9 — Mando de campo (diferido)

- **Decision**: Aplicar uma leve vantagem de mando de campo opcional por confronto, como um
  pequeno bônus ao `attack`/`overall` do mandante, configurável em `simConfig.js`
  (`model.homeAdvantage`, default pequeno). Em jogo único de mata-mata, neutro por padrão.
- **Rationale**: Aumenta realismo (SC-004) sem comprometer determinismo; default conservador
  evita distorcer SC-003. É parâmetro do modelo, vive em `simConfig.js` (regra em `game/`).
- **Alternatives considered**: ignorar mando (menos realista); mando forte (poderia reduzir
  surpresas abaixo do alvo de SC-003).

## R10 — Estatísticas acumuladas (FR-018)

- **Decision**: Novo módulo `game/stats.js` agrega, a partir dos resultados de partidas de uma
  competição: vitórias/empates/derrotas, gols pró/contra, saldo, aproveitamento, artilheiros
  (reusando `scorers` já produzidos por `simulate.js`).
- **Rationale**: Mantém a derivação de estatística como função pura na camada de domínio;
  pages apenas exibem (Constituição I). Consistência com resultados é testável (SC-006).
- **Alternatives considered**: calcular estatística nos componentes (viola Constituição I/VII).
