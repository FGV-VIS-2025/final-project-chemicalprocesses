// =======================
// Seletores e Configuração Inicial
// =======================
const concAInput = document.getElementById("concA");
const concAVal = document.getElementById("concAVal");
const kInput = document.getElementById("k");
const kVal = document.getElementById("kVal");
const orderInput = document.getElementById("order");
const orderValue = document.getElementById("orderValue");
const rateLawDescription = document.getElementById("rateLawDescription");

const svg = d3.select("#chart");
const animSvg = d3.select("#animation");

const svgWidth = +svg.attr("width");
const svgHeight = +svg.attr("height");

const margin = { top: 40, right: 50, bottom: 5, left: 80 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

const xScale = d3.scaleLinear().domain([0, 10]).range([0, width]);
const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

const xAxis = d3.axisBottom(xScale).ticks(10).tickSizeOuter(0);
const yAxis = d3.axisLeft(yScale).ticks(8).tickSizeOuter(0);

const xAxisG = g.append("g")
  .attr("transform", `translate(0,${height})`)
  .attr("class", "x-axis")
  .call(xAxis)
  .selectAll("text")
  .style("font-size", "20px");

const yAxisG = g.append("g")
  .attr("class", "y-axis")
  .call(yAxis)
  .selectAll("text")
  .style("font-size", "20px");

g.selectAll(".x-axis .tick line")
  .attr("stroke-width", 2)
  .attr("y2", 10);
g.selectAll(".y-axis .tick line")
  .attr("stroke-width", 2)
  .attr("x2", -10);

svg.append("text")
  .attr("x", margin.left + width / 2)
  .attr("y", svgHeight - 40)
  .attr("text-anchor", "middle")
  .style("font-size", "20px")
  .style("font-weight", "bold")
  .text("Time");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", - (margin.top + height / 2))
  .attr("y", 25)
  .attr("text-anchor", "middle")
  .style("font-size", "20px")
  .style("font-weight", "bold")
  .text("Concentration");

svg.append("text")
  .attr("x", margin.left + width / 2)
  .attr("y", 35)
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("font-weight", "bold")
  .text("Concentration vs Time");

const line = d3.line()
  .x(d => xScale(d.time))
  .y(d => yScale(d.conc));

const linePath = g.append("path")
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 4);

let animationTimer;
let timeData = [];

function updateChart() {
  const A0 = +concAInput.value;
  const k = +kInput.value;
  const n = +orderInput.value;

  concAVal.textContent = A0;
  kVal.textContent = k;
  orderValue.textContent = n;

  const description = n === 0 ? `rate = k` :
                      n === 1 ? `rate = k[A]` :
                      n === 2 ? `rate = k[A]^2` :
                                `rate = k[A]^${n}`;
  rateLawDescription.innerHTML = `The selected reaction has an order of <strong>${n}</strong>. The rate law is: <code>${description}</code>`;
}

function startCurveLoop() {
  clearInterval(animationTimer);
  animSvg.selectAll("*").remove();

  const A0 = +concAInput.value;
  const k = +kInput.value;
  const n = +orderInput.value;

  let t = 0;
  const dt = 0.1;
  let A = A0;

  timeData = [];

  yScale.domain([0, A0]);
  g.select(".y-axis")
    .transition()
    .duration(300)
    .call(d3.axisLeft(yScale).ticks(8).tickSizeOuter(0));

  const animWidth = +animSvg.attr("width");
  const animHeight = +animSvg.attr("height");

  const numParticles = Math.min(100, Math.floor(A0));

  const particles = animSvg.selectAll("circle")
    .data(d3.range(numParticles))
    .join("circle")
    .attr("cx", () => Math.random() * animWidth)
    .attr("cy", () => Math.random() * animHeight)
    .attr("r", 5)
    .attr("fill", "blue")
    .attr("opacity", 1);

  animationTimer = setInterval(() => {
    if (t > 10) {
      t = 0;
      A = A0;
      timeData = [];
      particles.attr("fill", "blue").attr("opacity", 1);
    }

    A = Math.max(A - k * Math.pow(A, n) * dt, 0);
    timeData.push({ time: t, conc: A });

    linePath.datum(timeData).attr("d", line);

    const activeParticles = Math.floor((A / A0) * numParticles);

    particles.each(function(d, i) {
      d3.select(this)
        .transition()
        .duration(100)
        .attr("opacity", i < activeParticles ? 1 : 0.6)
        .attr("fill", i < activeParticles ? "blue" : "red");
    });

    t += dt;
  }, 50);
}

concAInput.addEventListener("input", () => {
  updateChart();
  startCurveLoop();
});

kInput.addEventListener("input", () => {
  updateChart();
  startCurveLoop();
});

orderInput.addEventListener("input", () => {
  updateChart();
  startCurveLoop();
});

updateChart();
startCurveLoop();























// Cores dos átomos e tamanhos
const colors = { N: "steelblue", O: "crimson" };
const atomRadius = { N: 14, O: 12 };

//////////////////////
// Zero-order: Decomposição N2O5
//////////////////////

const molSvg = d3.select("#zeroOrderExample");
const centerX = 150;
const centerY = 100;

molSvg.selectAll("*").remove();

// Marker seta
molSvg.append("defs").append("marker")
  .attr("id", "arrowheadZero")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 8)
  .attr("refY", 0)
  .attr("markerWidth", 6)
  .attr("markerHeight", 6)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M0,-5L10,0L0,5")
  .attr("fill", "black");

function createN2O5Group() {
  const group = molSvg.append("g").attr("class", "N2O5");

  // 2 Nitrogênios
  group.append("circle")
    .attr("cx", centerX - 20)
    .attr("cy", centerY)
    .attr("r", atomRadius.N)
    .attr("fill", colors.N);

  group.append("circle")
    .attr("cx", centerX + 20)
    .attr("cy", centerY)
    .attr("r", atomRadius.N)
    .attr("fill", colors.N);

  group.append("text")
    .attr("x", centerX - 20)
    .attr("y", centerY + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .text("N");

  group.append("text")
    .attr("x", centerX + 20)
    .attr("y", centerY + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .text("N");

  // 5 Oxigênios em círculo ao redor
  const radius = 40;
  for (let i = 0; i < 5; i++) {
    const angle = (2 * Math.PI / 5) * i - Math.PI / 2;
    const ox = centerX + radius * Math.cos(angle);
    const oy = centerY + radius * Math.sin(angle);

    group.append("circle")
      .attr("cx", ox)
      .attr("cy", oy)
      .attr("r", atomRadius.O)
      .attr("fill", colors.O);

    group.append("text")
      .attr("x", ox)
      .attr("y", oy + 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text("O");
  }

  return group;
}

function createArrowZero() {
  const arrowGroup = molSvg.append("g").attr("class", "arrow");

  arrowGroup.append("line")
    .attr("x1", centerX + 70)
    .attr("y1", centerY)
    .attr("x2", centerX + 150)
    .attr("y2", centerY)
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .attr("marker-end", "url(#arrowheadZero)");

  return arrowGroup;
}

function createProductsGroupZero() {
  const productsGroup = molSvg.append("g").attr("class", "products");

  // NO
  productsGroup.append("circle")
    .attr("cx", centerX + 180)
    .attr("cy", centerY - 15)
    .attr("r", atomRadius.N)
    .attr("fill", colors.N);

  productsGroup.append("circle")
    .attr("cx", centerX + 210)
    .attr("cy", centerY - 15)
    .attr("r", atomRadius.O)
    .attr("fill", colors.O);

  productsGroup.append("text")
    .attr("x", centerX + 180)
    .attr("y", centerY - 10)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .text("N");

  productsGroup.append("text")
    .attr("x", centerX + 210)
    .attr("y", centerY - 10)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("O");

  productsGroup.append("text")
    .attr("x", centerX + 195)
    .attr("y", centerY + 15)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text("+");

  // O2
  productsGroup.append("circle")
    .attr("cx", centerX + 230)
    .attr("cy", centerY + 15)
    .attr("r", atomRadius.O)
    .attr("fill", colors.O);

  productsGroup.append("circle")
    .attr("cx", centerX + 260)
    .attr("cy", centerY + 15)
    .attr("r", atomRadius.O)
    .attr("fill", colors.O);

  productsGroup.append("text")
    .attr("x", centerX + 230)
    .attr("y", centerY + 20)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("O");

  productsGroup.append("text")
    .attr("x", centerX + 260)
    .attr("y", centerY + 20)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("O");

  return productsGroup;
}

function animateMoleculeZero() {
  molSvg.selectAll(".N2O5").remove();
  molSvg.selectAll(".arrow").remove();
  molSvg.selectAll(".products").remove();

  const n2o5 = createN2O5Group();

  // Pisca 2 vezes para indicar reação
  n2o5
    .attr("opacity", 1)
    .transition()
    .duration(1500)
    .attr("opacity", 0.3)
    .transition()
    .duration(1500)
    .attr("opacity", 1)
    .on("end", () => {
      createArrowZero();

      setTimeout(() => {
        n2o5.transition()
          .duration(1000)
          .attr("opacity", 0)
          .remove();

        const products = createProductsGroupZero();
        products.attr("opacity", 0)
          .transition()
          .duration(1000)
          .attr("opacity", 1);

        setTimeout(() => {
          animateMoleculeZero();
        }, 3000);

      }, 1000);
    });
}

animateMoleculeZero();

//////////////////////
// First-order: Decomposição 2NO2 -> 2NO + O2
//////////////////////

const firstSvg = d3.select("#firstOrderExample");
firstSvg.selectAll("*").remove();

// Marker seta
firstSvg.append("defs").append("marker")
  .attr("id", "arrowheadFirst")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 8)
  .attr("refY", 0)
  .attr("markerWidth", 6)
  .attr("markerHeight", 6)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M0,-5L10,0L0,5")
  .attr("fill", "black");

// Função que desenha molécula NO2
function createNO2Group(svg, x, y, className) {
  const group = svg.append("g").attr("class", className);

  // N
  group.append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", atomRadius.N)
    .attr("fill", colors.N);

  group.append("text")
    .attr("x", x)
    .attr("y", y + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "14px")
    .text("N");

  // 2 O's ligadas ao N em ângulo ~120°
  const angleO1 = -Math.PI / 3;  // -60°
  const angleO2 = Math.PI / 3;   // +60°
  const radiusO = 30;

  const ox1 = x + radiusO * Math.cos(angleO1);
  const oy1 = y + radiusO * Math.sin(angleO1);
  const ox2 = x + radiusO * Math.cos(angleO2);
  const oy2 = y + radiusO * Math.sin(angleO2);

  // Linhas ligando N - O
  group.append("line")
    .attr("x1", x)
    .attr("y1", y)
    .attr("x2", ox1)
    .attr("y2", oy1)
    .attr("stroke", "gray")
    .attr("stroke-width", 2);

  group.append("line")
    .attr("x1", x)
    .attr("y1", y)
    .attr("x2", ox2)
    .attr("y2", oy2)
    .attr("stroke", "gray")
    .attr("stroke-width", 2);

  // O 1
  group.append("circle")
    .attr("cx", ox1)
    .attr("cy", oy1)
    .attr("r", atomRadius.O)
    .attr("fill", colors.O);

  group.append("text")
    .attr("x", ox1)
    .attr("y", oy1 + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "12px")
    .text("O");

  // O 2
  group.append("circle")
    .attr("cx", ox2)
    .attr("cy", oy2)
    .attr("r", atomRadius.O)
    .attr("fill", colors.O);

  group.append("text")
    .attr("x", ox2)
    .attr("y", oy2 + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "12px")
    .text("O");

  return group;
}

// Função para criar o grupo de produtos: 2 NO + O2
function createProductsFirst(svg) {
  const group = svg.append("g").attr("class", "products");

  // 2 NO
  const no1x = 350;
  const no1y = 100;
  const no2x = 390;
  const no2y = 100;

  [no1x, no2x].forEach((x, i) => {
    // N
    group.append("circle")
      .attr("cx", x)
      .attr("cy", no1y)
      .attr("r", atomRadius.N)
      .attr("fill", colors.N);

    group.append("text")
      .attr("x", x)
      .attr("y", no1y + 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .attr("font-size", "14px")
      .text("N");

    // O ligado a N
    const ox = x + 30;
    const oy = no1y;

    // Ligação
    group.append("line")
      .attr("x1", x)
      .attr("y1", no1y)
      .attr("x2", ox)
      .attr("y2", oy)
      .attr("stroke", "gray")
      .attr("stroke-width", 2);

    group.append("circle")
      .attr("cx", ox)
      .attr("cy", oy)
      .attr("r", atomRadius.O)
      .attr("fill", colors.O);

    group.append("text")
      .attr("x", ox)
      .attr("y", oy + 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .attr("font-size", "12px")
      .text("O");
  });

  // Símbolo +
  group.append("text")
    .attr("x", no2x + 40)
    .attr("y", no1y + 5)
    .attr("font-size", "18px")
    .attr("font-weight", "bold")
    .text("+");

  // O2
  const o2x1 = no2x + 70;
  const o2y = no1y + 10;

  group.append("circle")
    .attr("cx", o2x1)
    .attr("cy", o2y)
    .attr("r", atomRadius.O)
    .attr("fill", colors.O);

  group.append("circle")
    .attr("cx", o2x1 + 30)
    .attr("cy", o2y)
    .attr("r", atomRadius.O)
    .attr("fill", colors.O);

  // Ligação O2
  group.append("line")
    .attr("x1", o2x1)
    .attr("y1", o2y)
    .attr("x2", o2x1 + 30)
    .attr("y2", o2y)
    .attr("stroke", "gray")
    .attr("stroke-width", 2);

  group.append("text")
    .attr("x", o2x1)
    .attr("y", o2y + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "12px")
    .text("O");

  group.append("text")
    .attr("x", o2x1 + 30)
    .attr("y", o2y + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "12px")
    .text("O");

  return group;
}

function createArrowFirst() {
  const arrowGroup = firstSvg.append("g").attr("class", "arrow");

  arrowGroup.append("line")
    .attr("x1", 270)
    .attr("y1", 100)
    .attr("x2", 330)
    .attr("y2", 100)
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .attr("marker-end", "url(#arrowheadFirst)");

  return arrowGroup;
}

function animateFirstOrder() {
  firstSvg.selectAll(".reactants").remove();
  firstSvg.selectAll(".arrow").remove();
  firstSvg.selectAll(".products").remove();

  // 2 moléculas NO2, lado a lado
  const no2_1 = createNO2Group(firstSvg, 120, 100, "reactants");
  const no2_2 = createNO2Group(firstSvg, 180, 100, "reactants");

  // Pisca 2 vezes para indicar reação
  firstSvg.selectAll(".reactants")
    .attr("opacity", 1)
    .transition()
    .duration(1500)
    .attr("opacity", 0.3)
    .transition()
    .duration(1500)
    .attr("opacity", 1)
    .on("end", () => {
      createArrowFirst();

      setTimeout(() => {
        firstSvg.selectAll(".reactants")
          .transition()
          .duration(1000)
          .attr("opacity", 0)
          .remove();

        const products = createProductsFirst(firstSvg);
        products.attr("opacity", 0)
          .transition()
          .duration(1000)
          .attr("opacity", 1);

        setTimeout(() => {
          animateFirstOrder();
        }, 3000);

      }, 1000);
    });
}

animateFirstOrder();

//////////////////////
// Second-order: 2NO2 -> N2O4
//////////////////////

const secondSvg = d3.select("#secondOrderExample");
secondSvg.selectAll("*").remove();

// Marker seta
secondSvg.append("defs").append("marker")
  .attr("id", "arrowheadSecond")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 8)
  .attr("refY", 0)
  .attr("markerWidth", 6)
  .attr("markerHeight", 6)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M0,-5L10,0L0,5")
  .attr("fill", "black");

// Função para criar molécula NO2 para segunda reação (reutilizamos)
function createNO2Second(svg, x, y) {
  return createNO2Group(svg, x, y, "reactants");
}

// Função para criar molécula N2O4 (2 NO2 unidas)
function createN2O4Group(svg, x, y) {
  const group = svg.append("g").attr("class", "products");

  // 2 Nitrogênios lado a lado (ligados)
  const N1x = x - 20;
  const N2x = x + 20;
  const Ny = y;

  // Ligação entre N
  group.append("line")
    .attr("x1", N1x)
    .attr("y1", Ny)
    .attr("x2", N2x)
    .attr("y2", Ny)
    .attr("stroke", "gray")
    .attr("stroke-width", 3);

  // N1
  group.append("circle")
    .attr("cx", N1x)
    .attr("cy", Ny)
    .attr("r", atomRadius.N)
    .attr("fill", colors.N);
  group.append("text")
    .attr("x", N1x)
    .attr("y", Ny + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "14px")
    .text("N");

  // N2
  group.append("circle")
    .attr("cx", N2x)
    .attr("cy", Ny)
    .attr("r", atomRadius.N)
    .attr("fill", colors.N);
  group.append("text")
    .attr("x", N2x)
    .attr("y", Ny + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "14px")
    .text("N");

  // 4 O's em volta (2 ligados em cada N)
  const oxOffset = 30;
  const oyOffset = 20;

  // O ligados a N1 (cima e baixo)
  group.append("line")
    .attr("x1", N1x)
    .attr("y1", Ny)
    .attr("x2", N1x - oxOffset)
    .attr("y2", Ny - oyOffset)
    .attr("stroke", "gray")
    .attr("stroke-width", 2);

  group.append("circle")
    .attr("cx", N1x - oxOffset)
    .attr("cy", Ny - oyOffset)
    .attr("r", atomRadius.O)
    .attr("fill", colors.O);

  group.append("text")
    .attr("x", N1x - oxOffset)
    .attr("y", Ny - oyOffset + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "12px")
    .text("O");

  group.append("line")
    .attr("x1", N1x)
    .attr("y1", Ny)
    .attr("x2", N1x - oxOffset)
    .attr("y2", Ny + oyOffset)
    .attr("stroke", "gray")
    .attr("stroke-width", 2);

  group.append("circle")
    .attr("cx", N1x - oxOffset)
    .attr("cy", Ny + oyOffset)
    .attr("r", atomRadius.O)
    .attr("fill", colors.O);

  group.append("text")
    .attr("x", N1x - oxOffset)
    .attr("y", Ny + oyOffset + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "12px")
    .text("O");

  // O ligados a N2 (cima e baixo)
  group.append("line")
    .attr("x1", N2x)
    .attr("y1", Ny)
    .attr("x2", N2x + oxOffset)
    .attr("y2", Ny - oyOffset)
    .attr("stroke", "gray")
    .attr("stroke-width", 2);

  group.append("circle")
    .attr("cx", N2x + oxOffset)
    .attr("cy", Ny - oyOffset)
    .attr("r", atomRadius.O)
    .attr("fill", colors.O);

  group.append("text")
    .attr("x", N2x + oxOffset)
    .attr("y", Ny - oyOffset + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "12px")
    .text("O");

  group.append("line")
    .attr("x1", N2x)
    .attr("y1", Ny)
    .attr("x2", N2x + oxOffset)
    .attr("y2", Ny + oyOffset)
    .attr("stroke", "gray")
    .attr("stroke-width", 2);

  group.append("circle")
    .attr("cx", N2x + oxOffset)
    .attr("cy", Ny + oyOffset)
    .attr("r", atomRadius.O)
    .attr("fill", colors.O);

  group.append("text")
    .attr("x", N2x + oxOffset)
    .attr("y", Ny + oyOffset + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "12px")
    .text("O");

  return group;
}

function createArrowSecond() {
  const arrowGroup = secondSvg.append("g").attr("class", "arrow");

  arrowGroup.append("line")
    .attr("x1", 230)
    .attr("y1", 100)
    .attr("x2", 290)
    .attr("y2", 100)
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .attr("marker-end", "url(#arrowheadSecond)");

  return arrowGroup;
}

function animateSecondOrder() {
  secondSvg.selectAll(".reactants").remove();
  secondSvg.selectAll(".arrow").remove();
  secondSvg.selectAll(".products").remove();

  const no2_1 = createNO2Second(secondSvg, 100, 100);
  const no2_2 = createNO2Second(secondSvg, 160, 100);

  secondSvg.selectAll(".reactants")
    .attr("opacity", 1)
    .transition()
    .duration(1500)
    .attr("opacity", 0.3)
    .transition()
    .duration(1500)
    .attr("opacity", 1)
    .on("end", () => {
      createArrowSecond();

      setTimeout(() => {
        secondSvg.selectAll(".reactants")
          .transition()
          .duration(1000)
          .attr("opacity", 0)
          .remove();

        const products = createN2O4Group(secondSvg, 220, 100);
        products.attr("opacity", 0)
          .transition()
          .duration(1000)
          .attr("opacity", 1);

        setTimeout(() => {
          animateSecondOrder();
        }, 3000);
      }, 1000);
    });
}

animateSecondOrder();