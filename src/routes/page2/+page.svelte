<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let activationEnergy, preExponentialFactor, temperature;
  let activationEnergyVal, preExponentialFactorVal, temperatureVal;

  onMount(() => {
    function updateArrheniusGraph() {
      const E_a = +activationEnergy.value;
      const A = +preExponentialFactor.value * 1e13;
      const T = +temperature.value;

      activationEnergyVal.textContent = E_a;
      preExponentialFactorVal.textContent = A / 1e13;
      temperatureVal.textContent = T;

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

    function animateParticles(E_a, A, T) {
      const svg = d3.select("#particleAnimation");
      svg.selectAll("*").remove();

      const width = +svg.attr("width"), height = +svg.attr("height");
      const numParticles = 100;
      const particles = d3.range(numParticles).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        reacted: false
      }));

      function step() {
        svg.selectAll("circle")
          .data(particles)
          .join("circle")
          .attr("r", 5)
          .attr("fill", d => d.reacted ? "orange" : "blue")
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);

        for (let p of particles) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          if (!p.reacted && Math.random() < 0.01 * A * Math.exp(-E_a / (8.314 * T))) {
            p.reacted = true;
          }
        }

        requestAnimationFrame(step);
      }

      step();
    }

    updateArrheniusGraph();

    activationEnergy.addEventListener("input", updateArrheniusGraph);
    preExponentialFactor.addEventListener("input", updateArrheniusGraph);
    temperature.addEventListener("input", updateArrheniusGraph);
  });
</script>

<svelte:head>
  <title>Page 2 - Activation Energy</title>
</svelte:head>

<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/page0">Introduction</a></li>
    <li><a href="/page1">Reaction Orders</a></li>
    <li><a href="/page2">Activation Energy</a></li>
    <li><a href="/page3">Reaction Mechanism</a></li>
    <li><a href="/page4">Catalyst Effect</a></li>
    <li><a href="/page5">Radioactivity</a></li>
  </ul>
</nav>

<main class="page" id="page2">
  <h2>Activation Energy</h2>

  <label>Activation Energy (kJ/mol): <input bind:this={activationEnergy} type="range" min="20" max="100" value="50" /> <span bind:this={activationEnergyVal}>50</span></label><br>
  <label>Pre-exponential Factor (x1e13): <input bind:this={preExponentialFactor} type="range" min="1" max="10" value="5" /> <span bind:this={preExponentialFactorVal}>5</span></label><br>
  <label>Temperature (K): <input bind:this={temperature} type="range" min="200" max="500" value="300" /> <span bind:this={temperatureVal}>300</span></label>

  <svg id="arrheniusChart" width="800" height="400"></svg>
  <svg id="particleAnimation" width="800" height="300"></svg>
</main>

<style>
  .page {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
</style>
