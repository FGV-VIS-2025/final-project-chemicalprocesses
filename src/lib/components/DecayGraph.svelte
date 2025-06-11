<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let n0 = 1000;
  export let lambda = 0.1;
  export let currentTime = 0;

  let svgEl;
  const tMax = 120;

  const width = 450;
  const height = 250;
  const margin = { top: 10, right: 50, bottom: 30, left: 40 };

  const xScale = d3.scaleLinear().domain([0, tMax]).range([margin.left, width - margin.right]);
  $: yScale = d3.scaleLinear().domain([0, n0]).range([height - margin.bottom, margin.top]);

  $: fullData = d3.range(0, tMax + 0.1, 0.5).map(t => ({
    t,
    N: n0 * Math.exp(-lambda * t)
  }));


  onMount(() => {
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    // Eixos
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Linhas
    svg.append('path')
      .attr('class', 'past-line')
      .attr('fill', 'none')
      .attr('stroke', '#8B0000')
      .attr('stroke-width', 2);

    svg.append('path')
      .attr('class', 'future-line')
      .attr('fill', 'none')
      .attr('stroke', '#4169E1')
      .attr('stroke-width', 2);

    // Ponto animado
    svg.append('circle')
      .attr('class', 'moving-point')
      .attr('r', 5)
      .attr('fill', '#8B0000')
      .attr('stroke', 'black');

    // Tooltip flutuante (inicialmente oculta)
    svg.append('foreignObject')
      .attr('class', 'tooltip-fo')
      .attr('width', 120)
      .attr('height', 40)
      .style('pointer-events', 'none')
      .style('display', 'none')
      .append('xhtml:div')
      .style('background', 'white')
      .style('border', '1px solid black')
      .style('border-radius', '4px')
      .style('padding', '4px')
      .style('font', '12px sans-serif')
      .style('color', 'black')
      .html('');

    svg.select('.moving-point')
      .on('mouseover', () => {
        svg.select('.tooltip-fo').style('display', 'block');
      })
      .on('mouseout', () => {
        svg.select('.tooltip-fo').style('display', 'none');
      });
  });

  $: if (svgEl && n0 > 0 && lambda > 0) {
    const svg = d3.select(svgEl);

    const clampedTime = Math.min(currentTime, tMax);
    const currentPoint = {
      t: clampedTime,
      N: n0 * Math.exp(-lambda * clampedTime)
    };

    const past = fullData.filter(d => d.t <= clampedTime);
    const future = fullData.filter(d => d.t >= clampedTime);

    const lineGen = d3.line()
      .x(d => xScale(d.t))
      .y(d => yScale(d.N));

    svg.select('.past-line')
      .datum(past)
      .attr('d', lineGen);

    svg.select('.future-line')
      .datum(future)
      .attr('d', lineGen);

    svg.select('.moving-point')
      .attr('cx', xScale(currentPoint.t))
      .attr('cy', yScale(currentPoint.N));

    svg.select('.tooltip-fo')
      .attr('x', xScale(currentPoint.t) - 60)
      .attr('y', yScale(currentPoint.N) - 50)
      .select('div')
      .html(`
        <strong>t:</strong> ${currentPoint.t.toFixed(1)}s<br/>
        <strong>N(t):</strong> ${currentPoint.N.toFixed(0)}
      `);
          // Eixo X - legenda
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .text('Time (s)')
      .style('font-weight', 'bold')
      .style('font-size', '11px')
      .style('fill', '#333');

    // Eixo Y - legenda
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90)`)
      .attr('x', -height / 2)
      .attr('y', 12)
      .text('Particles')
      .style('font-weight', 'bold')
      .style('font-size', '11px')
      .style('fill', '#333');

  }
</script>

<svg bind:this={svgEl} width={width} height={height} style="border: 2px solid black; background-color: #eeeeee;" />

<!-- Legenda -->
<div style="font-size: 0.85rem; margin-top: 0.4rem; font-weight: bold;">
  <p>
    <span style="color: #4169E1;">━</span> Remaining particles &nbsp;&nbsp;
    <span style="color: #8B0000;">━</span> Particles already decayed &nbsp;&nbsp;
    <span style="display: inline-block; width: 10px; height: 10px; background: #8B0000; border-radius: 50%;"></span> Time
  </p>
</div>
