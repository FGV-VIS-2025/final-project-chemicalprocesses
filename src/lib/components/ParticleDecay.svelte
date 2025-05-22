<script>
  import { onMount, createEventDispatcher } from 'svelte';

  export let n0 = 100;
  export let lambda = 0.1;
  const dispatch = createEventDispatcher();

  let particles = [];
  let t = 0;
  let interval;

  function generateParticles() {
    t = 0;
    particles = Array.from({ length: n0 }, () => {
      const decayTime = -Math.log(Math.random()) / lambda;
      return { decayTime, active: true };
    });

    dispatch("generated", {
      lifetimes: particles.map(p => p.decayTime)
    });
  }

  function updateParticles() {
    t += 0.2;
    dispatch("tick", { t });
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

<div class="grid">
  {#each particles as p (p.decayTime)}
    <div class="dot" class:faded={!p.active}></div>
  {/each}
</div>