<svelte:head>
  <title>Page 1 - Reaction Orders</title>
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

<main class="page" id="page1">
  <h1>
    <span class="chem-icon">⚗️</span> Reaction Orders
  </h1>

  <div class="controls">
    <label>Initial [A]: <input bind:this={concAInput} type="range" min="1" max="100" value="50" /> <span bind:this={concAVal}></span></label>
    <label>Rate constant k: <input bind:this={kInput} type="range" min="0.1" max="5" step="0.1" value="1" /> <span bind:this={kVal}></span></label>
    <label>Order: <input bind:this={orderInput} type="number" min="0" max="3" value="1" /> <span bind:this={orderValue}></span></label>
  </div>

  <div id="rateLawDescription" bind:this={rateLawDescription} class="rate-law"></div>

  <div class="charts-container">
    <svg id="chart" width="800" height="500"></svg>
    <svg id="animation" width="800" height="200"></svg>
  </div>
</main>

<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let concAInput, concAVal, kInput, kVal, orderInput, orderValue, rateLawDescription;

  onMount(() => {
    const svg = d3.select("#chart");
    const animSvg = d3.select("#animation");
    const svgWidth = +svg.attr("width");
    const svgHeight = +svg.attr("height");
    const margin = { top: 40, right: 50, bottom: 50, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([0, 10]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    
    // Eixos com estilo consistente
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width)
      .attr("y", 30)
      .attr("text-anchor", "end")
      .text("Time");

    g.append("g")
      .call(d3.axisLeft(yScale).ticks(8))
      .append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("text-anchor", "end")
      .text("Concentration");

    const line = d3.line().x(d => xScale(d.time)).y(d => yScale(d.conc));
    const linePath = g.append("path")
      .attr("fill", "none")
      .attr("stroke", "#1f77b4")
      .attr("stroke-width", 4);

    function updateChart() {
      const A0 = +concAInput.value;
      const k = +kInput.value;
      const n = +orderInput.value;
      concAVal.textContent = A0;
      kVal.textContent = k;
      orderValue.textContent = n;
      const desc = n === 0 ? `rate = k` : n === 1 ? `rate = k[A]` : `rate = k[A]^${n}`;
      rateLawDescription.innerHTML = `The selected reaction has an order of <strong>${n}</strong>. The rate law is: <code>${desc}</code>`;
    }

    function startCurveLoop() {
      clearInterval(window.animationTimer);
      animSvg.selectAll("*").remove();
      const A0 = +concAInput.value;
      const k = +kInput.value;
      const n = +orderInput.value;
      let t = 0, A = A0, dt = 0.1;
      const timeData = [];
      const numParticles = Math.min(100, Math.floor(A0));
      const particles = animSvg.selectAll("circle").data(d3.range(numParticles)).join("circle")
        .attr("r", 5)
        .attr("fill", "#1f77b4")
        .attr("opacity", 1)
        .attr("cx", () => Math.random() * +animSvg.attr("width"))
        .attr("cy", () => Math.random() * +animSvg.attr("height"));

      window.animationTimer = setInterval(() => {
        if (t > 10) { t = 0; A = A0; timeData.length = 0; particles.attr("fill", "#1f77b4").attr("opacity", 1); }
        A = Math.max(A - k * Math.pow(A, n) * dt, 0);
        timeData.push({ time: t, conc: A });
        linePath.datum(timeData).attr("d", line);
        const activeParticles = Math.floor((A / A0) * numParticles);
        particles.each(function(_, i) {
          d3.select(this).transition().duration(100)
            .attr("opacity", i < activeParticles ? 1 : 0.6)
            .attr("fill", i < activeParticles ? "#1f77b4" : "#d62728");
        });
        t += dt;
      }, 50);
    }

    updateChart();
    startCurveLoop();

    concAInput.addEventListener("input", () => { updateChart(); startCurveLoop(); });
    kInput.addEventListener("input", () => { updateChart(); startCurveLoop(); });
    orderInput.addEventListener("input", () => { updateChart(); startCurveLoop(); });
  });
</script>

<style>
      
  nav {
    background: #003366;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    font-family: 'Inter', sans-serif;
  }
  
  nav ul {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
    justify-content: center;
  }
  
  nav a {
    text-decoration: none;
    color: #ffffff;
    font-weight: 500;
    font-size: 1rem;
    transition: color 0.3s;
    padding: 0.5rem 1rem;
  }
  
  nav a:hover {
    color: #aad4ff;
  }

  .page {
    padding: 2rem;
    max-width: 900px;
    margin: 2rem auto;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    position: relative;
  }

  .page h1 {
    color: #003366;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }

  .controls {
    background: #e3f2f9;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .controls label {
    display: block;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .controls input[type="range"] {
    width: 300px;
    margin: 0 1rem;
  }

  .controls input[type="number"] {
    width: 60px;
    padding: 0.3rem;
    margin-left: 0.5rem;
  }

  .rate-law {
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #0077cc;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  .charts-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  svg {
    background: white;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0,0,0,0.1);
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
</style>