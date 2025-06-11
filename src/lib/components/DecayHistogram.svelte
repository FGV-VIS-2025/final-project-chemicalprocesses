<script>
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';

  export let lifetimes = [];
  export let currentTime = 0;
  export let n0 = 1000;

  let svgEl;

  onMount(() => {
    drawHistogram();
  });

  afterUpdate(() => {
    if (svgEl && lifetimes.length > 0) {
      drawHistogram();
    }
  });

  function drawHistogram() {
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 160, bottom: 30, left: 40 };

    const numBins = 30;
    const maxTime = d3.max(lifetimes) || 90;

    const binGenerator = d3.bin()
      .domain([0, maxTime])
      .thresholds(numBins);

    const allBins = binGenerator(lifetimes);
    const filtered = lifetimes.filter(d => d <= currentTime);
    const bins = binGenerator(filtered);
    const maxPerBin = d3.max(allBins, d => d.length / n0) || 1;

    const x = d3.scaleLinear()
      .domain([0, maxTime])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, maxPerBin])
      .range([height - margin.bottom, margin.top]);

    svg.selectAll('g')
      .data(bins)
      .join('g')
      .attr('transform', d => `translate(${x(d.x0)},${y(d.length / n0)})`) // ✅ 1. Frequência relativa
      .append('rect')
      .attr('x', 0)
      .attr('width', d => Math.max(0, x(d.x1) - x(d.x0)))
      .attr('height', d => y(0) - y(d.length / n0)) // ✅ 2. Frequência relativa
      .attr('fill', 'steelblue')
      .append('title')
      .text(d =>
        `Interval: ${d.x0.toFixed(1)}–${d.x1.toFixed(1)}\nFrequency: ${(100 * d.length / n0).toFixed(1)}%`
      );

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d3.format(".0%"))); // formato percentual no eixo Y
        // Eixo X - legenda
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2 - 70)
      .attr('y', height - 3) // um pouco acima da borda inferior
      .text('Decay Time (s)')
      .style('font-weight', 'bold')
      .style('font-size', '11px')
      .style('fill', '#333');

    // Eixo Y - legenda
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90)`)
      .attr('x', -height / 2)
      .attr('y', 10) // um pouco à direita da borda esquerda
      .text('Frequency')
      .style('font-weight', 'bold')
      .style('font-size', '11px')
      .style('fill', '#333');
  }
</script>

<svg bind:this={svgEl} width="450" height="300" style="border: 2px solid black; background-color: #eeeeee;" />

<!-- Legenda -->
<div style="font-size: 0.85rem; margin-top: 0.4rem; font-weight: bold;">
  <p>
    <span style="display: inline-block; width: 12px; height: 12px; background: steelblue;"></span>
    &nbsp; Frequency of particles per decay time interval
  </p>
</div>
