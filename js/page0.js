// Estilos (cores, fontes, etc) inseridos dinamicamente via JS
const styleContent = `
  body {
    font-family: Arial, sans-serif;
    background: #f5f5f5;
    display: flex;
    justify-content: center;
    padding: 20px;
    gap: 60px;
    flex-wrap: wrap;
  }
  svg {
    background: white;
    border-radius: 8px;
    box-shadow: 0 0 15px #ccc;
  }
  .axis-label {
    font-weight: bold;
    fill: #123455;
    font-size: 14px;
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
  fill: #d62728; /* vermelho reagente */
  opacity: 0.85;
}
.bubbleB {
  fill: #1f77b4; /* azul produto */
  opacity: 0.85;
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
    font-weight: bold;
    fill: #444;
    text-anchor: middle;
    font-size: 14px;
  }
`;
// Cria <style> e insere no <head>
const style = document.createElement("style");
style.textContent = styleContent;
document.head.appendChild(style);

// Configurações básicas do gráfico
const width = 450, height = 350, margin = {top: 40, right: 30, bottom: 40, left: 50};

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
  .attr("x", width - margin.right)
  .attr("y", 35)
  .attr("text-anchor", "end")
  .text("Tempo");

svg.append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(yAxis)
  .append("text")
  .attr("class", "axis-label")
  .attr("x", -margin.left)
  .attr("y", margin.top - 20)
  .attr("text-anchor", "start")
  .text("Concentração");

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
  .attr("stroke", "#d62728") // vermelho
  .attr("stroke-width", 3);

const pathB = svg.append("path")
  .attr("fill", "none")
  .attr("stroke", "#1f77b4") // azul
  .attr("stroke-width", 3);

// Labels no gráfico
svg.append("text")
  .attr("class", "label-reactant")
  .attr("x", xScale(8))
  .attr("y", yScale(concA(8)) - 10)
  .text("Reagente A");

svg.append("text")
  .attr("class", "label-product")
  .attr("x", xScale(12))
  .attr("y", yScale(concB(12)) + 20)
  .text("Produto B");

// --- Tubos de ensaio animados ---
// Configurações dos tubos
const tubeWidth = 100, tubeHeight = 250;
const numTubes = 5; // quantos tubos lado a lado
const maxBubbles = 50;

// Criar container dos tubos no #container
const containerTubes = d3.select("#container2")
  .style("display", "flex")
  .style("gap", "30px");

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
  .style("box-shadow", "0 0 15px #ccc")
  ;

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
    .attr("y", tubeHeight * 0.95)
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
