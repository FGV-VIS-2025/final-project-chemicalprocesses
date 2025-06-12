import * as d3 from 'd3';

export function drawCatalystSurface(svgRef) {
  const svg = d3.select(svgRef);
  svg.selectAll("*").remove();
  
  const width = +svg.attr("width"), height = +svg.attr("height");
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  // Create catalyst surface pattern
  const surfacePattern = g.append("pattern")
    .attr("id", "surfacePattern")
    .attr("width", 20)
    .attr("height", 20)
    .attr("patternUnits", "userSpaceOnUse");

  surfacePattern.append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "#f0f0f0");

  surfacePattern.append("circle")
    .attr("cx", 10)
    .attr("cy", 10)
    .attr("r", 2)
    .attr("fill", "#888");

  // Draw catalyst surface
  g.append("rect")
    .attr("x", 0)
    .attr("y", plotHeight - 50)
    .attr("width", plotWidth)
    .attr("height", 50)
    .attr("fill", "url(#surfacePattern)");

  // Draw molecules
  const molecules = [
    { x: 50, y: 50, type: "A", color: "red" },
    { x: 150, y: 80, type: "B", color: "blue" },
    { x: 250, y: 30, type: "AB", color: "purple" },
    { x: 350, y: 70, type: "A", color: "red" },
    { x: 450, y: 40, type: "B", color: "blue" }
  ];

  molecules.forEach(mol => {
    // Draw molecule
    g.append("circle")
      .attr("cx", mol.x)
      .attr("cy", mol.y)
      .attr("r", 15)
      .attr("fill", mol.color)
      .attr("opacity", 0.7);

    g.append("text")
      .attr("x", mol.x)
      .attr("y", mol.y)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .text(mol.type)
      .attr("fill", "white");

    // Draw path to surface if AB (product)
    if (mol.type === "AB") {
      g.append("line")
        .attr("x1", mol.x)
        .attr("y1", mol.y + 15)
        .attr("x2", mol.x)
        .attr("y2", plotHeight - 50)
        .attr("stroke", "gray")
        .attr("stroke-dasharray", "3,3");
    }
  });

  // Draw active sites
  const activeSites = [100, 200, 300, 400];
  activeSites.forEach(xPos => {
    g.append("circle")
      .attr("cx", xPos)
      .attr("cy", plotHeight - 50)
      .attr("r", 8)
      .attr("fill", "gold");

    // Show reaction at one site
    if (xPos === 200) {
      g.append("path")
        .attr("d", `M${xPos-10},${plotHeight-70} Q${xPos},${plotHeight-90} ${xPos+10},${plotHeight-70}`)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2);

      g.append("text")
        .attr("x", xPos)
        .attr("y", plotHeight - 100)
        .attr("text-anchor", "middle")
        .text("A + B → AB")
        .style("font-size", "12px");
    }
  });

  // Labels
  g.append("text")
    .attr("x", plotWidth / 2)
    .attr("y", -5)
    .attr("text-anchor", "middle")
    .text("Catalyst Surface with Active Sites");
}