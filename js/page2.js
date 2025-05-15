// Carrega o menu de navegação dinamicamente
fetch('navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar').innerHTML = data;
  });

// Atualiza o gráfico de Arrhenius com base nos inputs
function updateArrheniusGraph() {
  const E_a = +document.getElementById("activationEnergy").value;
  const A = +document.getElementById("preExponentialFactor").value * 1e13;
  const T = +document.getElementById("temperature").value;

  document.getElementById("activationEnergyVal").textContent = E_a;
  document.getElementById("preExponentialFactorVal").textContent = A / 1e13;
  document.getElementById("temperatureVal").textContent = T;

  const R = 8.314;
  const k_values = [];
  const T_values = [];

  for (let temp = 200; temp <= 500; temp += 5) {
    const k = A * Math.exp(-E_a * 1000 / (R * temp));
    k_values.push(k);
    T_values.push(1 / temp);
  }

  const svg = d3.select("#arrheniusChart");
  svg.selectAll("*").remove();

  const margin = { top: 10, right: 10, bottom: 30, left: 40 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  const x = d3.scaleLinear().domain([1 / 500, 1 / 200]).range([0, width]);
  const y = d3.scaleLog().domain([Math.min(...k_values), Math.max(...k_values)]).range([height, 0]);

  g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(5));
  g.append("g").call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".1e")));

  const line = d3.line().x((d, i) => x(T_values[i])).y((d, i) => y(k_values[i]));

  g.append("path")
    .datum(k_values)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  animateParticles(E_a, A, T);
}

// Anima as partículas com base em Eₐ, A e T
function animateParticles(E_a, A, T) {
  const svg = d3.select("#particleAnimation");
  svg.selectAll("*").remove();

  const width = +svg.attr("width"), height = +svg.attr("height");
  const numParticles = 100;
  const particles = [];

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 2 - 1,
      reacted: false
    });
  }

  function step() {
    svg.selectAll("circle")
      .data(particles)
      .join("circle")
      .attr("r", 5)
      .attr("fill", d => d.reacted ? "orange" : "blue")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    for (let particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      if (!particle.reacted && Math.random() < 0.01 * A * Math.exp(-E_a / (8.314 * T))) {
        particle.reacted = true;
      }
    }

    requestAnimationFrame(step);
  }

  step();
}

// Inicializa a visualização assim que a página estiver pronta
window.addEventListener("DOMContentLoaded", updateArrheniusGraph);
