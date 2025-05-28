<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let Ea = 50;
  export let A = 5e13;
  export let T = 300;

  let svgElement;
  let animationFrameId;

  const width = 400;
  const height = 300;
  let particles = [];

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

  function update() {
    const svg = d3.select(svgElement);

    svg.selectAll("circle")
      .data(particles)
      .join("circle")
      .attr("r", 5)
      .attr("fill", d => d.reacted ? "orange" : "blue")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    const sigma = Math.sqrt(T / 300) * 1.5;
    const randX = d3.randomNormal(0, sigma);
    const randY = d3.randomNormal(0, sigma);
    const rate = 0.01 * A * Math.exp(-Ea * 1000 / (8.314 * T));

    for (let p of particles) {
      p.x += randX();
      p.y += randY();

      if (p.x < 0) p.x = 0;
      if (p.x > width) p.x = width;
      if (p.y < 0) p.y = 0;
      if (p.y > height) p.y = height;

      if (!p.reacted && Math.random() < rate) {
        p.reacted = true;
      }
    }

    animationFrameId = requestAnimationFrame(update);
  }

  function restartAnimation() {
    cancelAnimationFrame(animationFrameId);
    initializeParticles();
    draw();
    update();
  }

  $: restartAnimation(); // Reage a mudanças de A, Ea, T

  onMount(() => {
    restartAnimation();
  });
</script>

<svg bind:this={svgElement}></svg>

<style>
  svg {
    border: 1px solid #ccc;
    background: white;
  }
</style>
