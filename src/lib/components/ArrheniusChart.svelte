<script>
  import * as d3 from 'd3';

  export let Ea = 50;
  export let A = 5e13;
  export let T = 300;
  export let showMarker = true;

  let svgElement;
  let g;
  let x, y;
  let xMode = "invT";

  function toggleXMode() {
    xMode = xMode === "invT" ? "T" : "invT";
    drawChart();
  }

  $: if (Ea && A && T && svgElement && showMarker !== undefined) drawChart();

  function drawChart() {
    const width = 600;
    const height = 400;
    const margin = { top: 60, right: 40, bottom: 60, left: 80 };
    const R = 8.314;

    const svg = d3.select(svgElement)
      .attr("viewBox", [0, 0, width, height]);

    if (!g) {
      g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      x = d3.scaleLinear().range([0, width - margin.left - margin.right]);
      y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`);

      g.append("g")
        .attr("class", "y-axis");
    }

    const temperatures = d3.range(200, 500, 5);
    const k_values = temperatures.map(temp => ({
      T: temp,
      invT: 1 / temp,
      k: A * Math.exp(-Ea * 1000 / (R * temp))
    }));

    k_values.sort((a, b) => (xMode === "invT" ? a.invT - b.invT : a.T - b.T));

    x.domain(d3.extent(k_values, d => xMode === "invT" ? d.invT : d.T));
    y.domain([0, d3.max(k_values, d => d.k)]).nice();

    g.select(".x-axis")
      .call(d3.axisBottom(x).ticks(8))
      .selectAll("text")
      .attr("font-size", "12px");

    g.select(".y-axis")
      .call(d3.axisLeft(y).ticks(6).tickFormat(d3.format(".1e")))
      .selectAll("text")
      .attr("font-size", "12px");

    g.selectAll(".x-label, .y-label").remove();

    g.append("text")
      .attr("class", "x-label")
      .attr("x", (width - margin.left - margin.right) / 2)
      .attr("y", height - margin.top - margin.bottom + 45)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text(xMode === "invT" ? "1 / Temperature [1/K]" : "Temperature [K]");

    g.append("text")
      .attr("class", "y-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -((height - margin.top - margin.bottom) / 2))
      .attr("y", -55)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("Rate Constant k [s⁻¹]");

    const line = d3.line()
      .x(d => x(xMode === "invT" ? d.invT : d.T))
      .y(d => y(d.k));

    const path = g.selectAll(".arrhenius-line")
      .data([k_values]);

    path.join("path")
      .attr("class", "arrhenius-line")
      .transition()
      .duration(500)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);

    // ❌ Limpa tooltips e marcadores antigos
    g.selectAll(".overlay, .tooltip-group, .marker, .marker-line").remove();

    // ✅ Marcador se showMarker ativo
    if (showMarker) {
      const markerData = k_values.reduce((prev, curr) =>
        Math.abs(curr.T - T) < Math.abs(prev.T - T) ? curr : prev
      );

      const xVal = xMode === "invT" ? markerData.invT : markerData.T;
      const xCoord = x(xVal);
      const yCoord = y(markerData.k);

      g.append("line")
        .attr("class", "marker-line")
        .attr("x1", xCoord)
        .attr("x2", xCoord)
        .attr("y1", yCoord)
        .attr("y2", y(0))
        .attr("stroke", "darkred")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4,2");

      g.append("circle")
        .attr("class", "marker")
        .attr("cx", xCoord)
        .attr("cy", yCoord)
        .attr("r", 5)
        .attr("fill", "darkred")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5);
    }

    // 🔴 Tooltip por hover
    const tooltip = g.append("g")
      .attr("class", "tooltip-group")
      .style("display", "none");

    tooltip.append("circle")
      .attr("r", 4)
      .attr("fill", "red");

    tooltip.append("rect")
      .attr("x", -70)
      .attr("y", -60)
      .attr("width", 210)
      .attr("height", 40)
      .attr("fill", "#fff")
      .attr("stroke", "#333")
      .attr("opacity", 0.8);

    const tooltipText = tooltip.append("text")
      .attr("x", -65)
      .attr("y", -40)
      .attr("font-size", "12px");

    g.append("rect")
      .attr("class", "overlay")
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", "transparent")
      .on("mouseover", () => tooltip.style("display", null))
      .on("mouseout", () => tooltip.style("display", "none"))
      .on("mousemove", function (event) {
        const [mx] = d3.pointer(event);
        const x0 = x.invert(mx);
        const values = k_values.map(d => xMode === "invT" ? d.invT : d.T);
        const index = d3.bisectCenter(values, x0);
        const d = k_values[index];
        if (!d) return;
        const T_C = (d.T - 273.15).toFixed(1);
        tooltip.attr("transform", `translate(${x(xMode === "invT" ? d.invT : d.T)},${y(d.k)})`);
        tooltipText.text(
          xMode === "invT"
            ? `1/T: ${d.invT.toFixed(4)} | T: ${T_C} °C | k: ${d.k.toExponential(2)}`
            : `T: ${d.T} K (${T_C} °C) | k: ${d.k.toExponential(2)}`
        );
      });
  }
</script>

<!-- Toggle eixo X -->
<button on:click={toggleXMode} style="margin-bottom: 10px">
  Toggle X Axis (Currently: {xMode === "invT" ? "1/T" : "T"})
</button>

<svg bind:this={svgElement} width="100%" height="400"></svg>

<style>
  svg {
    background-color: white;
    border: 1px solid #ccc;
  }
</style>
