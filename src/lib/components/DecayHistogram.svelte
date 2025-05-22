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
    const margin = { top: 20, right: 20, bottom: 30, left: 60 };

    const numBins = 30;
    const maxTime = d3.max(lifetimes) || 1;
    const maxPerBin = Math.ceil(n0/5);
    const filtered = lifetimes.filter(d => d <= currentTime);

    const x = d3.scaleLinear()
      .domain([0, maxTime])
      .range([margin.left, width - margin.right]);

    const binGenerator = d3.bin()
      .domain([0, maxTime])
      .thresholds(numBins);

    const bins = binGenerator(filtered);

    const y = d3.scaleLinear()
      .domain([0, maxPerBin])
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

<svg bind:this={svgEl} width="600" height="300" style="border: 2px solid red;" />
