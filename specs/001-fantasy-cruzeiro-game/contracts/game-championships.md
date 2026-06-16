# Contract — `game/championships/*` e `game/data/adversarys/*`

Configuração de competições e dados de adversários. Adversários têm força fixa por competição
(clarificação Q1). Novos campeonatos são adicionados aqui (Convenção da Constituição).

## Dados — `game/data/adversarys/<competicao>.json`

Formato de cada arquivo (um por competição):

```json
{
  "competition": "MINEIRO",
  "opponents": [
    { "id": "atletico-mg", "label": "Atlético-MG", "crest": "crests/atletico-mg.png", "force": 190 },
    { "id": "america-mg",  "label": "América-MG",  "crest": null, "force": 140 }
  ]
}
```

Regras:
- `force` na banda **0–255** (mesma dos elencos de-ofuscados) — evita placares irreais.
- `id` único dentro do arquivo.
- Arquivos ainda a criar: `mineiro`, `brasileirao`, `copa-do-brasil`, `sulamericana`,
  `libertadores`, `mundial`.

## `championships/index.js` (NOVO)

```js
CHAMPIONSHIPS: Record<key, Championship>   // registro de todas as competições
CHAMPIONSHIP_KEYS: string[]                // MINEIRO, BRASILEIRAO, COPA_DO_BRASIL,
                                           // SULAMERICANA, LIBERTADORES, MUNDIAL
getChampionship(key): Championship|null
listChampionships(): { key, name }[]
```

## `championships/<comp>.js` (NOVO, um por competição)

```js
// Carrega adversários de data/adversarys/<comp>.json e declara fases/formato.
export default {
  key: 'BRASILEIRAO',
  name: 'Campeonato Brasileiro',
  phases: [
    { key: 'PONTOS_CORRIDOS', type: 'league', rounds: 38, opponents: [...] }
  ],
  model: { /* opcional; default herda de simConfig.SIM.model */ },
}
```

Cobertura de formatos exigida (FR-011/FR-012):
- **MINEIRO**: grupo/classificação + mata-mata (semi/final).
- **BRASILEIRAO**: `league` (pontos corridos).
- **COPA_DO_BRASIL**: mata-mata ida-e-volta (`knockout_two_legs`).
- **SULAMERICANA**: grupos + mata-mata.
- **LIBERTADORES**: grupos + mata-mata.
- **MUNDIAL** (NOVO): mata-mata curto (jogo único) até a final.

## `simConfig.js` (existente — reduzido a parâmetros globais)

```js
SIM: { model, penalty, badge, homeAdvantage }   // parâmetros globais do modelo
KNOCKOUT_DRAW_BIAS: number
PHASE_LABELS: Record<string,string>
```

Migração: o objeto `TOURNAMENTS` inline atual é movido para `championships/*` lendo
`data/adversarys/*`; nenhum dado de adversário permanece embutido em `simConfig.js`.
