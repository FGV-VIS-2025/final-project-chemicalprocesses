<script>
  import { onMount, createEventDispatcher } from 'svelte';

  export let n0 = 100;
  export let lambda = 0.1;

  let particles = [];
  let t = 0;
  let interval = null;
  let finished = false;

  const dispatch = createEventDispatcher();

  const particlesPerRow = 40;
  const spacing = 10;
  const radius = 4;
  const padding = radius;

  $: svgWidth = particlesPerRow * spacing + padding * 2;
  $: svgHeight = Math.ceil(n0 / particlesPerRow) * spacing + padding * 2;

  function generateParticles() {
    t = 0;
    finished = false;
    particles = Array.from({ length: n0 }, () => ({
      decayTime: -Math.log(Math.random()) / lambda,
      active: true
    }));
    dispatch('generated', { lifetimes: particles.map(p => p.decayTime) });
  }

  function updateParticles() {
    t += 0.2;

    particles = particles.map(p => ({
      ...p,
      active: p.decayTime > t
    }));

    dispatch('tick', { t });

    const allDecayed = particles.every(p => !p.active);

    if (allDecayed || t >= 120) {
      pause();
      finished = true;
      dispatch('finished'); // evento que o +page captura
    }
  }

  export function start() {
    if (!interval) {
      interval = setInterval(updateParticles, 200);
    }
  }

  export function pause() {
    clearInterval(interval);
    interval = null;
  }

  export function reset() {
    pause();
    finished = false;
    generateParticles();
  }

  onMount(() => {
    generateParticles();
    return () => pause();
  });

  $: if (n0 && lambda) generateParticles();
</script>

<svg
  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
  style="width: 100%; height: auto; max-width: 100%; background-color: #424242;"
  preserveAspectRatio="xMidYMin meet"
>
  {#each particles as p, i (p.decayTime)}
    <circle
      cx={padding + (i % particlesPerRow) * spacing}
      cy={padding + Math.floor(i / particlesPerRow) * spacing}
      r={radius}
      fill={p.active ? "darkgreen" : "lightgreen"}
      opacity={p.active ? 1 : 0.3}
    >
      <title>Decay in: {p.decayTime.toFixed(1)}s</title>
    </circle>
  {/each}
</svg>
<!-- Legenda -->
<div style="font-size: 0.85rem; margin-top: 0.4rem; font-weight: bold;">
  <p>
    <span style="display: inline-block; width: 12px; height: 12px; background: darkgreen; border-radius: 50%;"></span>
    &nbsp; Active particle
    &nbsp;&nbsp;
    <span style="display: inline-block; width: 12px; height: 12px; background: lightgreen; border-radius: 50%; opacity: 0.3;"></span>
    &nbsp; Decayed particle
  </p>
</div>