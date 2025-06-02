<svelte:head>
  <title>Page 0 - Summary</title>
</svelte:head>

<nav class="main-nav">
  <a href="/" class={currentPage === '/' ? 'active' : ''}>Home</a>
  <a href="/page0" class={currentPage === '/page0' ? 'active' : ''}>Introduction</a>
  <a href="/page1" class={currentPage === '/page1' ? 'active' : ''}>Reaction Orders</a>
  <a href="/page2" class={currentPage === '/page2' ? 'active' : ''}>Activation Energy</a>
  <a href="/page3" class={currentPage === '/page3' ? 'active' : ''}>Simulation</a>
  <a href="/page4" class={currentPage === '/page4' ? 'active' : ''}>Catalyst Effect</a>
  <a href="/page5" class={currentPage === '/page5' ? 'active' : ''}>Radioactivity</a>
</nav>

<div class="page" id="page0">
  <h1>
    <span class="chem-icon">⚗️</span> Chemical Kinetics Visualizer
  </h1>
    <div id="container2"></div>

  <p><strong>Chemical kinetics</strong> is the branch of chemistry that studies the speed or rate of chemical reactions and how various factors,
  like reactant concentration, temperature, and the presence of catalysts, influence this rate. 
  This knowledge is vital for optimizing chemical processes in a variety of applications, ranging from industrial production to biological systems.</p>

  <div id="container3" style="margin-bottom: 40px;"></div>

  <p>
  The graph illustrates how the concentrations of a reactant (<strong>Reagent A</strong>) and a product (<strong>Product B</strong>) change over time during a chemical reaction.
</p>

<p>
  The <span style="color: red;"><strong>red curve</strong></span> represents <strong>Reagent A</strong>, whose concentration decreases exponentially as the reaction proceeds. This indicates that Reagent A is being consumed over time.
</p>

<p>
  The <span style="color: #1f77b4;"><strong>blue curve</strong></span> shows <strong>Product B</strong>, whose concentration increases as Reagent A is converted into the product.
</p>

<p>
  The two curves intersect at around <strong>time = 4.5 units</strong>, suggesting the point where the concentrations of the reactant and product are equal.
</p>

<p>
  The <strong>y-axis</strong> represents <strong>concentration</strong>, and the <strong>x-axis</strong> represents <strong>time</strong>.
</p>

<p>
  Both axes are labeled in bold, with “<strong>CONCENTRATION</strong>” and “<strong>TIME</strong>” clearly indicated.
</p>

<p>
  This is a typical kinetic profile of a <strong>first-order or pseudo-first-order reaction</strong>, where one reactant is converted into one product over time.
</p>




  <h1>Order of Reaction</h1>

  <p>
    A fundamental concept in kinetics is the <strong>rate law</strong>, which defines how the rate of a reaction is related to the concentrations of the reactants.
    The rate law varies based on the order of the reaction, which is determined experimentally. Below are explanations for the most common types of reaction orders:
  </p>

  <ul>
    <li>
      <strong>First-order reactions:</strong> In a first-order reaction, the rate is directly proportional to the concentration of one reactant.
      For example, for the reaction <em>A → B</em>, the rate law is: <code>rate = k[A]</code>.
      Here, doubling the concentration of A will double the reaction rate.
    </li>
    <li>
      <strong>Second-order reactions:</strong> In a second-order reaction, the rate is proportional to the square of the concentration of the reactant,
      or to the product of the concentrations of two reactants. For example, <em>2A → B</em> would have the rate law:
      <code>rate = k[A]<sup>2</sup></code>. If the concentration of A is doubled, the rate increases by a factor of four.
    </li>
    <li>
      <strong>Third-order reactions:</strong> In a third-order reaction, the rate depends on the concentration of a reactant raised to the third power
      or a combination of three reactants. For example, the rate law for a reaction involving three molecules of A might be:
      <code>rate = k[A]<sup>3</sup></code>. If the concentration of A is doubled, the rate increases by a factor of eight.
    </li>
  </ul>

  <p>
    The rate constant, <code>k</code>, is unique to each reaction and depends on factors such as temperature and the presence of a catalyst.
  </p>

 <h2>Catalysis</h2>


  
  <p><strong>Catalysts</strong> are substances that accelerate chemical reactions without being consumed. They work by offering an alternative reaction pathway with a lower activation energy, making the reaction occur more easily.</p>

  <p>This interactive tool allows you to explore these principles visually and intuitively:</p>
    <ul>
      <li><strong>Kinetics:</strong> Adjust reactant concentrations and rate constants to observe how the reaction rate changes over time.</li>
      <li><strong>Activation Energy:</strong> Visualize the Arrhenius equation and see how changes in temperature affect the reaction rate.</li>
      <li><strong>Catalyst Effect:</strong> Compare reaction profiles with and without a catalyst to understand its impact.</li>
    </ul>
  <p>Dive into this interactive project to gain a deeper understanding of chemical reactions and the factors that govern them!</p>
</div>

<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { page } from '$app/stores';

  let currentPage = $page.url.pathname;

  onMount(() => {
    const styleContent = `
      body {
        font-family: 'Inter', sans-serif;
        background-color: #f4f4f9;
        color: #333;
        margin: 0;
        padding: 0;
      }
      
      .main-nav {
        background-color: #2c3e50;
        padding: 1rem 2rem;
        display: flex;
        justify-content: center;
        gap: 2rem;
        flex-wrap: wrap;
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .main-nav a {
        color: white;
        text-decoration: none;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .main-nav a:hover {
        background-color: #34495e;
      }

      .main-nav a.active {
        background-color: #3498db;
      }
      
      #page0 {
        padding: 2rem;
        max-width: 900px;
        margin: 2rem auto;
        background: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        border-radius: 12px;
        position: relative;
      }
      
      #page0 h1 {
        color: #003366;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.7rem;
      }
      
      #page0 p {
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 1rem;
      }
      
      #page0 ul {
        padding-left: 1.5rem;
        margin-bottom: 1.5rem;
      }
      
      #page0 li {
        margin-bottom: 0.5rem;
      }
      
      #page0 code {
        background: #e3f2f9;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-family: 'Inter', monospace;
      }
      
      svg {
        background: white;
        border-radius: 8px;
        box-shadow: 0 0 15px rgba(0,0,0,0.1);
      }
      
      .axis-label {
        font-weight: bold;
        fill: #003366;
        font-size: 14px;
      }
      
      .label-reactant {
        fill: #d62728;
        font-weight: bold;
      }
      
      .label-product {
        fill: #1f77b4;
        font-weight: bold;
      }
      
      .tube-label {
        font-size: 14px;
        fill: #333;
        text-anchor: middle;
      }
      
      .tube {
        fill: #c49b6a;
        stroke: #987a4d;
        stroke-width: 2px;
        filter: drop-shadow(0 1px 0px #7a5f2e);
      }
      
      .cork {
        fill: #8c6d4a;
        stroke: #6b5436;
        stroke-width: 1.5px;
      }
      
      .bubbleA {
        fill: #d62728;
        opacity: 0.85;
      }
      
      .bubbleB {
        fill: #1f77b4;
        opacity: 0.85;
      }
      
      @media (max-width: 600px) {
        nav ul {
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        nav a {
          padding: 0.3rem 0;
        }
      }

      #container3 {
        display: flex;
        justify-content: center;
        width: 100%;
        margin: 0 auto 40px;
      }

      #container3 svg {
        display: block;
        margin: 0 auto;
      }
    `;
    const style = document.createElement("style");
    style.textContent = styleContent;
    document.head.appendChild(style);

    // === Configurações do Gráfico ===
    const width = 800, height = 500, margin = { top: 40, right: 30, bottom: 40, left: 50 };
    
    // Cria SVG para o gráfico de linhas
    const svg = d3.select("#container3")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Dados simulados da reação (tempo de 0 a 20)
    const duration = 20000; // tempo total animação (ms)
    const totalSteps = 200;
    const times = d3.range(0, totalSteps + 1);

    // Funções concentração: reagente A decai, produto B cresce
    function concA(t) {
      return Math.exp(-t / totalSteps * 4);
    }
    function concB(t) {
      return 1 - concA(t);
    }

    // Escalas
    const xScale = d3.scaleLinear()
      .domain([0, totalSteps])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);

    // Criar os eixos
    const xAxis = d3.axisBottom(xScale).ticks(6).tickFormat(d => Math.round(d/10));
    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .append("text")
      .attr("class", "axis-label")
      .attr("x", -margin.left+400)
      .attr("y", margin.top - 20)
      .attr("text-anchor", "end")
      .text("TIME");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .append("text")
      .attr("class", "axis-label")
      .attr("x", -margin.left+300)
      .attr("y", margin.top - 20)
      .attr("text-anchor", "start")
      .text("CONCENTRATION");

    // Linha reagente A (vermelho)
    const lineA = d3.line()
      .x(d => xScale(d))
      .y(d => yScale(concA(d)));

    // Linha produto B (azul)
    const lineB = d3.line()
      .x(d => xScale(d))
      .y(d => yScale(concB(d)));

    // Caminhos para as linhas, começamos vazios
    const pathA = svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#d62728")
      .attr("stroke-width", 3);

    const pathB = svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#1f77b4")
      .attr("stroke-width", 3);

    // Labels no gráfico
    svg.append("text")
      .attr("class", "label-reactant")
      .attr("x", xScale(8))
      .attr("y", yScale(concA(8)) - 10)
      .text("Reagent A");

    svg.append("text")
      .attr("class", "label-product")
      .attr("x", xScale(12))
      .attr("y", yScale(concB(12)) + 20)
      .text("Product B");

    // --- Tubos de ensaio animados ---
    // Configurações dos tubos
    const tubeWidth = 100, tubeHeight = 250;
    const numTubes = 5; // quantos tubos lado a lado
    const maxBubbles = 50;

    // Criar container dos tubos no #container
    const containerTubes = d3.select("#container2")
      .style("display", "flex")
      .style("gap", "30px")
      .style("justify-content", "center")
      .style("flex-wrap", "wrap");

    // Criar dados para todos os tubos, cada um com suas bolhas A e B, posicionadas aleatoriamente
    const tubesData = d3.range(numTubes).map((tubeIndex) => {
      // Cada tubo tem bolhas verdes (A) e laranja (B)
      // Inicialmente, bolhas são geradas com posição randômica dentro do líquido
      const liquidX = tubeWidth * 0.18,
            liquidY = tubeHeight * 0.14,
            liquidWidth = tubeWidth * 0.64,
            liquidHeight = tubeHeight * 0.75;

      // Gerar bolhas
      let bubblesA = d3.range(maxBubbles).map(() => ({
        x: liquidX + Math.random() * liquidWidth,
        y: liquidY + Math.random() * liquidHeight,
        radius: 5 + Math.random() * 3
      }));

      let bubblesB = d3.range(maxBubbles).map(() => ({
        x: liquidX + Math.random() * liquidWidth,
        y: liquidY + Math.random() * liquidHeight,
        radius: 5 + Math.random() * 3
      }));

      return {
        tubeIndex,
        bubblesA,
        bubblesB,
        liquidX, liquidY, liquidWidth, liquidHeight
      };
    });

    // Criar SVGs para cada tubo e desenhar elementos fixos
    const tubes = containerTubes.selectAll("svg")
      .data(tubesData)
      .enter()
      .append("svg")
      .attr("width", tubeWidth)
      .attr("height", tubeHeight)
      .style("background", "white")
      .style("border-radius", "8px")
      .style("box-shadow", "0 0 15px rgba(0,0,0,0.1)");

    // Em cada SVG tubo desenhar tubo, rolha, fundo líquido, bolhas e label
    tubes.each(function(d) {
      const svgTube = d3.select(this);

      // Tubo
      svgTube.append("rect")
        .attr("class", "tube")
        .attr("x", tubeWidth * 0.15)
        .attr("y", tubeHeight * 0.12)
        .attr("width", tubeWidth * 0.7)
        .attr("height", tubeHeight * 0.8)
        .attr("rx", 20)
        .attr("ry", 20);

      // Rolha
      svgTube.append("rect")
        .attr("class", "cork")
        .attr("x", tubeWidth * 0.15)
        .attr("y", tubeHeight * 0.04)
        .attr("width", tubeWidth * 0.7)
        .attr("height", tubeHeight * 0.08)
        .attr("rx", 5)
        .attr("ry", 5);

      // Fundo líquido
      svgTube.append("rect")
        .attr("x", d.liquidX)
        .attr("y", d.liquidY)
        .attr("width", d.liquidWidth)
        .attr("height", d.liquidHeight)
        .attr("fill", "#cee7f0")
        .attr("rx", 15)
        .attr("ry", 15);

      // Grupo bolhas
      const bubblesGroup = svgTube.append("g").attr("class", "bubbles-group");

      // Bolhas A
      bubblesGroup.selectAll(".bubbleA")
        .data(d.bubblesA)
        .enter()
        .append("circle")
        .attr("class", "bubbleA")
        .attr("cx", b => b.x)
        .attr("cy", b => b.y)
        .attr("r", b => b.radius);

      // Bolhas B
      bubblesGroup.selectAll(".bubbleB")
        .data(d.bubblesB)
        .enter()
        .append("circle")
        .attr("class", "bubbleB")
        .attr("cx", b => b.x)
        .attr("cy", b => b.y)
        .attr("r", b => b.radius);

      // Label tubo com o passo da reação
      svgTube.append("text")
        .attr("class", "tube-label")
        .attr("x", tubeWidth / 2)
        .attr("y", tubeHeight * 0.99)
        .text(`Passo ${d.tubeIndex}`);
    });

    // Variável para controlar qual tubo está animando (loop de 0 a numTubes-1)
    let currentTube = 0;

    // Para controle do tempo dos passos (troca de tubo animado a cada X ms)
    const stepDurationMs = 3000; // 3 segundos por tubo

    // Função para atualizar bolhas e visibilidade de bolhas A e B conforme concentração
    function updateTube(tubeData, t, animateBubbles) {
      // Concentração no passo t ajustado para este tubo
      // Dividimos o totalSteps em blocos, cada tubo corresponde a uma faixa do tempo
      const stepsPerTube = Math.floor(totalSteps / numTubes);
      const baseStep = tubeData.tubeIndex * stepsPerTube;
      const localStep = Math.min(Math.max(t - baseStep, 0), stepsPerTube);

      // Calcular concentração para este localStep
      const concAVal = concA(baseStep + localStep);
      const concBVal = concB(baseStep + localStep);

      // Número de bolhas visíveis
      const visibleA = Math.round(concAVal * maxBubbles);
      const visibleB = Math.round(concBVal * maxBubbles);

      // Selecionar SVG do tubo
      const svgTube = d3.select(containerTubes.selectAll("svg").nodes()[tubeData.tubeIndex]);

      // Atualizar visibilidade das bolhas
      svgTube.selectAll(".bubbleA")
        .attr("visibility", (d,i) => i < visibleA ? "visible" : "hidden");

      svgTube.selectAll(".bubbleB")
        .attr("visibility", (d,i) => i < visibleB ? "visible" : "hidden");

      if (animateBubbles) {
        // Animar movimento vertical suave das bolhas A
        tubeData.bubblesA.forEach((b, i) => {
          b.y += 0.3 * (i % 2 ? 1 : -1);
          if (b.y > tubeData.liquidY + tubeData.liquidHeight) b.y = tubeData.liquidY + 5;
          if (b.y < tubeData.liquidY) b.y = tubeData.liquidY + tubeData.liquidHeight - 5;
        });
        svgTube.selectAll(".bubbleA").data(tubeData.bubblesA).attr("cy", d => d.y);

        // Animar movimento vertical suave das bolhas B
        tubeData.bubblesB.forEach((b, i) => {
          b.y += 0.25 * (i % 2 ? -1 : 1);
          if (b.y > tubeData.liquidY + tubeData.liquidHeight) b.y = tubeData.liquidY + 5;
          if (b.y < tubeData.liquidY) b.y = tubeData.liquidY + tubeData.liquidHeight - 5;
        });
        svgTube.selectAll(".bubbleB").data(tubeData.bubblesB).attr("cy", d => d.y);
      }
    }

    // --- Animação geral ---

    // Variável global de tempo para gráfico
    let timeStep = 0;

    // Função update geral chamada pelo timer
    function updateAll() {
      // Atualizar gráfico (avança 1 passo)
      pathA.datum(times.slice(0, timeStep + 1)).attr("d", lineA);
      pathB.datum(times.slice(0, timeStep + 1)).attr("d", lineB);

      // Atualizar tubos:
      // Para cada tubo:
      //  - se é o tubo atual animando, atualiza bolhas com movimento
      //  - caso contrário, atualiza bolhas sem movimento (só visibilidade conforme concentração)
      tubesData.forEach((tubeData, i) => {
        updateTube(tubeData, timeStep, i === currentTube);
      });

      // Incrementar tempo e trocar tubo animado a cada stepDurationMs
      timeStep = (timeStep + 1) % (totalSteps + 1);

      // Mudar tubo animado a cada stepDurationMs, com base no tempo real
      const now = Date.now();
      if (!updateAll.lastChange) updateAll.lastChange = now;
      if (now - updateAll.lastChange > stepDurationMs) {
        currentTube = (currentTube + 1) % numTubes;
        updateAll.lastChange = now;
      }
    }

    // Loop da animação usando d3.timer
    d3.timer(() => {
      updateAll();
    });
  });
</script>