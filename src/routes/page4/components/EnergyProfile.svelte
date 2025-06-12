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
  <svg id="energyProfile" width="800" height="400" bind:this={svgRef}></svg>
  <div class="explanation">
    <p>
      This diagram compares the energy profiles of a reaction with (blue) and without (red) a catalyst. 
      The catalyst provides an alternative pathway with a significantly lower activation energy (ΔEa), 
      while the overall energy change (ΔH) remains the same.
    </p>
  </div>
</section>