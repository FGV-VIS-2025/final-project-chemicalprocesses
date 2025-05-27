<script>
  import { onMount } from 'svelte';

  let mathRendered = false;

  const latex = `
    <p>A função do número de partículas ao longo do tempo é dada por:<br />
    \\( N(t) = N_0 e^{-\\lambda t} \\)</p>
    <p>A meia-vida é o tempo necessário para que metade das partículas decaia:<br />
    \\( T_{1/2} = \\dfrac{\\ln 2}{\\lambda} \\)</p>
  `;

  onMount(() => {
    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  });
</script>

<svelte:head>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</svelte:head>

<div>
  <h3>Fórmulas do Decaimento Radioativo</h3>
  {@html latex}
</div>