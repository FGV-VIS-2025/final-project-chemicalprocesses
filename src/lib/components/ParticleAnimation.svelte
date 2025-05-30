<script>
  import { onMount, onDestroy } from 'svelte';
  import * as d3 from 'd3';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();


  export let Ea = 50;
  export let A = 5e13;
  export let T = 300;
  export let running = true;
  export let triggerRestart;
  export let collisionHistory = []; // Série temporal de colisões

  let svgElement;
  let animationFrameId = null;
  let width = 400;
  let height = 300;
  let particles = [];
  let lastUpdateTime = null;
  const radius = 5;

  let collisionCount = 0;
  let lastSampleCollisionCount = 0;
  let currentCollisionFrame = 0;
  let startTime = null;
  const samplingInterval = 0.1;

  let lastParams = { Ea: null, A: null, T: null };

  function initializeParticles() {
    particles = d3.range(100).map(() => ({
      x: Math.random() * (width - 2 * radius) + radius,
      y: Math.random() * (height - 2 * radius) + radius,
      reacted: false
    }));

    collisionCount = 0;
    lastSampleCollisionCount = 0;
    currentCollisionFrame = 0;
    startTime = null;
    collisionHistory.length = 0;
  }

  function draw() {
    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);
  }

  function handleCollisions() {
    let count = 0;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 2 * radius) {
          count++;

          const overlap = 2 * radius - dist;
          const adjustX = (overlap / 2) * (dx / dist);
          const adjustY = (overlap / 2) * (dy / dist);
          p1.x -= adjustX;
          p1.y -= adjustY;
          p2.x += adjustX;
          p2.y += adjustY;
        }
      }
    }
    collisionCount += count;
  }

  function update(currentTime) {
    if (!running || !svgElement) return;
    if (!lastUpdateTime) lastUpdateTime = currentTime;

    const dt = (currentTime - lastUpdateTime) / 1000;
    lastUpdateTime = currentTime;

    const k = Math.min(A * Math.exp(-Ea * 1000 / (8.314 * T)), 1);
    const slowFactor = 0.05;
    const reactionProbability = 1 - Math.exp(-Math.min(k * dt * slowFactor, 1));
    const sigma = 0.1 * Math.sqrt(T);

    for (let p of particles) {
      const dx = d3.randomNormal(0, sigma)();
      const dy = d3.randomNormal(0, sigma)();
      p.x = Math.max(radius, Math.min(width - radius, p.x + dx));
      p.y = Math.max(radius, Math.min(height - radius, p.y + dy));

      if (!p.reacted && Math.random() < reactionProbability) {
        p.reacted = true;
      }
    }

    handleCollisions();

    if (!startTime) startTime = currentTime;
    const elapsedTime = (currentTime - startTime) / 1000;

    // Limita o envio de dados para o gráfico, mas mantém a animação
    if (elapsedTime <= 30 && elapsedTime >= currentCollisionFrame * samplingInterval) {
      const newCollisions = collisionCount - lastSampleCollisionCount;
      dispatch("collisionUpdate", {
        time: +elapsedTime.toFixed(1),
        count: newCollisions
      });
      lastSampleCollisionCount = collisionCount;
      currentCollisionFrame++;
    }

    d3.select(svgElement).selectAll("circle")
      .data(particles)
      .join("circle")
      .attr("r", radius)
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

  $: if (svgElement && (Ea !== lastParams.Ea || A !== lastParams.A || T !== lastParams.T)) {
    lastParams = { Ea, A, T };
    restartAnimation();
  }

  $: if (svgElement && triggerRestart !== undefined) {
    restartAnimation();
  }

  $: if (svgElement) {
    if (running) {
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(update);
      }
    } else {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }
  }
</script>

<svg bind:this={svgElement}></svg>

<style>
  svg {
    border: 1px solid #ccc;
    background: white;
  }
</style>
