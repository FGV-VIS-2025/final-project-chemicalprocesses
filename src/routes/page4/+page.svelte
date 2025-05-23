<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  onMount(() => {
    const svg = d3.select("#catalystChart");
    const width = +svg.attr("width"), height = +svg.attr("height");

    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const data = [
      { x: 0, y: 0 },
      { x: 1, y: 50 },
      { x: 2, y: 20 },
      { x: 3, y: 70 },
      { x: 4, y: 10 }
    ];

    const catalystData = data.map(d => ({ x: d.x, y: d.y * 0.6 }));

    const x = d3.scaleLinear().domain([0, 4]).range([0, plotWidth]);
    const y = d3.scaleLinear().domain([0, 100]).range([plotHeight, 0]);

    g.append("g").attr("transform", `translate(0,${plotHeight})`).call(d3.axisBottom(x).ticks(5));
    g.append("g").call(d3.axisLeft(y));

    const line = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 3)
      .attr("d", line);

    g.append("path")
      .datum(catalystData)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 3)
      .attr("d", line);

    g.append("text")
      .attr("x", plotWidth / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Energy profile with and without catalyst");
  });
</script>

<svelte:head>
  <title>Page 4 - Catalyst Effect</title>
</svelte:head>

<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/page0">Introduction</a></li>
    <li><a href="/page1">Reaction Orders</a></li>
    <li><a href="/page2">Activation Energy</a></li>
    <li><a href="/page3">Reaction Mechanism</a></li>
    <li><a href="/page4">Catalyst Effect</a></li>
    <li><a href="/page5">Radioactivity</a></li>
  </ul>
</nav>

<main class="page" id="page4">
  <h2>Catalyst Effect</h2>
  <p>This visualization compares energy profiles with and without a catalyst.</p>
  <svg id="catalystChart" width="800" height="400"></svg>
</main>

<style>
  .page {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
</style>