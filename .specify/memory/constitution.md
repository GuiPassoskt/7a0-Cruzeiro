<!--
SYNC IMPACT REPORT
==================
Version change: TEMPLATE (unversioned) → 1.0.0
Bump rationale: MAJOR — primeira ratificação concreta a partir do template;
                definição inicial de todos os princípios e seções.

Modified principles:
  - [PRINCIPLE_1_NAME] → I. Separação de Camadas (Lógica vs. Apresentação)
  - [PRINCIPLE_2_NAME] → II. Regras de Futebol Centralizadas em game/
  - [PRINCIPLE_3_NAME] → III. Determinismo e Aleatoriedade Controlada
  - [PRINCIPLE_4_NAME] → IV. Estado Global em Stores
  - [PRINCIPLE_5_NAME] → V. Realismo com Surpresa Controlada
  - (novo)            → VI. Stack Mínima e Offline-First

Added sections:
  - Visão do Produto
  - Competições e Formatos Suportados
  - Convenções de Código e Organização de Diretórios
  - Critérios de Qualidade
  - Roadmap Futuro

Removed sections:
  - Placeholders genéricos [SECTION_2_*] / [SECTION_3_*] (substituídos)

Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check alinhado — sem itens conflitantes)
  - ✅ .specify/templates/spec-template.md (sem seções obrigatórias conflitantes)
  - ✅ .specify/templates/tasks-template.md (categorias de tarefa compatíveis)

Follow-up TODOs: nenhum.
-->

# 7AOCRUZEIRO Constitution

## Visão do Produto

7AOCRUZEIRO é um jogo de gestão e simulação de futebol focado no Cruzeiro Esporte
Clube. O jogador monta times combinando atletas de diferentes épocas históricas do
clube, mistura escalações de anos distintos e disputa competições simuladas. O sistema
calcula a força das equipes resultantes, simula partidas, gera campeonatos completos e
apresenta classificações, resultados e estatísticas.

O produto é construído com Quasar Framework (Vue 3) usando Composition API e JavaScript
puro, com foco em funcionamento **offline-first** e sem dependências desnecessárias. A
experiência central é a fantasia de "e se?": permitir que torcedores reúnam ídolos de
gerações diferentes em um mesmo elenco e descubram como ele se sairia.

## Core Principles

### I. Separação de Camadas (Lógica vs. Apresentação)
Componentes Vue, Pages e Stores NUNCA contêm regras de simulação ou cálculos de força.
- **Componentes** renderizam interface e emitem eventos; não decidem resultados de jogo.
- **Pages** apenas orquestram a interface: compõem componentes, leem stores e disparam
  ações da camada de jogo.
- **Stores** armazenam exclusivamente estado global (elenco montado, configuração de
  torneio, resultados, classificação) e não implementam lógica de futebol.
- Qualquer cálculo de força ou regra de partida fora de `src/game/` é uma violação.

Rationale: isolar a lógica de domínio da camada de UI mantém a simulação testável,
reaproveitável e independente do framework de apresentação.

### II. Regras de Futebol Centralizadas em game/
Toda regra de futebol vive dentro de `src/game/`. É a única fonte de verdade do domínio.
- `force.js` é o responsável por calcular a força das equipes.
- `simulate.js` é o responsável pela geração/resolução de partidas.
- `simConfig.js` é o responsável por definir campeonatos e parâmetros da simulação.
- Dados históricos residem em `game/data`; escalações históricas em `squads.js` ou
  `game/data`.
- Regras de negócio NUNCA são duplicadas: cada regra tem exatamente um lugar canônico.

Rationale: centralizar o domínio evita divergência de regras entre telas e garante que
toda evolução de mecânica seja feita em um único ponto auditável.

### III. Determinismo e Aleatoriedade Controlada (NON-NEGOTIABLE)
A simulação MUST ser determinística quando uma seed é informada: a mesma seed com as
mesmas entradas produz exatamente o mesmo resultado.
- Toda aleatoriedade MUST passar por `rng.js`. Nenhum módulo chama `Math.random()`
  diretamente.
- O sorteio (`draw.js`) e qualquer fator aleatório de partida consomem o RNG semeável.

Rationale: o determinismo torna partidas e campeonatos reproduzíveis, depuráveis e
testáveis, além de permitir replays e validação de regressões.

### IV. Estado Global em Stores
Estado compartilhado entre telas (elenco montado, torneio ativo, resultados, tabelas,
estatísticas) MUST residir nas stores. A camada de jogo recebe dados como entrada e
devolve resultados; ela não mantém estado de aplicação persistente.

Rationale: uma fronteira clara de estado evita acoplamento oculto entre a UI e o motor
de simulação e mantém o fluxo de dados previsível.

### V. Realismo com Surpresa Controlada
O resultado de uma partida MUST depender da força dos elencos envolvidos.
- Times mais fortes MUST ter maior probabilidade de vitória.
- MUST existir um fator aleatório controlado que possibilite surpresas (zebras).
- Os placares gerados MUST ser realistas para o futebol.

Rationale: equilibrar mérito esportivo e imprevisibilidade é o que torna a simulação
crível e divertida; nem determinismo puro nem caos total atendem ao produto.

### VI. Stack Mínima e Offline-First
O projeto MUST permanecer em Quasar + Vue 3 + Composition API + JavaScript puro.
- Nenhuma dependência nova é adicionada sem justificativa explícita de necessidade.
- A aplicação MUST funcionar offline; nenhuma regra central depende de rede.

Rationale: uma stack enxuta e offline reduz superfície de manutenção, acelera o jogo e
preserva a portabilidade do produto.

## Competições e Formatos Suportados

Competições suportadas:
- Campeonato Mineiro
- Campeonato Brasileiro
- Copa do Brasil
- Copa Sul-Americana
- Copa Libertadores
- Mundial de Clubes

Tipos de torneio:
- Liga (pontos corridos)
- Fase de grupos
- Mata-mata (jogo único)
- Mata-mata ida e volta

Novos campeonatos e parâmetros de simulação MUST ser configurados em `simConfig.js` (ou
em `game/championships/` após a evolução de estrutura), nunca embutidos em componentes
ou pages.

## Convenções de Código e Organização de Diretórios

Convenções:
- Toda nova lógica de futebol é adicionada em `game/`.
- Dados históricos ficam em `game/data`.
- Escalações históricas ficam em `squads.js` ou `game/data`.
- Novos campeonatos são configurados em `simConfig.js`.
- Não duplicar regras de negócio (uma regra → um módulo canônico).

Estrutura atual de `src/game/`:
```
game/
├── data/
├── draw.js
├── force.js
├── formations.js
├── lineup.js
├── positions.js
├── ratings.js
├── rng.js
├── simConfig.js
├── simulate.js
└── squads.js
```

Evolução-alvo de `src/game/` (a ser adotada conforme o domínio cresce, preservando os
princípios I–VI e sem duplicar regras durante a migração):
```
game/
├── data/
├── championships/
│   ├── mineiro.js
│   ├── brasileirao.js
│   ├── libertadores.js
│   └── sulamericana.js
├── simulation/
│   ├── rng.js
│   ├── draw.js
│   ├── force.js
│   └── simulate.js
├── teams/
│   ├── formations.js
│   ├── lineup.js
│   └── positions.js
└── ratings/
    └── ratings.js
```

A migração para a estrutura-alvo MUST mover responsabilidades sem alterar os contratos
de domínio nem dispersar regras: `force.js`, `simulate.js`, `rng.js`, `draw.js` e a
configuração de campeonatos permanecem os pontos canônicos de suas responsabilidades.

## Critérios de Qualidade

- **Determinismo verificável**: dada uma seed, partidas e campeonatos são reproduzíveis;
  divergência com a mesma seed é defeito bloqueante.
- **Pureza de camadas**: ausência de cálculo de força ou regra de partida fora de
  `game/` é condição de aprovação de qualquer mudança.
- **Realismo de placares**: distribuições de gols e resultados condizentes com futebol.
- **Probabilidade coerente com força**: em volume, equipes mais fortes vencem mais.
- **Sem duplicação de regras**: uma regra de negócio tem um único local.
- **Offline-first**: o fluxo central funciona sem conexão.

## Roadmap Futuro

- Reorganizar `src/game/` para a estrutura-alvo (`championships/`, `simulation/`,
  `teams/`, `ratings/`).
- Ampliar cobertura de competições e formatos definidos em `simConfig.js` /
  `game/championships/`.
- Expandir estatísticas e visualizações de classificação e resultados.
- Enriquecer dados históricos de elencos em `game/data`.
- Persistência local (offline) de torneios e elencos montados.

## Governance

Esta constituição supersede quaisquer outras práticas do projeto. Em caso de conflito
entre código e constituição, a constituição prevalece e o código MUST ser corrigido.

- **Emendas**: alterações de princípios ou seções exigem registro neste documento, com
  atualização do Sync Impact Report e do número de versão.
- **Versionamento (SemVer)**: MAJOR para remoções/redefinições incompatíveis de
  princípios; MINOR para novos princípios/seções ou expansão material de orientação;
  PATCH para esclarecimentos e ajustes não semânticos.
- **Conformidade**: toda revisão de mudança (PR/review) MUST verificar aderência aos
  princípios I–VI. Complexidade adicional MUST ser justificada explicitamente.
- **Orientação em runtime**: consulte o plano atual e os templates em
  `.specify/templates/` para guiar a execução de features.

**Version**: 1.0.0 | **Ratified**: 2026-06-16 | **Last Amended**: 2026-06-16
