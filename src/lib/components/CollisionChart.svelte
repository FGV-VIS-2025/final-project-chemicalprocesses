<script>
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';

  export let history1 = [];
  export let history2 = [];

  let svg;
  const width = 500;
  const height = 200;
  const margin = { top: 20, right: 40, bottom: 40, left: 45 };

  const fixedTimeLimit = 30;
  const fixedCountLimit = 70;

  function drawChart() {
    if (!svg) return;

    svg.innerHTML = '';

    const svgEl = d3.select(svg);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
      .domain([0, fixedTimeLimit])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, fixedCountLimit])
      .range([innerHeight, 0]);

    const g = svgEl.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Eixos
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6));

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5));

    const line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.count));

    // Linha para T₁ (azul)
    g.append('path')
      .datum(history1.filter(d => d.time <= fixedTimeLimit))
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Linha para T₂ (vermelha)
    g.append('path')
      .datum(history2.filter(d => d.time <= fixedTimeLimit))
      .attr('fill', 'none')
      .attr('stroke', 'tomato')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Rótulos dos eixos
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .text('Time (s)');

    g.append('text')
      .attr('x', -innerHeight / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('fill', '#333')
      .text('Collisions');

    // Legenda
    g.append('circle')
      .attr('cx', innerWidth - 110)
      .attr('cy', -5)
      .attr('r', 5)
      .attr('fill', 'steelblue');
    g.append('text')
      .attr('x', innerWidth - 100)
      .attr('y', -2)
      .text('T₁')
      .attr('font-size', '12px')
      .attr('fill', '#333');

    g.append('circle')
      .attr('cx', innerWidth - 60)
      .attr('cy', -5)
      .attr('r', 5)
      .attr('fill', 'tomato');
    g.append('text')
      .attr('x', innerWidth - 50)
      .attr('y', -2)
      .text('T₂')
      .attr('font-size', '12px')
      .attr('fill', '#333');
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
