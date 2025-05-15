// Executa updateSimulation() apenas se os elementos da página estiverem presentes
function updateSimulation() {
  const A0El = document.getElementById("concA");
  const kEl = document.getElementById("rateK");
  const orderEl = document.getElementById("reactionOrder");

  // Se a página atual não tiver esses elementos (por exemplo, em index.html), sai da função
  if (!A0El || !kEl || !orderEl) return;

  const A0 = +A0El.value;
  const k = +kEl.value;
  const order = +orderEl.value;

  document.getElementById("concAVal").textContent = A0;
  document.getElementById("rateKVal").textContent = k;

  const desc = document.getElementById("rateLawDescription");
  if (order === 0) {
    desc.innerHTML = `The selected reaction is <strong>zero-order</strong>. The rate is independent of concentration: <code>rate = k</code>.`;
  } else if (order === 1) {
    desc.innerHTML = `The selected reaction is <strong>first-order</strong>. The rate depends linearly on [A]: <code>rate = k[A]</code>.`;
  } else if (order === 2) {
    desc.innerHTML = `The selected reaction is <strong>second-order</strong>. The rate depends quadratically on [A]: <code>rate = k[A]<sup>2</sup></code>.`;
  }

  const data = [];
  for (let t = 0; t <= 10; t += 0.1) {
    let A;
    if (order === 0) {
      A = Math.max(0, A0 - k * t);
    } else if (order === 1) {
      A = A0 * Math.exp(-k * t);
    } else if (order === 2) {
      A = A0 / (1 + k * A0 * t);
    }
    data.push({ t, A });
  }

  const svg = d3.select("#chart");
  svg.selectAll("*").remove();

  const margin = { top: 10, right: 10, bottom: 30, left: 40 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  const x = d3.scaleLinear().domain([0, 10]).range([0, width]);
  const y = d3.scaleLinear().domain([0, A0]).range([height, 0]);

  g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
  g.append("g").call(d3.axisLeft(y));

  const line = d3.line().x(d => x(d.t)).y(d => y(d.A));
  g.append("path").datum(data).attr("fill", "none").attr("stroke", "steelblue").attr("stroke-width", 2).attr("d", line);

  animateParticles(A0, k);
}

function animateParticles(A0, k) {
  const svg = d3.select("#animation");
  if (svg.empty()) return;

  svg.selectAll("*").remove();
  const width = +svg.attr("width"), height = +svg.attr("height");

  let particles = d3.range(Math.floor(A0)).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.random() * 2 - 1,
    vy: Math.random() * 2 - 1,
    reacted: false
  }));

  function step() {
    svg.selectAll("circle").data(particles).join("circle")
      .attr("r", 5)
      .attr("fill", d => d.reacted ? "orange" : "blue")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    for (let d of particles) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > width) d.vx *= -1;
      if (d.y < 0 || d.y > height) d.vy *= -1;
      if (!d.reacted && Math.random() < 0.01 * k) d.reacted = true;
    }

    requestAnimationFrame(step);
  }

  step();
}

// Executa updateSimulation quando a página carrega, apenas se os elementos existirem
window.addEventListener("DOMContentLoaded", updateSimulation);
