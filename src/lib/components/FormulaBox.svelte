<script>
  import { onMount } from 'svelte';

  let mathRendered = false;

  const latex = `
    <p>The function of the number of particles over time is given by:<br />
\\( N(t) = N_0 e^{-\\lambda t} \\)</p>
<p>The half-life is the time required for half of the particles to decay:<br />
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
  <h3>Radioactive Decay Formulas</h3>
  {@html latex}
</div>