<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let n0 = 1000;
  export let lambda = 0.2;

  let svgEl;

  $: drawHistogram();

  function drawHistogram() {
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const lifetimes = d3.range(n0).map(() => -Math.log(Math.random()) / lambda);

    const x = d3.scaleLinear()
      .domain([0, d3.max(lifetimes)])
      .range([margin.left, width - margin.right]);

    const bins = d3.bin().thresholds(30)(lifetimes);
    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const bar = svg.selectAll('g')
      .data(bins)
      .join('g')
      .attr('transform', d => `translate(${x(d.x0)},${y(d.length)})`);

    bar.append('rect')
      .attr('x', 1)
      .attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 1))
      .attr('height', d => y(0) - y(d.length))
      .attr('fill', 'steelblue');

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }
</script>

<svg bind:this={svgEl} width="400" height="300" />