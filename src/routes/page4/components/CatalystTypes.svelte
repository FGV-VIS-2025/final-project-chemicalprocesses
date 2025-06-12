<script>
  let activeCatalyst = 'enzyme';
</script>

<section class="catalyst-types">
  <h2>Types of Catalysts</h2>
  <div class="tabs">
    <button 
      class:active={activeCatalyst === 'homogeneous'} 
      on:click={() => activeCatalyst = 'homogeneous'}
    >
      Homogeneous
    </button>
    <button 
      class:active={activeCatalyst === 'heterogeneous'} 
      on:click={() => activeCatalyst = 'heterogeneous'}
    >
      Heterogeneous
    </button>
    <button 
      class:active={activeCatalyst === 'enzyme'} 
      on:click={() => activeCatalyst = 'enzyme'}
    >
      Enzymes
    </button>
  </div>

  <div class="tab-content">
    {#if activeCatalyst === 'homogeneous'}
      <div>
        <h3>Homogeneous Catalysts</h3>
        <p>
          Homogeneous catalysts exist in the same phase (usually liquid) as the reactants. They often work by 
          forming intermediate complexes with reactants. Examples include:
        </p>
        <ul>
          <li>Acid-base catalysts in esterification reactions</li>
          <li>Transition metal complexes in hydrogenation</li>
          <li>Enzymes in biological systems (though these are often classified separately)</li>
        </ul>
      </div>
    {:else if activeCatalyst === 'heterogeneous'}
      <div>
        <h3>Heterogeneous Catalysts</h3>
        <p>
          Heterogeneous catalysts are in a different phase than the reactants, typically solids interacting with 
          gases or liquids. They are widely used in industrial processes:
        </p>
        <ul>
          <li>Platinum in catalytic converters for automobiles</li>
          <li>Iron in the Haber process for ammonia synthesis</li>
          <li>Zeolites in petroleum cracking</li>
        </ul>
      </div>
    {:else}
      <div>
        <h3>Enzymes - Biological Catalysts</h3>
        <p>
          Enzymes are protein molecules that catalyze biochemical reactions with incredible specificity and efficiency. 
          Key features include:
        </p>
        <ul>
          <li>Active sites precisely shaped for their substrates</li>
          <li>Optimal activity within narrow pH and temperature ranges</li>
          <li>Regulation through inhibitors and activators</li>
          <li>Examples: Amylase (digests starch), DNA polymerase (replicates DNA)</li>
        </ul>
      </div>
    {/if}
  </div>
</section>