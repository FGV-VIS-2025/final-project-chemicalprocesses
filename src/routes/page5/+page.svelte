<script>
  import DecayGraph from '$lib/components/DecayGraph.svelte';
  import ParticleDecay from '$lib/components/ParticleDecay.svelte';
  import DecayHistogram from '$lib/components/DecayHistogram.svelte';
  import FormulaBox from '$lib/components/FormulaBox.svelte';

  let n0 = 1000;
  let lambda = 0.1;
  let simulatedTime = 0;
  let simulationFinished = false;
  let lifetimes = [];

  let decayRef;
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    gap: 2rem;
  }

  .controls-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .graph-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .left-column,
  .right-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .button-row {
    display: flex;
    gap: 0.5rem;
  }

  .formula-section {
    margin-top: 2rem;
  }

  :global(body) {
    background-color: #424242; 
    margin: 0;
    font-family: sans-serif;
    font-weight: bold;
  }
</style>

<div class="container">
  <h1>Simulador de Decaimento Radioativo</h1>

  <section class="controls-section">
    <label>N₀:
      <input type="number" bind:value={n0} min="1" max="1000000" />
    </label>
    <label>λ:
      <input type="range" bind:value={lambda} min="0.01" max="1" step="0.01" />
      {lambda}
    </label>
    <p>Meia-vida (T₁/₂): {(Math.log(2)/lambda).toFixed(2)} s</p>

    <div style="margin-left: auto;">
      <div class="button-row">
        <button on:click={() => decayRef?.start()}>▶️ Iniciar</button>
        <button on:click={() => decayRef?.pause()}>⏸️ Pausar</button>
        <button on:click={() => {
          decayRef?.reset();
          simulationFinished = false;
          simulatedTime = 0;
        }}>🔄 Resetar</button>
      </div>
    </div>
  </section>

  <section class="graph-section">
    <div class="left-column">
      <div class="section-header">
        <h2>Gráfico de N(t)</h2>
      </div>
      <DecayGraph {n0} {lambda} currentTime={simulatedTime} />

      <div class="section-header">
        <h2>Histograma de decaimento</h2>
      </div>
      <DecayHistogram {lifetimes} currentTime={simulatedTime} {n0} />
    </div>

    <div class="right-column">
      <div class="section-header">
        <h2>Decaimento de partículas</h2>
        <p>{simulatedTime.toFixed(1)} segundos</p>
      </div>

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
        <p style="color: darkred; font-weight: bold; margin-top: 0.5rem;">
          ⚠️ A simulação foi finalizada. Todas as partículas decaíram ou o tempo máximo foi atingido.
        </p>
      {/if}
    </div>
  </section>

  <section class="formula-section">
    <FormulaBox />
  </section>
</div>
