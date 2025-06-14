<svelte:head>
  <title>Chemical Reaction Visualizer</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  
  $: isActive = (path) => {
    // Remove a barra final para consistência
    const currentPath = $page.url.pathname.replace(/\/$/, '');
    const comparePath = `${base}${path}`.replace(/\/$/, '');
    return currentPath === comparePath;
  };

  onMount(() => {
    const svg = d3.select("#molecule-bg")
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight)
      .style("position", "fixed")
      .style("top", 0)
      .style("left", 0)
      .style("z-index", -1)
      .style("opacity", 0.25);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const numMolecules = 150;

    const moleculeTypes = ['H2O', 'CO2', 'O2', 'NH3', 'CH4'];

    const molecules = d3.range(numMolecules).map(() => ({
      type: moleculeTypes[Math.floor(Math.random() * moleculeTypes.length)],
      x: Math.random() * width,
      y: Math.random() * height,
      dx: Math.random() * 0.5 - 0.25,
      dy: Math.random() * 0.5 - 0.25
    }));

    const groups = svg.selectAll("g.molecule")
      .data(molecules)
      .enter()
      .append("g")
      .attr("class", "molecule")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

    groups.each(function (d) {
      const g = d3.select(this);
      if (d.type === 'H2O') {
        g.append("circle").attr("r", 5).attr("cx", 0).attr("cy", 0).attr("fill", "#0077cc");
        g.append("circle").attr("r", 3).attr("cx", -10).attr("cy", 10).attr("fill", "#00aaff");
        g.append("circle").attr("r", 3).attr("cx", 10).attr("cy", 10).attr("fill", "#00aaff");
      } else if (d.type === 'CO2') {
        g.append("circle").attr("r", 5).attr("cx", 0).attr("cy", 0).attr("fill", "#0077cc");
        g.append("circle").attr("r", 4).attr("cx", -12).attr("cy", 0).attr("fill", "#66ccff");
        g.append("circle").attr("r", 4).attr("cx", 12).attr("cy", 0).attr("fill", "#66ccff");
      } else if (d.type === 'O2') {
        g.append("circle").attr("r", 4).attr("cx", -6).attr("cy", 0).attr("fill", "#66ccff");
        g.append("circle").attr("r", 4).attr("cx", 6).attr("cy", 0).attr("fill", "#66ccff");
      } else if (d.type === 'NH3') {
        g.append("circle").attr("r", 5).attr("cx", 0).attr("cy", 0).attr("fill", "#4d88ff");
        g.append("circle").attr("r", 3).attr("cx", -10).attr("cy", 6).attr("fill", "#99ccff");
        g.append("circle").attr("r", 3).attr("cx", 10).attr("cy", 6).attr("fill", "#99ccff");
        g.append("circle").attr("r", 3).attr("cx", 0).attr("cy", -10).attr("fill", "#99ccff");
      } else if (d.type === 'CH4') {
        g.append("circle").attr("r", 5).attr("cx", 0).attr("cy", 0).attr("fill", "#333");
        g.append("circle").attr("r", 3).attr("cx", 12).attr("cy", 0).attr("fill", "#999");
        g.append("circle").attr("r", 3).attr("cx", -12).attr("cy", 0).attr("fill", "#999");
        g.append("circle").attr("r", 3).attr("cx", 0).attr("cy", 12).attr("fill", "#999");
        g.append("circle").attr("r", 3).attr("cx", 0).attr("cy", -12).attr("fill", "#999");
      }
    });

    d3.timer(() => {
      groups.each(function (d) {
        d.x = (d.x + d.dx + width) % width;
        d.y = (d.y + d.dy + height) % height;
        d3.select(this).attr("transform", `translate(${d.x}, ${d.y})`);
      });
    });
  });
</script>

<nav class="main-nav">
  <a href="{base}/" class={isActive('/') ? 'active' : ''}>Home</a>
  <a href="{base}/page0" class={isActive('/page0') ? 'active' : ''}>Introduction</a>
  <a href="{base}/page1" class={isActive('/page1') ? 'active' : ''}>Reaction Orders</a>
  <a href="{base}/page2" class={isActive('/page2') ? 'active' : ''}>Activation Energy</a>
  <a href="{base}/page3" class={isActive('/page3') ? 'active' : ''}>Simulation</a>
  <a href="{base}/page4" class={isActive('/page4') ? 'active' : ''}>Catalyst Effect</a>
  <a href="{base}/page5" class={isActive('/page5') ? 'active' : ''}>Radioactivity</a>
</nav>

<svg id="molecule-bg"></svg>

<div id="content" class="chem-section">
  <h1>
    <span class="chem-icon">⚗️</span> Chemical Kinetics Visualizer
  </h1>
  <p>
    Explore the fundamentals of chemical kinetics by visualizing reactions, radioactivity, and catalyst effects.
    Adjust variables such as concentration, temperature, and the presence of catalysts to observe their influence on reaction rates.
  </p>

  <!-- Fórmulas Químicas Estilizadas -->
  <div class="chem-formula scribble1">E<sub>a</sub> = RTln(k)</div>
  <div class="chem-formula scribble2">2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O</div>
  <div class="chem-formula scribble3">rate = k[A]<sup>m</sup>[B]<sup>n</sup></div>

  <!-- Ícones Químicos Flutuantes -->
  <div class="chem-floating chem-dna"></div>
  <div class="chem-floating chem-flask"></div>
</div>

<div class="team-info">
  <h2>Project Team</h2>
  <p>
    This project was developed by a dedicated team of Data Science and Artificial Intelligence undergraduate students.
    We have worked together to bring an intuitive and informative experience for understanding chemical reactions.
  </p>
  <ul>
    <li>
      <span>Integrante 1:</span>
      <a href="https://www.linkedin.com/in/anajuliaamaropereirarocha/" target="_blank" rel="noopener noreferrer">
        Ana Júlia Amaro Pereira Rocha
      </a>
    </li>
    <li>
      <span>Integrante 2:</span>
      <a href="https://www.linkedin.com/in/eduardammag/" target="_blank" rel="noopener noreferrer">
        Maria Eduarda Mesquita Magalhães
      </a>
    </li>
    <li>
      <span>Integrante 3:</span>
      <a href="https://www.linkedin.com/in/ramyro-correa-aquines/" target="_blank" rel="noopener noreferrer">
        Ramyro Corrêa Aquines
      </a>
    </li>
  </ul>
</div>

<footer>
  <p>&copy; 2025 Chemical Reaction Visualizer | All rights reserved</p>
</footer>

<style>
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

  #content {
    padding: 4rem 2rem;
    max-width: 900px;
    margin: 0 auto;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    position: relative;
    z-index: 1;
  }

  #content h1 {
    color: #003366;
    margin-bottom: 1rem;
    font-family: 'Inter', sans-serif;
  }

  .team-info {
    padding: 3rem 2rem;
    background: #e3f2f9;
    max-width: 900px;
    margin: 2rem auto;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    font-family: 'Inter', sans-serif;
  }

  .team-info h2 {
    color: #004080;
  }

  .team-info ul {
    padding-left: 1rem;
    list-style-type: none;
  }

  .team-info li {
    margin: 0.5rem 0;
    font-size: 1rem;
  }

  .team-info a {
    color: #005fa3;
    text-decoration: none;
  }

  .team-info a:hover {
    text-decoration: underline;
  }

  footer {
    text-align: center;
    color: #555;
    font-size: 0.9rem;
    border-top: 1px solid #ccc;
    padding: 1rem;
    background-color: #f0f4f8;
    font-family: 'Inter', sans-serif;
  }

  .chem-section {
    position: relative;
    padding: 2.5rem;
    background: #f9f9f9;
    font-family: 'Inter', sans-serif;
    border-left: 4px solid #0077cc;
    border-radius: 12px;
    overflow: hidden;
  }

  .chem-section h1 {
    font-size: 2.1rem;
    color: #0077cc;
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }

  .chem-formula {
    position: absolute;
    font-size: 0.9rem;
    opacity: 0.3;
    font-family: 'IBM Plex Mono', monospace;
    pointer-events: none;
    user-select: none;
    color: #000;
  }

  .scribble1 {
    top: 10%;
    left: 5%;
    transform: rotate(-18deg);
  }

  .scribble2 {
    bottom: 15%;
    right: 10%;
    transform: rotate(-15deg);
  }

  .scribble3 {
    top: 25%;
    left: 55%;
    transform: rotate(10deg);
  }

  .chem-floating {
    position: absolute;
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0.1;
    animation: float 12s infinite linear;
    pointer-events: none;
    z-index: 0;
  }

  .chem-dna {
    width: 40px;
    height: 50px;
    top: 20%;
    left: 80%;
    background-image: url('https://img.icons8.com/ios-filled/100/dna-helix.png');
  }

  .chem-flask {
    width: 50px;
    height: 60px;
    top: 80%;
    left: 15%;
    background-image: url('https://img.icons8.com/ios-filled/100/laboratory.png');
  }

  @keyframes float {
    0%   { transform: translateY(0) rotate(0deg); }
    50%  { transform: translateY(-10px) rotate(5deg); }
    100% { transform: translateY(0) rotate(0deg); }
  }
</style>