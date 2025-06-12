<script>
  import { onMount } from 'svelte';
  import { drawReactionRateChart } from '../utils/drawReactionRateChart';

  export let showExplanation;
  let svgRef;
  
  onMount(() => {
    drawReactionRateChart(svgRef, () => {
      showExplanation = !showExplanation;
    });
  });
</script>

<section class="visualization">
  <h2>3. Examples of catalysis</h2>
  <svg id="reactionRateChart" width="800" height="800" bind:this={svgRef}></svg>
  
  {#if showExplanation}
    <div class="explanation">
      <h3>How Catalysts Increase Reaction Rate</h3>
      <p>
        Catalysts increase reaction rates through several mechanisms:
      </p>
      <ul>
        <li><strong>Lowering Activation Energy:</strong> As shown in the first visualization, catalysts provide an alternative pathway with lower Ea</li>
        <li><strong>Increasing Effective Collisions:</strong> By orienting molecules properly on active sites</li>
        <li><strong>Stabilizing Transition States:</strong> The catalyst may stabilize the transition state complex</li>
      </ul>
      <p>
        The blue curve shows how the reaction proceeds faster with a catalyst, reaching equilibrium more quickly. 
        The exact rate enhancement depends on the catalyst type and reaction conditions.
      </p>
    </div>
  {/if}
</section>