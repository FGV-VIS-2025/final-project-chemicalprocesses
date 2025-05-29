<script>
  import { onMount, onDestroy } from 'svelte';
  import * as d3 from 'd3';

  export let Ea = 50;
  export let A = 5e13;
  export let T = 300;
  export let running = true;
  export let triggerRestart; // muda quando quiser reiniciar

  let svgElement;
  let animationFrameId = null;
  let width = 400;
  let height = 300;
  let particles = [];
  let lastUpdateTime = null;

  let lastParams = { Ea: null, A: null, T: null };

  function initializeParticles() {
    particles = d3.range(100).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      reacted: false
    }));
  }

  function draw() {
    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);
  }

  function update(currentTime) {
    if (!running || !svgElement) return;
    if (!lastUpdateTime) lastUpdateTime = currentTime;

    const dt = (currentTime - lastUpdateTime) / 1000;
    lastUpdateTime = currentTime;

    const k = Math.min(A * Math.exp(-Ea * 1000 / (8.314 * T)), 1);
    const slowFactor = 0.05;
    const reactionProbability = 1 - Math.exp(-Math.min(k * dt * slowFactor, 1));
    const sigma = 1.5;

    for (let p of particles) {
      const dx = d3.randomNormal(0, sigma)();
      const dy = d3.randomNormal(0, sigma)();
      p.x = Math.max(0, Math.min(width, p.x + dx));
      p.y = Math.max(0, Math.min(height, p.y + dy));
      if (!p.reacted && Math.random() < reactionProbability) {
        p.reacted = true;
      }
    }

    d3.select(svgElement).selectAll("circle")
      .data(particles)
      .join("circle")
      .attr("r", 5)
      .attr("fill", d => d.reacted ? "orange" : "blue")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    animationFrameId = requestAnimationFrame(update);
  }

  function restartAnimation() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    initializeParticles();
    draw();
    lastUpdateTime = null;
    if (running) {
      animationFrameId = requestAnimationFrame(update);
    }
  }

  onMount(() => {
    restartAnimation();
  });

  onDestroy(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });

  // Se parâmetros principais mudarem
  $: if (svgElement && (Ea !== lastParams.Ea || A !== lastParams.A || T !== lastParams.T)) {
    lastParams = { Ea, A, T };
    restartAnimation();
  }

  // Se triggerRestart mudar
  $: if (svgElement && triggerRestart !== undefined) {
    restartAnimation();
  }

  // Se running mudar
  $: if (running && svgElement) {
    animationFrameId = requestAnimationFrame(update);
  }
</script>

<svg bind:this={svgElement}></svg>

<style>
  svg {
    border: 1px solid #ccc;
    background: white;
  }
</style>
