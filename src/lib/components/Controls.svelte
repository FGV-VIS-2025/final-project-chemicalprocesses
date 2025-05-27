<script>
  export let n0;
  export let lambda;

  export let setN0;
  export let setLambda;

  $: halfLife = (Math.log(2) / lambda).toFixed(2);
</script>

<div>
  <label>N₀:
    <input type="number" min="10" max="10000" bind:value={n0} on:input={(e) => setN0(+e.target.value)} />
  </label>

  <label>λ:
    <input type="range" min="0.01" max="1" step="0.01" bind:value={lambda} on:input={(e) => setLambda(+e.target.value)} />
    <span>{lambda}</span>
  </label>

  <p>Meia-vida (T₁/₂): {halfLife}</p>
</div>