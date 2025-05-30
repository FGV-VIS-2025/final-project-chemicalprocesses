<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  onMount(() => {
    const svg = d3.select("#mechanismGraph");
    const width = +svg.attr("width"), height = +svg.attr("height");
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const energyProfile = [
      { step: 0, energy: 0 },
      { step: 1, energy: 50 },
      { step: 2, energy: 20 },
      { step: 3, energy: 70 },
      { step: 4, energy: 10 }
    ];

    const x = d3.scaleLinear().domain([0, 4]).range([0, plotWidth]);
    const y = d3.scaleLinear().domain([0, 100]).range([plotHeight, 0]);

    g.append("g").attr("transform", `translate(0,${plotHeight})`).call(d3.axisBottom(x).ticks(5));
    g.append("g").call(d3.axisLeft(y));

    const line = d3.line()
      .x(d => x(d.step))
      .y(d => y(d.energy))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(energyProfile)
      .attr("fill", "none")
      .attr("stroke", "crimson")
      .attr("stroke-width", 3)
      .attr("d", line);

    g.selectAll("circle")
      .data(energyProfile)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.step))
      .attr("cy", d => y(d.energy))
      .attr("r", 5)
      .attr("fill", "steelblue");

    g.append("text")
      .attr("x", plotWidth / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Energy profile of a multistep reaction");
  });
</script>

<svelte:head>
  <title>Page 3 - Reaction Mechanism</title>
</svelte:head>

<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/page0">Introduction</a></li>
    <li><a href="/page1">Reaction Orders</a></li>
    <li><a href="/page2">Activation Energy</a></li>
    <li><a href="/page3">Simulation</a></li>
    <li><a href="/page4">Catalyst Effect</a></li>
    <li><a href="/page5">Radioactivity</a></li>
  </ul>
</nav>

<main class="page" id="page3">
  <h2>Simulation</h2>
  <p>This graph represents a hypothetical energy diagram for a multi-step reaction mechanism with intermediates.</p>
  <svg id="simulationGraph" width="800" height="400"></svg>
</main>

<style>
  .page {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
</style>
