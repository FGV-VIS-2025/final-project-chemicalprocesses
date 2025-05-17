<script>
  import DecayGraph from '$lib/components/DecayGraph.svelte';
  import ParticleDecay from '$lib/components/ParticleDecay.svelte';
  import DecayHistogram from '$lib/components/DecayHistogram.svelte';
  import FormulaBox from '$lib/components/FormulaBox.svelte';

  let n0 = 1000;
  let lambda = 0.1;
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    gap: 1rem;
  }

  .top-row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    justify-content: space-between;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .title-align {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }

  .main-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  }

  .left, .right {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section-title {
    font-weight: bold;
    font-size: 1.1rem;
  }

  .center {
    text-align: center;
  }
</style>

<h1>Simulador de Decaimento Radioativo</h1>

<div class="container">
  <div class="top-row">
    <div class="controls">
      <label>N₀:
        <input type="number" bind:value={n0} min="1" max="1000000" />
      </label>
      <label>λ:
        <input type="range" bind:value={lambda} min="0.01" max="1" step="0.01" />
        {lambda}
      </label>
      <p>Meia-vida (T₁/₂): {(Math.log(2)/lambda).toFixed(2)}</p>
    </div>

    <div class="title-align">
      <span class="section-title">Animação do decaimento de partículas</span>
    </div>
  </div>

  <div class="main-layout">
    <div class="left">
      <div class="section-title">Gráfico de N(t)</div>
      <DecayGraph {n0} {lambda} />
    </div>

    <div class="right">
      <ParticleDecay {n0} {lambda} />
    </div>
  </div>

  <DecayHistogram {n0} {lambda} />
  <FormulaBox />
</div>
