# 7a0 — Sete a Zero · Cruzeiro

Reimplementação em **Quasar (Vue 3 + Pinia)** do jogo *7a0 — Sete a Zero*, na variante
Cruzeiro: **role o dado**, sai um elenco do Cruzeiro de uma temporada → **monte os 11** no
campo → **simule a Copa** e veja se seu time faz 7 a 0.

Feito por engenharia reversa dos arquivos originais (HTML/CSS/JS/JSON do build Next.js que
estava em `base/`): o sistema de design, a lógica de sorteio, os ratings e o motor de
simulação foram reconstruídos como módulos limpos.

## Estrutura

```
src/
  game/                 # lógica pura, sem dependência de framework
    rng.js              # PRNG determinístico (mulberry32 + xmur3)
    force.js            # de-ofuscação da "força" do jogador (FNV-1a + XOR)
    positions.js        # códigos de posição + pesos de ataque/defesa
    formations.js       # 8 formações × 3 estilos (slots x/y) + config
    ratings.js          # ataque / defesa / overall do time
    lineup.js           # elegibilidade e escolha de formação que encaixa
    simConfig.js        # fases da Copa, modelo de gols, badges
    simulate.js         # motor de campanha (Poisson, pênaltis, artilheiros)
    squads.js           # carrega os elencos (CRU) e de-ofusca as forças
    draw.js             # sorteio / re-sorteio ponderado
    data/squads/*.json  # elencos do Cruzeiro (1966–2026)
  stores/
    settings-store.js   # tema (panini / terrace), persistido
    game-store.js       # máquina de estados do jogo
  components/           # SiteHeader, SiteFooter, ScoreMark, HomePitch, play/*
  css/                  # tokens + base + home + play (design portado)
  pages/                # index (shell) / home / play / privacidade / perfil
public/crests/          # escudo do Cruzeiro
```

## Notas de reconstrução

- **Força dos jogadores**: o campo `f` dos JSONs é XOR-mascarado por um hash FNV-1a do
  `playerId`; `force.js` recupera o valor real.
- **Simulação**: modelo de gols (Poisson com λ por diferença de rating), disputa de pênaltis
  e atribuição de artilheiros são fiéis ao original. As **forças dos adversários** foram
  re-escaladas para a mesma faixa (0–255) das forças dos jogadores — o original as enviava
  numa faixa 0–99, o que tornaria toda partida um 7 a 0. Veja a nota em `simConfig.js`.
- **Multiplayer e perfil** dependiam de backend/websocket e ficaram fora desta POC.

## Rodando

> Requer **Node ≥ 22.22.0** (exigência do `@quasar/app-vite`).

```bash
npm install
quasar dev      # desenvolvimento (HMR)
quasar build    # build de produção
```

Verificação sem o CLI (lint e compilação dos SFCs) funciona em qualquer Node 22+:

```bash
npx eslint -c ./eslint.config.js "./src/**/*.{js,vue}"
```
