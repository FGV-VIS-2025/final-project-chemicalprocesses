
# Reaction Visualizer – Simulador Interativo de Reações Químicas

## Estrutura do Repositório

```
.
├── .github/              ← Workflows de CI/CD (deploy automático)
│   └── workflows/
│       └── deploy.yml    ← Configuração de deploy
├── src/                  ← Código fonte do projeto SvelteKit
│   ├── app.html          ← Template HTML principal
│   ├── lib/              ← Componentes e utilitários reutilizáveis
│   │   ├── components/
│   │   │   ├── ArrheniusChart.svelte
│   │   │   ├── CollisionChart.svelte
│   │   │   ├── Controls.svelte
│   │   │   ├── DecayGraph.svelte
│   │   │   ├── DecayHistogram.svelte
│   │   │   ├── FormulaBox.svelte
│   │   │   ├── InfoBox.svelte
│   │   │   ├── ParticleAnimation.svelte
│   │   │   └── ParticleDecay.svelte
│   │   └── utils/
│   │       └── decayUtils.js
│   └── routes/           ← Rotas das páginas do projeto
│       ├── +layout.js
│       ├── +page.svelte  ← Página principal com simulação interativa
│       ├── page0/        ← Introdução ao tema
│       │   └── +page.svelte
│       ├── page1/        ← Ordens de reação
│       │   └── +page.svelte
│       ├── page2/        ← Energia de ativação e modelo de Arrhenius
│       │   └── +page.svelte
│       ├── page3/        ← Simulação de decaimento radioativo
│       │   └── +page.svelte
│       ├── page4/        ← Efeito de catalisadores
│       │   ├── +page.svelte
│       │   ├── components/
│       │   ├── styles/
│       │   │   └── page4.css
│       │   └── utils/
│       └── page5/        ← Encerramento e resumo
│           └── +page.svelte
├── static/               ← Arquivos estáticos
│   ├── .nodekyll         ← Controle de build (ignorar)
│   └── favicon.png
├── .gitignore
├── .npmrc
├── package.json
├── package-lock.json
├── svelte.config.js
├── vite.config.js
└── README.md             ← Este arquivo
```

## Como Funciona a Visualização

O projeto é uma simulação educacional interativa que explora conceitos fundamentais de reações químicas:

- **Page 0 – Introdução**: Apresenta o tema da cinética química e contextualiza o projeto.
- **Page 1 – Ordem de Reações**: Demonstra o impacto das ordens de reação com visualização em tempo real.
- **Page 2 – Energia de Ativação**: Gráfico de Arrhenius interativo com controle de temperatura e energia.
- **Page 3 – Decaimento Radioativo**: Simulação de partículas, histograma animado e visualização de N(t).
- **Page 4 – Catalisadores**: Exibe superfícies energéticas e curvas de energia com e sem catalisador.
- **Page 5 – Conclusão**: Conecta os tópicos e propõe reflexões para o aprendizado.

## Processo de Desenvolvimento

1. **Conceituação**
   - Definição dos conceitos-chave da cinética química a serem visualizados.

2. **Prototipagem das Visualizações**
   - Desenvolvimento de gráficos com D3.js integrados ao Svelte.

3. **Estruturação de Páginas**
   - Modularização em rotas distintas para cada conceito.

4. **Refinamento**
   - Ajustes estéticos, interações e tooltips para acessibilidade e clareza.

5. **Deploy**
   - Configuração do deploy automático via GitHub Actions para o GitHub Pages.

## Como Rodar Localmente

Este projeto utiliza o SvelteKit.

1. Clone o repositório:

```bash
git clone <url-do-repo>
cd nome-do-projeto
```

2. Instale as dependências:

```bash
npm install
```

3. Rode o servidor local:

```bash
npm run dev
```

4. Acesse no navegador:

```
http://localhost:5173
```

## Contribuidores

- **Ramyro Corrêa Aquines**  
  Idealização, desenvolvimento dos gráficos interativos, animações e layout completo do projeto.
