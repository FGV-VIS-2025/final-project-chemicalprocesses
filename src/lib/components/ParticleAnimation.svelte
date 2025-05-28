<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let Ea = 50;
  export let A = 5e13;
  export let T = 300;

  let svgElement;

  $: drawParticles();

  function drawParticles() {
    if (!svgElement) return;

    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 300;

    svg.attr("width", width).attr("height", height);

    const numParticles = 100;

    const particles = d3.range(numParticles).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 2 - 1,
      reacted: false
    }));

    function step() {
      svg.selectAll("circle")
        .data(particles)
        .join("circle")
        .attr("r", 5)
        .attr("fill", d => d.reacted ? "orange" : "blue")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (!p.reacted && Math.random() < 0.01 * A * Math.exp(-Ea * 1000 / (8.314 * T))) {
          p.reacted = true;
        }
      }

      requestAnimationFrame(step);
    }

    step();
  }
</script>

<svg bind:this={svgElement}></svg>
