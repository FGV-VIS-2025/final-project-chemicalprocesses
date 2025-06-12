import * as d3 from 'd3';

export function drawEnergyProfile(svgRef) {
  const svg = d3.select(svgRef);
  svg.selectAll("*").remove();

  const width = +svg.attr("width"),
        height = +svg.attr("height");
  const margin = { top: 60, right: 40, bottom: 60, left: 80 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const uncatalyzed = [
    { x: 0, y: 50, label: "Reactants" },
    { x: 1, y: 180, label: "Transition State" },
    { x: 2, y: 30, label: "Products" }
  ];

  const catalyzed = [
    { x: 0, y: 50 },
    { x: 0.4, y: 90 },
    { x: 0.6, y: 120 },
    { x: 1, y: 100 },
    { x: 1.4, y: 70 },
    { x: 1.6, y: 90 },
    { x: 2, y: 30 }
  ];

  const x = d3.scaleLinear().domain([0, 2]).range([0, plotWidth]);
  const y = d3.scaleLinear().domain([0, 200]).range([plotHeight, 0]);

  // Eixos
  g.append("g")
    .attr("transform", `translate(0,${plotHeight})`)
    .call(d3.axisBottom(x)
      .tickValues([0, 1, 2])
      .tickFormat((_, i) => ["Reactants", "Transition State", "Products"][i]))
    .selectAll("text")
    .style("font-size", "15px");

  g.append("g")
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d} kJ/mol`))
    .selectAll("text")
    .style("font-size", "15px");

  g.append("text")
    .attr("text-anchor", "middle")
    .attr("x", plotWidth / 2)
    .attr("y", plotHeight + 45)
    .text("Reaction Coordinate")
    .style("font-size", "16px");

  g.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -plotHeight / 2)
    .attr("y", -60)
    .text("Potential Energy (kJ/mol)")
    .style("font-size", "16px");

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 35)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Energy Profile: Catalyzed vs. Uncatalyzed");

  const line = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y))
    .curve(d3.curveBasis);

  // Linhas principais
  const uncatalyzedPath = g.append("path")
    .datum(uncatalyzed)
    .attr("fill", "none")
    .attr("stroke", "#e41a1c")
    .attr("stroke-width", 4)
    .attr("d", line);

  const catalyzedPath = g.append("path")
    .datum(catalyzed)
    .attr("fill", "none")
    .attr("stroke", "#377eb8")
    .attr("stroke-width", 4)
    .attr("stroke-dasharray", "5,4")
    .attr("d", line);

  // Animação das linhas
  [uncatalyzedPath, catalyzedPath].forEach((path, i) => {
    const totalLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .delay(i * 1000)
      .ease(d3.easeCubic)
      .attr("stroke-dashoffset", 0);
  });

  // ΔEa após animação
  setTimeout(() => {
    g.append("line")
      .attr("x1", x(1))
      .attr("y1", y(uncatalyzed[1].y))
      .attr("x2", x(1))
      .attr("y2", y(catalyzed[3].y))
      .attr("stroke", "#333")
      .attr("stroke-dasharray", "4,3");

    g.append("text")
      .attr("x", x(1) + 8)
      .attr("y", y((uncatalyzed[1].y + catalyzed[3].y) / 2) - 5)
      .text("ΔEa")
      .style("font-size", "15px")
      .style("font-weight", "bold");
  }, 2500);

  // Pontos e valores (evitar sobreposição)
  setTimeout(() => {
    uncatalyzed.forEach((point, i) => {
      g.append("circle")
        .attr("cx", x(point.x))
        .attr("cy", y(point.y))
        .attr("r", 5)
        .attr("fill", "#e41a1c");

      g.append("text")
        .attr("x", x(point.x) + (i === 1 ? -40 : 10))
        .attr("y", y(point.y) - 12)
        .text(`${point.y} kJ/mol`)
        .style("font-size", "13px");
    });

    const catPeak = catalyzed[3];
    g.append("circle")
      .attr("cx", x(catPeak.x))
      .attr("cy", y(catPeak.y))
      .attr("r", 5)
      .attr("fill", "#377eb8");

    g.append("text")
      .attr("x", x(catPeak.x) - 40)
      .attr("y", y(catPeak.y) - 12)
      .text(`${catPeak.y} kJ/mol`)
      .style("font-size", "13px");
  }, 2700);

  // Legenda
  const legend = svg.append("g")
    .attr("transform", `translate(${width - 180},${margin.top})`);

  legend.append("line")
    .attr("x1", 0).attr("y1", 0)
    .attr("x2", 30).attr("y2", 0)
    .attr("stroke", "#e41a1c")
    .attr("stroke-width", 4);
  legend.append("text")
    .attr("x", 35).attr("y", 5)
    .text("Uncatalyzed")
    .style("font-size", "13px");

  legend.append("line")
    .attr("x1", 0).attr("y1", 25)
    .attr("x2", 30).attr("y2", 25)
    .attr("stroke", "#377eb8")
    .attr("stroke-width", 4)
    .attr("stroke-dasharray", "5,4");
  legend.append("text")
    .attr("x", 35).attr("y", 30)
    .text("Catalyzed")
    .style("font-size", "13px");
}