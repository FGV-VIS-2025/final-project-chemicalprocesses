<script>
  import { onMount } from 'svelte';

  export let n0 = 100;
  export let lambda = 0.1;
  let particles = [];

  // tempo global da simulação (em segundos)
  let t = 0;
  let interval;

  function generateParticles() {
    t = 0;
    particles = Array.from({ length: n0 }, () => ({
      decayTime: -Math.log(Math.random()) / lambda,
      active: true
    }));
  }

  function updateParticles() {
    t += 0.2;
    particles = particles.map(p => ({
      ...p,
      active: p.decayTime > t
    }));
  }

  onMount(() => {
    generateParticles();
    interval = setInterval(updateParticles, 200);
    return () => clearInterval(interval);
  });

  $: if (n0 && lambda) generateParticles();
</script>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 10px);
    gap: 2px;
    max-width: 400px;
  }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: green;
  }
  .faded {
    background: lightgray;
    opacity: 0.3;
  }
</style>

<p>Tempo simulado: {t.toFixed(1)} s</p>

<div class="grid">
  {#each particles as p (p.decayTime)}
    <div class="dot" class:faded={!p.active}></div>
  {/each}
</div>
