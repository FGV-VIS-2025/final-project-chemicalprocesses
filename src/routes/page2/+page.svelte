<script>
  import ArrheniusChart from '$lib/components/ArrheniusChart.svelte';
  import ParticleAnimation from '$lib/components/ParticleAnimation.svelte';
  import CollisionChart from '$lib/components/CollisionChart.svelte';
  import { page } from '$app/stores';

  let currentPage = $page.url.pathname; 
  let Ea = 50;
  let A_slider = 5;
  $: A = A_slider * 1e13;
  let T = 300;
  let T1 = 200;
  let T2 = 500;
  let showMarker = true;

  let running = false;
  let restartKey = 0;
  let chartKey = 0;

  let collisionHistory1 = [];
  let collisionHistory2 = [];

  function toggleRunning() {
    running = !running;
  }

  function restartSimulation() {
    restartKey += 1;
    chartKey += 1;
    collisionHistory1 = [];
    collisionHistory2 = [];
  }
</script>

<svelte:head>
  <title>Activation Energy</title>
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

<main class="page" id="page2">
  <h1>
    <span class="chem-icon">⚗️</span> Activation Energy
  </h1>

  <p>
  This page illustrates the concept of <strong>activation energy</strong> using the Arrhenius equation
  and dynamic simulations. You can explore how temperature affects the likelihood of particles gaining
  enough energy to react.
</p>


  <div class="controls">
    <label>
      <span>Activation Energy (Ea):</span>
      <input type="range" min="20" max="100" bind:value={Ea} />
      <span>{Ea} kJ/mol</span>
    </label>

    <label>
      <span>Pre-exponential Factor (A):</span>
      <input type="range" min="1" max="10" step="0.1" bind:value={A_slider} />
      <span>{A_slider.toFixed(1)} × 10<sup>13</sup> s<sup>-1</sup></span>
    </label>    

    <label>
      <span>Temperature for Arrhenius Chart (T):</span>
      <input type="range" min="200" max="500" bind:value={T} />
      <span>{T} K</span>
    </label>
  </div>

  <p>
  The chart below shows the <strong>Arrhenius equation</strong>, which models the rate constant k
  as a function of temperature and activation energy. The marker highlights the current value of k
  for the selected temperature T.
</p>


  <div class="chart-container">
    <ArrheniusChart {Ea} {A} {T} {showMarker} />
  </div>

  <div class="content-section">
    <h2>Particle Animation & Collision Graph</h2>

<p>
  The following animations simulate particles at two different temperatures. Each particle has a chance
  to overcome the activation energy barrier and become "activated". You can adjust T_1 and T_2
  to observe how increasing temperature affects activation.
</p>


    <div class="controls">
      <label>
        <span>Temperature T₁:</span>
        <input type="range" min="200" max="500" bind:value={T1} />
        <span>{T1} K</span>
      </label>

      <label>
        <span>Temperature T₂:</span>
        <input type="range" min="200" max="500" bind:value={T2} />
        <span>{T2} K</span>
      </label>

      <div class="animation-controls">
        <button on:click={toggleRunning} class="action-btn">
          {running ? "Pause Animation" : "Start/Resume Animation"}
        </button>
        <button on:click={restartSimulation} class="action-btn">
          Restart Simulation
        </button>
      </div>
    </div>

    <div class="side-by-side" style="margin-top: -1rem">
      
  <div class="sim-header">
    <h4>Simulation T₁ = {T1} K</h4>
    <div class="color-legend">
      <div><span class="color-box blue"></span> Not yet activated</div>
      <div><span class="color-box orange"></span> Activated</div>
    </div>
        <ParticleAnimation
          {Ea}
          {A}
          T={T1}
          {running}
          triggerRestart={restartKey}
          on:collisionUpdate={(e) => collisionHistory1 = [...collisionHistory1, e.detail]}
        />
      </div>
      <div>
  <div class="sim-header">
    <h4>Simulation T₂ = {T2} K</h4>
    <div class="color-legend">
      <div><span class="color-box blue"></span> Not yet activated</div>
      <div><span class="color-box orange"></span> Activated</div>
    </div>
        <ParticleAnimation
          {Ea}
          {A}
          T={T2}
          {running}
          triggerRestart={restartKey}
          on:collisionUpdate={(e) => collisionHistory2 = [...collisionHistory2, e.detail]}
        />
      </div>
    </div>
    </div>

<p>
  The graph below compares the number of activated collisions over time for both simulations. You can
  hover over the lines to inspect the number of collisions at each moment.
</p>


    <div style="margin-top: 3rem; display: flex; justify-content: center;">
      {#key chartKey}
        <CollisionChart history1={collisionHistory1} history2={collisionHistory2} />
      {/key}
    </div>
  </div>
</main>

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

  .page {
    padding: 2rem;
    max-width: 900px;
    margin: 2rem auto;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
  }

  h1 {
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
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  .controls input[type="range"] {
    width: 100%;
    margin: 0.5rem 0;
  }

  .chart-container {
    margin: 2rem 0;
  }

  .animation-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
  }

  .action-btn {
    background: #003366;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background-color 0.3s;
    min-width: 180px;
  }

  .action-btn:hover {
    background: #003366;
  }

  .side-by-side {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: flex-start;
  }

  .animation-legend {
    font-size: 0.85rem;
    color: #333;
    margin-top: 0.5rem;
  }

  @media (max-width: 600px) {
    .side-by-side {
      flex-direction: column;
    }

    .animation-controls {
      flex-direction: column;
    }

    nav ul {
      flex-direction: column;
      gap: 0.5rem;
    }

    nav a {
      width: 100%;
      text-align: center;
    }
  }

    .sim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.color-legend {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
}

.color-box {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  margin-right: 0.3rem;
  vertical-align: middle;
}

.color-box.blue {
  background-color: #003366;
}

.color-box.orange {
  background-color: orange;
}
</style>
