<script>
  import { onMount } from 'svelte';
  import { drawCatalystSurface } from '../utils/drawCatalystSurface';

  let svgRef;
  
  onMount(() => {
    drawCatalystSurface(svgRef);
  });
</script>

<section class="visualization">
  <h2>2. Catalyst Surface Mechanism</h2>
  <svg id="catalystSurface" width="800" height="400" bind:this={svgRef}></svg>
  <div class="explanation">
    <p>
      Heterogeneous catalysts provide a surface with active sites where reactant molecules can adsorb, 
      react, and then desorb as products. The gold circles represent active sites on the catalyst surface 
      where the reaction A + B → AB occurs more easily than in the gas phase.
    </p>
  </div>
</section>