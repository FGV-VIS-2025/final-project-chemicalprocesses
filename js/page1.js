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

const width = +svg.attr("width") - 60;
const height = +svg.attr("height") - 60;
const margin = { top: 20, right: 30, bottom: 30, left: 40 };

const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

const xScale = d3.scaleLinear().domain([0, 10]).range([0, width]);
const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

// Eixos
g.append("g")
  .attr("transform", `translate(0,${height})`)
  .attr("class", "x-axis")
  .call(xAxis);

g.append("g")
  .attr("class", "y-axis")
  .call(yAxis);

// Linha da curva de concentração
const line = d3.line()
  .x(d => xScale(d.time))
  .y(d => yScale(d.conc));

const linePath = g.append("path")
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2);

// =======================
// Atualização do Gráfico e Partículas
// =======================
function updateChart() {
  const A0 = +concAInput.value;
  const k = +kInput.value;
  const n = +orderInput.value;

  // Atualizar valores exibidos
  concAVal.textContent = A0;
  kVal.textContent = k;
  orderValue.textContent = n;

  // Atualizar descrição da lei de velocidade
  const description = n === 0 ? `rate = k` :
                      n === 1 ? `rate = k[A]` :
                      n === 2 ? `rate = k[A]^2` :
                                `rate = k[A]^${n}`;
  rateLawDescription.innerHTML = `The selected reaction has an order of <strong>${n}</strong>. The rate law is: <code>${description}</code>`;

  // Gerar dados da curva de concentração ao longo do tempo
  const data = [];
  const dt = 0.1;
  let A = A0;
  for (let t = 0; t <= 10; t += dt) {
    data.push({ time: t, conc: Math.max(A, 0) });
    A -= k * Math.pow(A, n) * dt;
  }

  yScale.domain([0, A0]);
  g.select(".y-axis").transition().duration(300).call(d3.axisLeft(yScale));

  linePath.datum(data)
    .transition()
    .duration(300)
    .attr("d", line);

  updateParticles(A0, k, n);
}

function updateParticles(A0, k, n) {
  animSvg.selectAll("*").remove();

  const numParticles = Math.min(100, Math.floor(A0));
  const particles = animSvg.selectAll("circle")
    .data(d3.range(numParticles))
    .enter()
    .append("circle")
    .attr("cx", () => Math.random() * 480)
    .attr("cy", () => Math.random() * 280)
    .attr("r", 5)
    .attr("fill", "blue");

  particles.transition()
    .delay((d, i) => i * 10)
    .duration(2000 / k)
    .ease(d3.easeLinear)
    .attr("cx", () => Math.random() * 480)
    .attr("cy", () => Math.random() * 280)
    .attr("fill", "red")
    .on("end", function() {
      d3.select(this).attr("opacity", 0.1);
    });
}

// =======================
// Interações
// =======================
concAInput.addEventListener("input", updateChart);
kInput.addEventListener("input", updateChart);
orderInput.addEventListener("input", updateChart);

// Inicializar gráfico
updateChart();

// =======================
// Animação Molecular: Decomposição de N2O5 Profissional em Loop
// =======================

const molSvg = d3.select("#zeroOrderExample");
molSvg.selectAll("*").remove();

const centerX = 150;
const centerY = 100;

const colors = {
  N: "steelblue",
  O: "crimson"
};

// Definição da marker para seta
molSvg.append("defs").append("marker")
  .attr("id", "arrowhead")
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
    .attr("r", 12)
    .attr("fill", colors.N);

  group.append("circle")
    .attr("cx", centerX + 20)
    .attr("cy", centerY)
    .attr("r", 12)
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
      .attr("r", 10)
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

function createArrow() {
  const arrowGroup = molSvg.append("g").attr("class", "arrow");

  arrowGroup.append("line")
    .attr("x1", centerX + 70)
    .attr("y1", centerY)
    .attr("x2", centerX + 150)
    .attr("y2", centerY)
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .attr("marker-end", "url(#arrowhead)");

  return arrowGroup;
}

function createProductsGroup() {
  const productsGroup = molSvg.append("g").attr("class", "products");

  // NO
  productsGroup.append("circle")
    .attr("cx", centerX + 180)
    .attr("cy", centerY - 15)
    .attr("r", 12)
    .attr("fill", colors.N);

  productsGroup.append("circle")
    .attr("cx", centerX + 210)
    .attr("cy", centerY - 15)
    .attr("r", 10)
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
    .attr("r", 10)
    .attr("fill", colors.O);

  productsGroup.append("circle")
    .attr("cx", centerX + 260)
    .attr("cy", centerY + 15)
    .attr("r", 10)
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

function animateMolecule() {
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
      createArrow();

      setTimeout(() => {
        n2o5.transition()
          .duration(1000)
          .attr("opacity", 0)
          .remove();

        const products = createProductsGroup();
        products.attr("opacity", 0)
          .transition()
          .duration(1000)
          .attr("opacity", 1);

        setTimeout(() => {
          animateMolecule();
        }, 3000);

      }, 1000);
    });
}

animateMolecule();
