# Feature Specification: Jogo 7AOCRUZEIRO — Elenco Histórico, Simulação e Campeonatos

**Feature Branch**: `001-fantasy-cruzeiro-game`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Jogo 7AOCRUZEIRO: montar elenco histórico misturando atletas de
diferentes épocas, calcular a força do time, simular partidas com fator aleatório controlado,
gerar campeonatos completos (liga, fase de grupos, mata-mata, mata-mata ida e volta) e
apresentar classificação, resultados e estatísticas. Competições: Campeonato Mineiro,
Campeonato Brasileiro, Copa do Brasil, Copa Sul-Americana, Copa Libertadores, Mundial de
Clubes."

## Clarifications

### Session 2026-06-16

- Q: Como os times adversários do campeonato são definidos e como sua força é calculada? → A: Adversários são clubes pré-definidos em `game/data` (ex.: `game/data/adversarys`), cada um com força fixa por competição. O jogador monta apenas o Cruzeiro. (Os arquivos JSON dos adversários ainda serão criados.)
- Q: Qual a ordem de critérios de desempate para classificação de liga/grupos? → A: Pontos → saldo de gols → gols marcados → confronto direto → desempate final via RNG semeável.
- Q: Como resolver um empate em confronto de mata-mata (jogo único e agregado)? → A: Empate em jogo único ou no placar agregado é decidido por pênaltis via RNG semeável, com leve vantagem ao time mais forte; não há regra de gol fora.
- Q: Como a seed de uma simulação/campeonato é definida na experiência do jogador? → A: O sistema gera a seed automaticamente por padrão e a registra/exibe; o jogador pode opcionalmente informar uma seed manual.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Montar elenco histórico do Cruzeiro (Priority: P1)

O torcedor abre o jogo e monta um time do Cruzeiro escolhendo atletas de escalações
históricas de diferentes épocas. Ele pode misturar jogadores de anos distintos no mesmo
elenco, escolher uma formação tática e definir a escalação titular. Ao montar o time, o
sistema mostra a força calculada do elenco resultante.

**Why this priority**: É a fantasia central do produto ("e se reuníssemos ídolos de
gerações diferentes?"). Sem a montagem do elenco não há entrada para nenhuma simulação;
é o ponto de partida obrigatório de toda a experiência.

**Independent Test**: Pode ser totalmente testada selecionando atletas de pelo menos duas
épocas diferentes, escolhendo uma formação válida e verificando que o sistema exibe uma
força de time coerente — entregando, por si só, a experiência de "montar meu time dos
sonhos".

**Acceptance Scenarios**:

1. **Given** as escalações históricas disponíveis, **When** o torcedor seleciona atletas de
   dois ou mais anos diferentes para preencher todas as posições de uma formação,
   **Then** o sistema aceita o elenco e exibe a força total calculada do time.
2. **Given** um elenco em montagem, **When** o torcedor troca a formação tática,
   **Then** as posições exigidas são atualizadas e a força é recalculada.
3. **Given** um elenco incompleto (posição obrigatória vazia), **When** o torcedor tenta
   confirmar o time, **Then** o sistema impede a confirmação e indica o que falta.
4. **Given** dois elencos diferentes montados, **When** suas forças são exibidas,
   **Then** o elenco com atletas de melhores avaliações apresenta força maior.

---

### User Story 2 - Simular uma partida entre dois times (Priority: P2)

Com um elenco montado, o torcedor escolhe um adversário e simula uma partida individual.
O resultado depende da força dos dois elencos, com um fator aleatório controlado que
torna o placar imprevisível dentro de limites realistas. O sistema apresenta o placar
final da partida.

**Why this priority**: É a unidade fundamental de jogo sobre a qual campeonatos são
construídos. Entrega valor imediato (ver meu time jogar) e valida o motor de força +
aleatoriedade antes de qualquer torneio.

**Independent Test**: Pode ser testada com dois elencos definidos e uma seed fixa,
verificando que a mesma seed produz sempre o mesmo placar e que, em muitas simulações,
o time mais forte vence com maior frequência.

**Acceptance Scenarios**:

1. **Given** dois elencos com forças definidas, **When** a partida é simulada,
   **Then** o sistema produz um placar final realista para o futebol.
2. **Given** a mesma seed e os mesmos elencos, **When** a partida é simulada novamente,
   **Then** o placar produzido é idêntico ao da simulação anterior.
3. **Given** um time claramente mais forte e outro mais fraco, **When** muitas partidas são
   simuladas, **Then** o time mais forte vence na maioria das vezes, mas surpresas (vitórias
   ou empates do mais fraco) ocorrem ocasionalmente.

---

### User Story 3 - Gerar e disputar um campeonato completo (Priority: P3)

O torcedor escolhe uma competição (ex.: Campeonato Brasileiro, Libertadores) e seu formato
(liga, fase de grupos, mata-mata, ou mata-mata ida e volta). O sistema gera todo o
chaveamento/calendário, simula todas as partidas e conduz o torneio até um campeão,
respeitando as regras do formato escolhido.

**Why this priority**: É o objetivo de longo prazo do produto — levar o time montado por
uma jornada completa. Depende das histórias P1 e P2 e amplia a experiência de uma partida
para uma temporada inteira.

**Independent Test**: Pode ser testada escolhendo uma competição em cada formato suportado,
gerando o torneio com uma seed fixa e verificando que todas as partidas são resolvidas, que
o avanço de fases segue as regras do formato e que um único campeão é determinado.

**Acceptance Scenarios**:

1. **Given** uma competição em formato de liga, **When** o torneio é gerado e simulado,
   **Then** todas as equipes se enfrentam conforme o formato de pontos corridos e a posição
   final é determinada por pontuação (com critérios de desempate).
2. **Given** uma competição em formato de fase de grupos seguida de mata-mata, **When** o
   torneio é simulado, **Then** os classificados de cada grupo avançam corretamente para o
   mata-mata até a definição do campeão.
3. **Given** um confronto de mata-mata ida e volta, **When** ambos os jogos são simulados,
   **Then** o classificado é definido pelo critério agregado do confronto.
4. **Given** um campeonato concluído, **When** o torcedor consulta o torneio, **Then** o
   sistema apresenta a classificação final, os resultados de todas as partidas e
   estatísticas acumuladas.

---

### Edge Cases

- O que acontece quando o torcedor tenta usar o mesmo atleta histórico em duas posições do
  mesmo elenco? (Esperado: o sistema impede a duplicação no mesmo time.)
- Como o sistema trata um empate ao final de uma fase de liga onde duas equipes têm a mesma
  pontuação? (Esperado: aplica critérios de desempate definidos.)
- Como o sistema resolve um empate em jogo único de mata-mata? (Esperado: aplica um critério
  de desempate determinístico — ex.: prorrogação/decisão controlada pelo RNG semeável.)
- Como o sistema resolve empate no placar agregado de mata-mata ida e volta?
- O que acontece se o número de equipes não preencher exatamente o formato escolhido
  (ex.: grupos incompletos)?
- O que acontece quando uma competição é configurada sem equipes suficientes para iniciar?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir ao torcedor montar um elenco do Cruzeiro selecionando
  atletas a partir de escalações históricas de diferentes épocas.
- **FR-002**: O sistema MUST permitir misturar, no mesmo elenco, atletas pertencentes a anos
  históricos distintos.
- **FR-003**: O sistema MUST oferecer formações táticas e ajustar as posições exigidas do
  elenco conforme a formação escolhida.
- **FR-004**: O sistema MUST impedir a confirmação de um elenco que não preencha todas as
  posições obrigatórias da formação selecionada.
- **FR-005**: O sistema MUST impedir o uso do mesmo atleta em mais de uma posição no mesmo
  elenco.
- **FR-006**: O sistema MUST calcular e exibir a força total de um elenco a partir das
  avaliações dos atletas selecionados e da formação.
- **FR-007**: O sistema MUST simular uma partida entre dois elencos produzindo um placar
  final cujo resultado depende da força relativa dos elencos.
- **FR-008**: O sistema MUST aplicar um fator aleatório controlado às partidas, de modo que
  resultados surpreendentes (zebras) sejam possíveis, porém minoritários.
- **FR-009**: O sistema MUST produzir placares realistas para o futebol.
- **FR-010**: O sistema MUST ser determinístico quando uma seed é informada: mesma seed e
  mesmas entradas produzem exatamente os mesmos resultados de partida e de campeonato.
- **FR-010b**: O sistema MUST obter os times adversários a partir de dados pré-definidos do
  projeto (ex.: `game/data/adversarys`), cada adversário com uma força fixa por competição;
  o jogador monta apenas o elenco do Cruzeiro.
- **FR-011**: O sistema MUST permitir gerar campeonatos completos para as competições
  suportadas: Campeonato Mineiro, Campeonato Brasileiro, Copa do Brasil, Copa
  Sul-Americana, Copa Libertadores e Mundial de Clubes.
- **FR-012**: O sistema MUST suportar os formatos de torneio: liga (pontos corridos), fase
  de grupos, mata-mata (jogo único) e mata-mata ida e volta.
- **FR-013**: O sistema MUST gerar o chaveamento/calendário da competição e simular todas as
  partidas previstas pelo formato escolhido.
- **FR-014**: O sistema MUST conduzir o avanço de fases conforme as regras do formato até a
  definição de um único campeão.
- **FR-015**: O sistema MUST aplicar, para classificações de liga/grupos, a seguinte ordem
  determinística de desempate: pontos → saldo de gols → gols marcados → confronto direto →
  desempate final via RNG semeável. Confrontos de mata-mata (jogo único e agregado) seguem
  critérios determinísticos próprios (ver FR-015b).
- **FR-015b**: Em confrontos de mata-mata, empate em jogo único ou no placar agregado de
  ida e volta MUST ser decidido por disputa de pênaltis resolvida via RNG semeável, com leve
  vantagem ao time de maior força; o sistema NÃO aplica regra de gol marcado fora de casa.
- **FR-016**: O sistema MUST apresentar a classificação atualizada de uma competição.
- **FR-017**: O sistema MUST apresentar os resultados de todas as partidas de uma competição.
- **FR-018**: O sistema MUST apresentar estatísticas acumuladas da competição (ex.: gols,
  vitórias, empates, derrotas, aproveitamento).
- **FR-019**: O sistema MUST funcionar offline (sem dependência de rede para a experiência
  central de montar, simular e disputar campeonatos).
- **FR-020**: O sistema MUST preservar o elenco montado e o estado do campeonato em
  andamento durante a sessão de uso.
- **FR-021**: O sistema MUST gerar automaticamente uma seed para cada simulação/campeonato
  e registrá-la/exibi-la, permitindo ao jogador opcionalmente informar uma seed manual para
  reproduzir resultados.

### Key Entities *(include if feature involves data)*

- **Atleta histórico**: representa um jogador de uma escalação histórica do Cruzeiro;
  atributos essenciais incluem identificação, época/ano de referência, posição(ões) e
  avaliação (rating) que alimentam o cálculo de força.
- **Escalação histórica (squad)**: conjunto de atletas associados a um ano/época específico
  do clube; fonte a partir da qual o torcedor seleciona atletas.
- **Formação tática**: definição das posições e quantidades exigidas para um elenco válido.
- **Elenco montado (time do jogador)**: combinação de atletas escolhidos pelo torcedor,
  possivelmente de épocas diferentes, associada a uma formação e a uma força calculada.
- **Partida**: confronto entre dois elencos, com placar resultante e dados associados
  (gols, eventos relevantes para estatística).
- **Time adversário**: clube pré-definido nos dados do projeto (ex.: `game/data/adversarys`)
  que participa das competições; possui uma força fixa por competição e não é montado pelo
  jogador.
- **Competição/Campeonato**: torneio de um formato específico (liga, grupos, mata-mata,
  ida e volta) que agrupa equipes, partidas, fases e regras de avanço/desempate.
- **Classificação**: ordenação das equipes em uma competição segundo pontuação e critérios
  de desempate.
- **Estatística**: métricas acumuladas por equipe e/ou competição derivadas dos resultados
  das partidas.
- **Seed**: valor que determina a sequência de aleatoriedade controlada, garantindo
  reprodutibilidade das simulações.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A partir da tela inicial, um torcedor consegue montar um elenco completo
  válido (todas as posições preenchidas) misturando atletas de pelo menos duas épocas em
  menos de 5 minutos.
- **SC-002**: 100% das simulações executadas com a mesma seed e as mesmas entradas produzem
  resultados idênticos (placares e campeão), comprovando o determinismo.
- **SC-003**: Em uma amostra de 1.000 partidas simuladas entre um time forte e um time
  fraco, o time mais forte vence em pelo menos 60% dos jogos, e ocorrem surpresas
  (não-vitória do favorito) em pelo menos 10% dos jogos.
- **SC-004**: Pelo menos 95% das partidas simuladas produzem placares dentro de faixas
  realistas para o futebol (ex.: total de gols por partida compatível com distribuições
  reais, sem placares absurdos).
- **SC-005**: Cada um dos formatos suportados (liga, grupos, mata-mata, ida e volta) gera um
  campeonato que conclui com exatamente um campeão e nenhuma partida pendente em 100% das
  execuções.
- **SC-006**: Ao final de qualquer competição, classificação, resultados e estatísticas são
  exibidos de forma consistente entre si (a soma de vitórias/empates/derrotas confere com os
  resultados das partidas) em 100% dos casos.
- **SC-007**: A experiência central (montar, simular, disputar campeonato) funciona
  integralmente sem conexão de rede.

## Assumptions

- O escopo desta feature cobre a experiência de jogo single-player local; não há
  componentes multiplayer, contas de usuário ou sincronização em nuvem.
- Os dados históricos de atletas e escalações estão disponíveis no próprio projeto e são
  a fonte de verdade para seleção e avaliações; o enriquecimento contínuo desses dados é
  tratado como evolução, não como pré-requisito desta feature.
- As avaliações (ratings) dos atletas são fornecidas pelos dados históricos e usadas como
  base para o cálculo de força; o ajuste fino da fórmula de força é um detalhe de
  implementação dentro da camada de jogo.
- Critérios de desempate (saldo, gols marcados, confronto direto, decisão controlada por
  seed) seguem convenções usuais do futebol, ajustáveis na configuração da competição.
- A persistência entre sessões (salvar/carregar torneios) é considerada evolução futura;
  esta feature garante a manutenção do estado durante a sessão em uso.
- A interface é organizada em telas que apenas orquestram a experiência, enquanto regras de
  futebol, força e simulação residem na camada de domínio do jogo (conforme a constituição
  do projeto).
