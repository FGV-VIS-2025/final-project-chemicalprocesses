<script>
  import ArrheniusChart from '$lib/components/ArrheniusChart.svelte';
  import ParticleAnimation from '$lib/components/ParticleAnimation.svelte';
  import CollisionChart from '$lib/components/CollisionChart.svelte';

  let Ea = 50;
  let A_slider = 5; // Slider value from 1 to 10
  $: A = A_slider * 1e13; // Scale to correct magnitude
  let T = 300;
  let showMarker = true;

  let running = false;
  let restartKey = 0;

  let collisionHistory = [];

  function toggleRunning() {
    running = !running;
  }

  function restartSimulation() {
    restartKey += 1;
  }

  let isRunning = false;
  let triggerRestart = false;

  function handleRestart() {
    isRunning = true;
    triggerRestart = true;
    setTimeout(() => (triggerRestart = false), 0);
  }
</script>


<svelte:head>
  <title>Activation Energy</title>
</svelte:head>

<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/page0">Introduction</a></li>
    <li><a href="/page1">Reaction Orders</a></li>
    <li><a href="/page2">Activation Energy</a></li>
    <li><a href="/page3">Simulation</a></li>
    <li><a href="/page4">Catalyst Effect</a></li>
    <li><a href="/page5">Radioactivity</a></li>
  </ul>
</nav>

<main class="page" id="page2">
  <h1>
    <span class="chem-icon">⚗️</span> Activation Energy
  </h1>

  <div class="content-section">
    <p>
      The <strong>Arrhenius equation</strong> describes the temperature dependence of reaction rates:
    </p>

    <p class="formula"><code>k = A · e<sup>-Ea / RT</sup></code></p>

    <ul class="equation-vars">
      <li><strong>k</strong>: rate constant</li>
      <li><strong>A</strong>: pre-exponential factor</li>
      <li><strong>E<sub>a</sub></strong>: activation energy</li>
      <li><strong>R</strong>: gas constant (8.314 J/mol·K)</li>
      <li><strong>T</strong>: temperature in Kelvin</li>
    </ul>
  </div>

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
      <span>Temperature (T):</span>
      <input type="range" min="200" max="500" bind:value={T} />
      <span>{T} K</span>
    </label>

    <label class="toggle-label">
      <span>Show Marker on Graph:</span>
      <button on:click={() => showMarker = !showMarker}>
        {showMarker ? "Hide Marker" : "Show Marker"}
      </button>
    </label>
  </div>

  <div class="content-section">
    <p>The graph below shows the relationship between the rate constant <strong>k</strong> and the reciprocal of temperature <strong>1/T</strong>, following the Arrhenius equation.</p>
  </div>

  <div class="chart-container">
    <ArrheniusChart {Ea} {A} {T} {showMarker} />
  </div>

  <div class="content-section">
    <h2>Particle Animation</h2>
    
    <div class="animation-controls">
      <button on:click={toggleRunning} class="action-btn">
        {running ? "Pause Animation" : "Start/Resume Animation"}
      </button>
      <button on:click={restartSimulation} class="action-btn">
        Restart Simulation
      </button>
    </div>

    <ParticleAnimation {Ea} {A} {T} {running} triggerRestart={restartKey} on:collisionUpdate={(e) => collisionHistory = [...collisionHistory, e.detail]}/>
  </div>

  <div class="content-section">
    <h2>Collision Count Over Time</h2>
    <CollisionChart {collisionHistory} />
  </div>

</main>

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
    display: inline-block;
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

  .content-section {
    margin-bottom: 2rem;
  }

  .formula {
    text-align: center;
    font-size: 1.2rem;
    margin: 1.5rem 0;
  }

  .equation-vars {
    background: #e3f2f9;
    padding: 1.5rem;
    border-radius: 8px;
    margin: 1.5rem 0;
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

  .toggle-label {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .chart-container {
    margin: 2rem 0;
  }

  .animation-controls {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
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
  }

  .action-btn:hover {
    background: #004080;
  }

  @media (max-width: 600px) {
    nav ul {
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
    }
    
    nav a {
      padding: 0.5rem 0;
      width: 100%;
      text-align: center;
    }
    
    .animation-controls {
      flex-direction: column;
    }
    
    .controls label {
      flex-direction: column;
    }
  }
</style>