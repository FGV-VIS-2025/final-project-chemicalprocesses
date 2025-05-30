<script>
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';

  export let collisionHistory = [];

  let svg;
  const width = 500;
  const height = 200;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  function drawChart() {
    if (!svg || collisionHistory.length === 0) return;

    svg.innerHTML = ''; // <-- garante que o gráfico anterior seja apagado

    const svgEl = d3.select(svg);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
      .domain(d3.extent(collisionHistory, d => d.time) || [0, 1])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(collisionHistory, d => d.count) || 1])
      .range([innerHeight, 0]);

    const g = svgEl.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5));

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5));

    const line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.count));

    g.append('path')
      .datum(collisionHistory)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
  }

  afterUpdate(drawChart);
  onMount(drawChart);
</script>

<svg bind:this={svg} width={width} height={height}></svg>

<style>
  svg {
    border: 1px solid #ccc;
    background-color: #fafafa;
  }
</style>
