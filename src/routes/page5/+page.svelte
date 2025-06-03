<svelte:head>
  <title>Radioactive Decay - Chemical Kinetics</title>
  <script src="https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js"></script>
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import DecayGraph from '$lib/components/DecayGraph.svelte';
  import ParticleDecay from '$lib/components/ParticleDecay.svelte';
  import DecayHistogram from '$lib/components/DecayHistogram.svelte';
  import { page } from '$app/stores';
  import { base } from '$app/paths';

  let currentPage = $page.url.pathname; // Isso identifica a página atual
  let n0 = 1000;
  let lambda = 0.1;
  let simulatedTime = 0;
  let simulationFinished = false;
  let lifetimes = [];
  
  let decayRef;
  
  onMount(() => {
    document.getElementById('calculate-decay').addEventListener('click', () => {
      const N0 = +document.getElementById('initial-nuclei').value;
      const λ = +document.getElementById('decay-const').value;
      const t = +document.getElementById('decay-time').value;
      
      const N = N0 * Math.exp(-λ * t);
      const equation = `N(t) = ${N0} × e^(-${λ} × ${t})`;
      
      document.getElementById('remaining-nuclei').textContent = 
        `Remaining nuclei: ${N.toFixed(0)} (${(100*N/N0).toFixed(1)}% of initial)`;
      document.getElementById('decay-equation').textContent = 
        `Equation used: ${equation}`;
    });
  });
</script>

<nav class="main-nav">
  <a href="{base}/" class={currentPage === `${base}/` ? 'active' : ''}>Home</a>
  <a href="{base}/page0" class={currentPage === `${base}/page0` ? 'active' : ''}>Introduction</a>
  <a href="{base}/page1" class={currentPage === `${base}/page1` ? 'active' : ''}>Reaction Orders</a>
  <a href="{base}/page2" class={currentPage === `${base}/page2` ? 'active' : ''}>Activation Energy</a>
  <a href="{base}/page3" class={currentPage === `${base}/page3` ? 'active' : ''}>Simulation</a>
  <a href="{base}/page4" class={currentPage === `${base}/page4` ? 'active' : ''}>Catalyst Effect</a>
  <a href="{base}/page5" class={currentPage === `${base}/page5` ? 'active' : ''}>Radioactivity</a>
</nav>


<main class="page" id="page5">
  <h1>
    <span class="chem-icon">☢️</span> Radioactive Decay Simulator
  </h1>

  <section class="theory-section">
    <h2>Understanding Radioactive Decay</h2>
    <p><strong>Radioactive decay</strong> is a random process by which an unstable atomic nucleus loses energy by radiation. This decay follows first-order kinetics, meaning the rate of decay is proportional to the number of undecayed nuclei.</p>
    
    <div class="order-types">
      <div class="order-card">
        <h3>First-Order Kinetics</h3>
        <p>Radioactive decay follows first-order kinetics. The rate law is:</p>
        <div class="equation">rate = λN</div>
        <p>Where λ is the decay constant and N is the number of undecayed nuclei.</p>
      </div>
      
      <div class="order-card">
        <h3>Half-Life</h3>
        <p>The half-life (t<sub>½</sub>) is the time required for half of the radioactive nuclei to decay:</p>
        <div class="equation">t<sub>½</sub> = ln(2)/λ</div>
        <p>This is a characteristic property of each radioactive isotope.</p>
      </div>
      
      <div class="order-card">
        <h3>Decay Equation</h3>
        <p>The number of remaining nuclei decreases exponentially with time:</p>
        <div class="equation">N(t) = N<sub>0</sub>e<sup>-λt</sup></div>
        <p>Where N<sub>0</sub> is the initial number of nuclei.</p>
      </div>
    </div>
  </section>

  <section class="interactive-section">
    <h2>Radioactive Decay Simulator</h2>
    <p>This interactive simulator demonstrates the random nature of radioactive decay and its first-order kinetics. Adjust the parameters below to explore different decay scenarios.</p>

    <div class="controls">
      <div class="control-group">
        <label>Initial Nuclei (N₀): <span class="value-display">{n0}</span>
          <input type="number" bind:value={n0} min="1" max="1000000" class="slider" />
        </label>
      </div>
      
      <div class="control-group">
        <label>Decay Constant (λ): <span class="value-display">{lambda}</span>
          <input type="range" bind:value={lambda} min="0.01" max="1" step="0.01" class="slider" />
        </label>
      </div>
      
      <div class="control-group">
        <label>Half-Life (T<sub>½</sub>): <span class="value-display">{(Math.log(2)/lambda).toFixed(2)} s</span></label>
      </div>
      
      <div class="control-group button-group">
        <button on:click={() => decayRef?.start()} class="sim-button">▶️ Start</button>
        <button on:click={() => decayRef?.pause()} class="sim-button">⏸️ Pause</button>
        <button on:click={() => {
          decayRef?.reset();
          simulationFinished = false;
          simulatedTime = 0;
        }} class="sim-button">🔄 Reset</button>
      </div>
    </div>

    <div class="info-box">
      <p>The left panel shows the function <strong>N(t)</strong>, representing the number of remaining particles over time. Below it, the histogram displays the distribution of decay times. The right panel animates the particles: blue for active particles and orange for decayed ones.</p>
    </div>

    <div class="visualization-container">
      <div class="chart-container">
        <h3>Decay Curve (N vs t)</h3>
        <DecayGraph {n0} {lambda} currentTime={simulatedTime} />
      </div>
      
      <div class="chart-container">
        <h3>Particle Animation</h3>
        <ParticleDecay
          bind:this={decayRef}
          {n0}
          {lambda}
          on:tick={(e) => {
            if (e.detail.t <= 120) simulatedTime = e.detail.t;
          }}
          on:generated={(e) => lifetimes = e.detail.lifetimes}
          on:finished={() => simulationFinished = true}
        />
        
        {#if simulationFinished}
          <p class="simulation-alert">
            ⚠️ Simulation finished. All particles have decayed or the time limit was reached.
          </p>
        {/if}
      </div>
      
      <div class="chart-container">
        <h3>Decay Time Distribution</h3>
        <DecayHistogram {lifetimes} currentTime={simulatedTime} {n0} />
      </div>
    </div>
  </section>

  <section class="characteristics-section">
    <h2>Key Characteristics of Radioactive Decay</h2>
    <table class="order-table">
      <thead>
        <tr>
          <th>Property</th>
          <th>Description</th>
          <th>Mathematical Expression</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Decay Law</td>
          <td>Number of remaining nuclei over time</td>
          <td>N(t) = N<sub>0</sub>e<sup>-λt</sup></td>
        </tr>
        <tr>
          <td>Decay Rate</td>
          <td>Activity (decays per unit time)</td>
          <td>A(t) = λN(t) = A<sub>0</sub>e<sup>-λt</sup></td>
        </tr>
        <tr>
          <td>Half-Life</td>
          <td>Time for half the nuclei to decay</td>
          <td>t<sub>½</sub> = ln(2)/λ ≈ 0.693/λ</td>
        </tr>
        <tr>
          <td>Mean Lifetime</td>
          <td>Average lifetime of a nucleus</td>
          <td>τ = 1/λ</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="tool-section">
    <h2>Decay Time Calculator</h2>
    <div class="calculator-grid">
      <div class="input-group">
        <label>Initial Nuclei (N₀):
          <input type="number" id="initial-nuclei" value="1000" min="1" step="1">
        </label>
      </div>
      <div class="input-group">
        <label>Decay Constant (λ):
          <input type="number" id="decay-const" value="0.1" min="0.01" step="0.01">
        </label>
      </div>
      <div class="input-group">
        <label>Time (t):
          <input type="number" id="decay-time" value="5" min="0" step="0.1">
        </label>
      </div>
      <button id="calculate-decay">Calculate Remaining Nuclei</button>
      <div class="result-box">
        <h3>Results:</h3>
        <p id="remaining-nuclei">Remaining nuclei: --</p>
        <p id="decay-equation">Equation used: --</p>
      </div>
    </div>
  </section>
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

  .main-nav a[href="/page5"] {
    background-color: #3498db;
  }

  .page {
    font-family: Arial, sans-serif;
    padding: 2rem;
    max-width: 1000px;
    margin: 2rem auto;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    position: relative;
    font-family: 'Inter', sans-serif;
    color: #333;
  }

  .page h1 {
    font-family: Arial, sans-serif;
    color: #003366;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    font-size: 2rem;
    border-bottom: 2px solid #e3f2f9;
    padding-bottom: 0.5rem;
  }

  .theory-section {
    font-family: Arial, sans-serif;
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    border-left: 4px solid #0077cc;
  }

  .order-types {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin: 1.5rem 0;
  }

  .order-card {
    background: white;
    padding: 1.2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    border-top: 3px solid #2c7bb6;
  }

  .equation {
    background: #f0f7ff;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-family: Arial, sans-serif;
    font-weight: bold;
    margin: 0.8rem 0;
    display: inline-block;
    color: #d35400;
  }

  .controls {
    background: #e3f2f9;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .control-group {
    margin-bottom: 1rem;
  }

  .control-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #005b9f;
  }

  .slider {
    width: 100%;
    max-width: 400px;
    height: 8px;
    border-radius: 4px;
    background: #d1e3f6;
    outline: none;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #0077cc;
    cursor: pointer;
  }

  .value-display {
    display: inline-block;
    min-width: 40px;
    font-weight: bold;
    color: #003366;
  }

  .visualization-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
  }

  .chart-container {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  }

  .sim-button {
    font-family: Arial, sans-serif;
    background: #0077cc;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .sim-button:hover {
    background: #005b9f;
  }

  .button-group {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .simulation-alert {
    color: darkred;
    font-weight: bold;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: #ffebee;
    border-radius: 4px;
  }

  .order-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.95rem;
    font-family: Arial, sans-serif;
  }

  .order-table th, .order-table td {
    padding: 0.8rem;
    text-align: left;
    border: 1px solid #ddd;
  }

  .order-table th {
    background: #0077cc;
    color: white;
    font-weight: 500;
  }

  .order-table tr:nth-child(even) {
    background: #f0f7ff;
  }

  .info-box {
    background: #f8f9fa;
    border-left: 4px solid #3498db;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 0 4px 4px 0;
  }

  .calculator-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin: 1.5rem 0;
  }

  .input-group {
    display: flex;
    flex-direction: column;
  }

  .input-group label {
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  #calculate-decay {
    grid-column: span 2;
    background: #2ecc71;
    color: white;
    border: none;
    padding: 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  }

  #calculate-decay:hover {
    background: #27ae60;
  }

  .result-box {
    grid-column: span 2;
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 4px;
    border-left: 4px solid #2ecc71;
  }

  @media (max-width: 768px) {
    .visualization-container {
      grid-template-columns: 1fr;
    }
    
    .calculator-grid {
      grid-template-columns: 1fr;
    }
    
    #calculate-decay, .result-box {
      grid-column: span 1;
    }
  }
</style>