
# Chemical Kinetics Visualizer – Plataforma Interativa Educacional

## Estrutura do Repositório

```
├─ src/
│  ├─ lib/
│  │  ├─ components/
│  │  │  ├─ ArrheniusChart.svelte       ← Curva da equação de Arrhenius
│  │  │  ├─ CollisionChart.svelte       ← Comparação de colisões moleculares
│  │  │  ├─ DecayGraph.svelte           ← Gráfico N(t) com bola animada e tooltip
│  │  │  ├─ ParticleDecay.svelte        ← Simulação do decaimento de partículas
│  │  │  ├─ DecayHistogram.svelte       ← Histograma dos tempos de vida simulados
│  │  │  ├─ FormulaBox.svelte           ← Renderização de fórmulas matemáticas
│  │  ├─ utils/
│  │  │  └─ decay.js                    ← Funções de simulação e cálculos
│  ├─ routes/
│  │  ├─ +page.svelte                   ← Página principal com layout, controles e integração dos gráficos
├─ static/
│  └─ css/
│     └─ global.css                     ← Estilos globais (inclui fundo cinza e texto em negrito)
├─ public/
│  └─ data/                             ← Dados ou recursos estáticos
├─ README.md                            ← Este arquivo
├─ svelte.config.js                     ← Configuração do SvelteKit
├─ package.json                         ← Dependências do projeto
└─ vite.config.js                       ← Configuração do Vite
```

## Como Funciona a Visualização

Este projeto visa facilitar o ensino de *cinética química* por meio de **simulações interativas** com forte apelo visual.

### Componentes Principais

- **ParticleDecay**: Representa visualmente partículas decaindo com movimentação Browniana.
- **DecayGraph**: Mostra a curva exponencial N(t) com uma bola animada e tooltip dinâmico.
- **DecayHistogram**: Visualiza a distribuição de tempos de decaimento.
- **ArrheniusChart**: Gráfico da equação de Arrhenius com curva suave e ponto destacado.
- **CollisionChart**: Mostra a distribuição de colisões moleculares em diferentes temperaturas.

### Integração e Interatividade

- A simulação é controlada por `+page.svelte`, que envia parâmetros para os componentes e escuta eventos como `simulationFinished`.
- Ao final da simulação (quando todas as partículas decaem ou o tempo máximo é atingido), um aviso é exibido automaticamente.

## Processo de Desenvolvimento

### 1. Definição Conceitual
Mapeamos os principais conceitos de cinética química que apresentam dificuldades didáticas: ordem de reação, energia de ativação, decaimento radioativo e catálise.

### 2. Prototipagem Visual e Arquitetura
Foram criados protótipos de visualizações com SVG e D3.js integradas ao Svelte para permitir interações suaves e animações visuais.

### 3. Simulação e Interação
Cada conceito foi representado por meio de simulações específicas com cálculos analíticos (ex: N(t) = N₀e^(-λt), Arrhenius).

### 4. Ajuste Estético e Didático
Foram adicionadas tooltips, animações e feedback visual com foco em acessibilidade e clareza. Paleta de cores, fundo e negrito nos textos foram otimizados para contraste e leitura.

### 5. Testes, Feedback e Finalização
O projeto foi testado com usuários e o relatório final foi gerado para documentar os resultados e objetivos alcançados.

## Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/chemical-kinetics-visualizer.git
   cd chemical-kinetics-visualizer
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação no navegador:
   ```
   http://localhost:5173
   ```

## Créditos

- **Ana Júlia Amaro** — Design visual, simulação de decaimento radioativo
- **Maria Eduarda Mesquita** — Implementação dos conceitos de energia de ativação e catálise
- **Ramyro Corrêa** — Lógica de interação, tooltip dinâmica, integração Svelte+D3, animação temporal

## Referências

- Atkins’ Physical Chemistry (Oxford, 2022)  
- Inorganic Chemistry – Housecroft & Sharpe (Pearson, 2018)  
- Nuclear Decay Data – IAEA (2020)  
- Introduction to Surface Chemistry – Somorjai & Li (Wiley, 2010)
