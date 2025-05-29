<script>
  import ArrheniusChart from '$lib/components/ArrheniusChart.svelte';
  import ParticleAnimation from '$lib/components/ParticleAnimation.svelte';

  let Ea = 50;
  let A_slider = 5; // Slider value from 1 to 10
  $: A = A_slider * 1e13; // Scale to correct magnitude
  let T = 300;
  let showMarker = true;

  let running = false;
  let restartKey = 0;

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
    // Reseta o trigger no próximo tick para permitir múltiplos restarts
    setTimeout(() => (triggerRestart = false), 0);
  }

</script>

<svelte:head>
  <title>Activation Energy</title>
</svelte:head>

<main class="activation-page">
  <h2>Activation Energy</h2>

  <p>
    The <strong>Arrhenius equation</strong> describes the temperature dependence of reaction rates:
  </p>

  <p><code>k = A · e<sup>-Ea / RT</sup></code></p>

  <ul>
    <li><strong>k</strong>: rate constant</li>
    <li><strong>A</strong>: pre-exponential factor</li>
    <li><strong>E<sub>a</sub></strong>: activation energy</li>
    <li><strong>R</strong>: gas constant (8.314 J/mol·K)</li>
    <li><strong>T</strong>: temperature in Kelvin</li>
  </ul>

  <div class="sliders">
    <label>
      <strong>Activation Energy (Ea):</strong>
      <input type="range" min="20" max="100" bind:value={Ea} />
      {Ea} kJ/mol
    </label>

    <label>
      <strong>Pre-exponential Factor (A):</strong>
      <input type="range" min="1" max="10" step="0.1" bind:value={A_slider} />
      {A_slider.toFixed(1)} × 10<sup>13</sup> s<sup>-1</sup>
    </label>

    <label>
      <strong>Temperature (T):</strong>
      <input type="range" min="200" max="500" bind:value={T} />
      {T} K
    </label>

    <label>
      <strong>Show Marker on Graph:</strong>
      <button on:click={() => showMarker = !showMarker}>
        {showMarker ? "Hide Marker" : "Show Marker"}
      </button>
    </label>
  </div>

  <p>The graph below shows the relationship between the rate constant <strong>k</strong> and the reciprocal of temperature <strong>1/T</strong>, following the Arrhenius equation.</p>

  <ArrheniusChart {Ea} {A} {T} {showMarker} />

  <h3>Particle Animation</h3>

  <div class="controls">
    <button on:click={toggleRunning}>
      {running ? "Pause Animation" : "Start/Resume Animation"}
    </button>
    <button on:click={restartSimulation}>
      Restart Simulation
    </button>
  </div>

  <ParticleAnimation {Ea} {A} {T} {running} triggerRestart={restartKey} />
</main>

<style>
  .activation-page {
    padding: 2rem;
    font-family: Arial, sans-serif;
    background-color: #e9f3f7;
    color: #222;
    max-width: 900px;
    margin: auto;
  }

  h2, h3 {
    color: #123;
    margin-top: 2rem;
  }

  .sliders label {
    display: flex;
    flex-direction: column;
    margin: 1rem 0;
    font-weight: bold;
  }

  .controls {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
  }

  input[type="range"] {
    width: 100%;
    margin: 0.5rem 0;
  }

  button {
    margin-top: 0.5rem;
    padding: 0.4rem 0.8rem;
    border: none;
    background-color: #123;
    color: white;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #234;
  }

  svg {
    border: 1px solid #ccc;
    margin-top: 1rem;
  }

  ul {
    margin-left: 1.5rem;
  }

  code {
    font-size: 1.1rem;
    background: #fff;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
  }
</style>
