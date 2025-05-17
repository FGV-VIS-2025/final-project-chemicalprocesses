<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let n0 = 1000;
  export let lambda = 0.1;

  let svgEl;

  onMount(() => {
    drawGraph(n0, lambda);
  });

  $: drawGraph(n0, lambda);

  function drawGraph(n0, lambda) {
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const x = d3.scaleLinear()
      .domain([0, 50])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, n0])
      .range([height - margin.bottom, margin.top]);

    const data = d3.range(0, 50.1, 0.5).map(t => ({
      t,
      N: n0 * Math.exp(-lambda * t)
    }));

    const line = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.t))
      .y(d => y(d.N));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'green')
      .attr('stroke-width', 2.5)
      .attr('d', line(data));

    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));
  }
</script>

<svg bind:this={svgEl} width="600" height="300" style="border: 2px solid red;" />
