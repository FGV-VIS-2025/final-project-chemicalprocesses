<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  onMount(() => {
    const styleContent = `
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f9;
        color: #333;
      }
      nav {
        background-color: #123455;
        padding: 12px 20px;
        border-radius: 0 0 10px 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      nav ul {
        display: flex;
        gap: 20px;
        list-style: none;
        margin: 0;
        padding: 0;
        justify-content: center;
      }
      nav li a {
        color: white;
        text-decoration: none;
        font-weight: bold;
        font-size: 1rem;
        transition: color 0.3s;
      }
      nav li a:hover {
        color: #ffdd57;
      }

      h1 {
        text-align: center;
        font-size: 2rem;
        margin-bottom: 1rem;
        color: #123455;
      }

      p {
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 1rem;
        text-align: justify;
      }

      svg {
        background: white;
        border-radius: 8px;
        box-shadow: 0 0 15px #ccc;
      }

      .axis-label {
        font-weight: bold;
        fill: #123455;
        font-size: 14px;
      }

      .label-reactant {
        fill: #d62728;
        font-weight: bold;
      }

      .label-product {
        fill: #1f77b4;
        font-weight: bold;
      }

      .tube-label {
        font-size: 14px;
        fill: #333;
        text-anchor: middle;
      }

      #page0 {
        padding: 30px;
        max-width: 900px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-top: 30px;
      }
    `;
    const style = document.createElement("style");
    style.textContent = styleContent;
    document.head.appendChild(style);

    // === Configurações ===
    const width = 450, height = 350, margin = { top: 40, right: 30, bottom: 40, left: 50 };
    const svg = d3.select("#container3").append("svg")
      .attr("width", width)
      .attr("height", height);

    const totalSteps = 200;
    const times = d3.range(0, totalSteps + 1);
    const concA = t => Math.exp(-t / totalSteps * 4);
    const concB = t => 1 - concA(t);

    const xScale = d3.scaleLinear().domain([0, totalSteps]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale).ticks(6).tickFormat(d => Math.round(d / 10));
    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width - margin.right)
      .attr("y", 35)
      .attr("text-anchor", "end")
      .text("Tempo");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .append("text")
      .attr("class", "axis-label")
      .attr("x", -margin.left)
      .attr("y", margin.top - 20)
      .attr("text-anchor", "start")
      .text("Concentração");

    const lineA = d3.line().x(d => xScale(d)).y(d => yScale(concA(d)));
    const lineB = d3.line().x(d => xScale(d)).y(d => yScale(concB(d)));

    svg.append("path")
      .datum(times)
      .attr("fill", "none")
      .attr("stroke", "#d62728")
      .attr("stroke-width", 3)
      .attr("d", lineA);

    svg.append("path")
      .datum(times)
      .attr("fill", "none")
      .attr("stroke", "#1f77b4")
      .attr("stroke-width", 3)
      .attr("d", lineB);

    svg.append("text")
      .attr("class", "label-reactant")
      .attr("x", xScale(8))
      .attr("y", yScale(concA(8)) - 10)
      .text("Reagente A");

    svg.append("text")
      .attr("class", "label-product")
      .attr("x", xScale(12))
      .attr("y", yScale(concB(12)) + 20)
      .text("Produto B");

        // === Tubos de Ensaio ===
    const tubeWidth = 100, tubeHeight = 250;
    const numTubes = 5;
    const maxBubbles = 50;

    const containerTubes = d3.select("#container2")
      .style("display", "flex")
      .style("gap", "30px");

    const tubesData = d3.range(numTubes).map((tubeIndex) => {
      const liquidX = tubeWidth * 0.18,
            liquidY = tubeHeight * 0.14,
            liquidWidth = tubeWidth * 0.64,
            liquidHeight = tubeHeight * 0.75;

      let bubblesA = d3.range(maxBubbles).map(() => ({
        x: liquidX + Math.random() * liquidWidth,
        y: liquidY + Math.random() * liquidHeight,
        radius: 5 + Math.random() * 3
      }));

      let bubblesB = d3.range(maxBubbles).map(() => ({
        x: liquidX + Math.random() * liquidWidth,
        y: liquidY + Math.random() * liquidHeight,
        radius: 5 + Math.random() * 3
      }));

      return {
        tubeIndex,
        bubblesA,
        bubblesB,
        liquidX, liquidY, liquidWidth, liquidHeight
      };
    });

    const tubes = containerTubes.selectAll("svg")
      .data(tubesData)
      .enter()
      .append("svg")
      .attr("width", tubeWidth)
      .attr("height", tubeHeight)
      .style("background", "white")
      .style("border-radius", "8px")
      .style("box-shadow", "0 0 15px #ccc");

    tubes.each(function(d) {
      const svgTube = d3.select(this);

      svgTube.append("rect")
        .attr("class", "tube")
        .attr("x", tubeWidth * 0.15)
        .attr("y", tubeHeight * 0.12)
        .attr("width", tubeWidth * 0.7)
        .attr("height", tubeHeight * 0.8)
        .attr("rx", 20)
        .attr("ry", 20);

      svgTube.append("rect")
        .attr("class", "cork")
        .attr("x", tubeWidth * 0.15)
        .attr("y", tubeHeight * 0.04)
        .attr("width", tubeWidth * 0.7)
        .attr("height", tubeHeight * 0.08)
        .attr("rx", 5)
        .attr("ry", 5);

      svgTube.append("rect")
        .attr("x", d.liquidX)
        .attr("y", d.liquidY)
        .attr("width", d.liquidWidth)
        .attr("height", d.liquidHeight)
        .attr("fill", "#cee7f0")
        .attr("rx", 15)
        .attr("ry", 15);

      const bubblesGroup = svgTube.append("g").attr("class", "bubbles-group");

      bubblesGroup.selectAll(".bubbleA")
        .data(d.bubblesA)
        .enter()
        .append("circle")
        .attr("class", "bubbleA")
        .attr("cx", b => b.x)
        .attr("cy", b => b.y)
        .attr("r", b => b.radius);

      bubblesGroup.selectAll(".bubbleB")
        .data(d.bubblesB)
        .enter()
        .append("circle")
        .attr("class", "bubbleB")
        .attr("cx", b => b.x)
        .attr("cy", b => b.y)
        .attr("r", b => b.radius);

      svgTube.append("text")
        .attr("class", "tube-label")
        .attr("x", tubeWidth / 2)
        .attr("y", tubeHeight * 0.95)
        .text(`Step ${d.tubeIndex}`);
    });

    // === Atualização animada ===
    const updateTube = (tubeData, t) => {
      const stepsPerTube = Math.floor(totalSteps / numTubes);
      const baseStep = tubeData.tubeIndex * stepsPerTube;
      const localStep = Math.min(Math.max(t - baseStep, 0), stepsPerTube);

      const concAVal = concA(baseStep + localStep);
      const concBVal = concB(baseStep + localStep);
      const visibleA = Math.round(concAVal * maxBubbles);
      const visibleB = Math.round(concBVal * maxBubbles);

      const svgTube = d3.select(containerTubes.selectAll("svg").nodes()[tubeData.tubeIndex]);

      svgTube.selectAll(".bubbleA")
        .attr("visibility", (d, i) => i < visibleA ? "visible" : "hidden");

      svgTube.selectAll(".bubbleB")
        .attr("visibility", (d, i) => i < visibleB ? "visible" : "hidden");

      // animação vertical suave
      tubeData.bubblesA.forEach((b, i) => {
        b.y += 0.3 * (i % 2 ? 1 : -1);
      });
      tubeData.bubblesB.forEach((b, i) => {
        b.y += 0.25 * (i % 2 ? -1 : 1);
      });

      svgTube.selectAll(".bubbleA").data(tubeData.bubblesA).attr("cy", d => d.y);
      svgTube.selectAll(".bubbleB").data(tubeData.bubblesB).attr("cy", d => d.y);
    };

    let currentStep = 0;
    d3.interval(() => {
      tubesData.forEach(tube => updateTube(tube, currentStep));
      currentStep = (currentStep + 1) % totalSteps;
    }, 100);
  });
</script>

<svelte:head>
  <title>Page 0 - Summary</title>
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

<div class="page" id="page0">
  <h1>Chemical Reaction Visualizer</h1>
  <p><strong>Chemical kinetics</strong> is the branch of chemistry that studies the speed of chemical reactions,
  how different conditions affect these rates, and what mechanisms underlie them. This tool provides a visualization of reaction progress over time.</p>

  <div id="container3" style="margin-bottom: 40px;"></div>
  <div id="container2"></div>

  <ul>
    <li><strong>First-order reactions:</strong> ...</li>
    <li><strong>Second-order reactions:</strong> ...</li>
    <li><strong>Third-order reactions:</strong> ...</li>
  </ul>

  <p>The rate constant, <code>k</code>, is unique to each reaction...</p>

  <p style="text-align: center; font-size: 1.2em;">
    <code style="font-size: 1.5em;">k = A · e<sup>−Eₐ/RT</sup></code>
  </p>

  <p>Reactions often proceed via a <strong>reaction mechanism</strong>...</p>
  <p><strong>Catalysts</strong> accelerate chemical reactions...</p>
</div>
