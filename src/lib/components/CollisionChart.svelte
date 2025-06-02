<script>
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';

  export let history1 = [];
  export let history2 = [];

  let svg;
  let container;
  const width = 600;
  const height = 250;
  const margin = { top: 20, right: 40, bottom: 40, left: 40 };

  const fixedTimeLimit = 30;
  const fixedCountLimit = 70;

  function drawChart() {
    if (!svg) return;

    svg.innerHTML = '';

    const svgEl = d3.select(svg);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().domain([0, fixedTimeLimit]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([0, fixedCountLimit]).range([innerHeight, 0]);

    const g = svgEl.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6));

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5));

    const line1 = d3.line().x(d => xScale(d.time)).y(d => yScale(d.count));
    const line2 = d3.line().x(d => xScale(d.time)).y(d => yScale(d.count));

    g.append('path')
      .datum(history1)
      .attr('fill', 'none')
      .attr('stroke', '#5dade2')
      .attr('stroke-width', 2)
      .attr('d', line1);

    g.append('path')
      .datum(history2)
      .attr('fill', 'none')
      .attr('stroke', '#e74c3c')
      .attr('stroke-width', 2)
      .attr('d', line2);

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 35)
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

    const tooltip = d3.select(container)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('background', 'rgba(0,0,0,0.85)')
      .style('color', 'white')
      .style('padding', '6px 8px')
      .style('border-radius', '4px')
      .style('font-size', '13px')
      .style('display', 'none');

    const pointMarker = g.append('circle')
      .attr('r', 5)
      .attr('fill', 'black')
      .style('display', 'none');

    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mousemove', function (event) {
        const [x] = d3.pointer(event);
        const time = xScale.invert(x);

        let point1 = history1.reduce((a, b) =>
          Math.abs(b.time - time) < Math.abs(a.time - time) ? b : a, history1[0]);
        let point2 = history2.reduce((a, b) =>
          Math.abs(b.time - time) < Math.abs(a.time - time) ? b : a, history2[0]);

        if (Math.abs(point1.time - time) > 0.5) point1 = null;
        if (Math.abs(point2.time - time) > 0.5) point2 = null;

        const focusPoint = point1 || point2;

        if (focusPoint) {
          pointMarker
            .attr('cx', xScale(focusPoint.time))
            .attr('cy', yScale(focusPoint.count))
            .style('display', 'block');
        } else {
          pointMarker.style('display', 'none');
        }

        let text = '';
        if (point1) text += `<div style="color:#5dade2">T₁: ${point1.count} at ${point1.time.toFixed(1)}s</div>`;
        if (point2) text += `<div style="color:#e74c3c">T₂: ${point2.count} at ${point2.time.toFixed(1)}s</div>`;

        tooltip.html(text).style('display', text ? 'block' : 'none');

        const offsetX = xScale(focusPoint?.time);
        const offsetY = yScale(focusPoint?.count);

        tooltip
          .style('left', `${offsetX + margin.left - 30}px`)
          .style('top', `${offsetY + margin.top - 40}px`);
      })
      .on('mouseleave', () => {
        tooltip.style('display', 'none');
        pointMarker.style('display', 'none');
      });
  }

  onMount(drawChart);
  afterUpdate(drawChart);
</script>

<div bind:this={container} class="chart-wrapper">
  <svg bind:this={svg} width={width} height={height}></svg>
</div>

<style>
  .chart-wrapper {
    position: relative;
  }

  svg {
    border: 1px solid #ccc;
    background-color: #fafafa;
  }

  .tooltip {
    z-index: 10;
  }
</style>
