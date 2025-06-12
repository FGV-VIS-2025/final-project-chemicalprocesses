<script>
  import { onMount } from 'svelte';
  import { drawEnergyProfile } from '../utils/drawEnergyProfile';

  let svgRef;

  onMount(() => {
    drawEnergyProfile(svgRef);
  });
</script>

<section class="visualization">
  <h2>1. Energy Profile With and Without Catalyst</h2>

  <!-- SVG para animação -->
  <svg id="energyProfile" width="800" height="400" bind:this={svgRef}></svg>

  <!-- Botão Play/Pause (abaixo do gráfico) -->
  <button id="playPauseBtn">Play</button>

  <!-- Texto explicativo -->
  <div class="explanation">
    <p>
      This diagram compares the energy profiles of a reaction with (blue) and without (red) a catalyst.
      The catalyst provides an alternative pathway with a significantly lower activation energy (ΔEa),
      while the overall energy change (ΔH) remains the same.
    </p>
  </div>
</section>

<style>
  .visualization {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  

  #playPauseBtn {
    margin-bottom: 20px;
    padding: 12px 24px;
    font-size: 18px;
    border: none;
  
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

</style>
