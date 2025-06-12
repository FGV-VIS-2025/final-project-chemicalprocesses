import * as d3 from 'd3';

export function drawCatalystSurface(svgRef) {
  const svg = d3.select(svgRef);
  svg.selectAll("*").remove();

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  // Surface pattern
  const surfacePattern = svg.append("defs").append("pattern")
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

  // Catalyst surface
  g.append("rect")
    .attr("x", 0)
    .attr("y", plotHeight - 50)
    .attr("width", plotWidth)
    .attr("height", 50)
    .attr("fill", "url(#surfacePattern)");

  // Active sites
  const activeSites = [100, 200, 300, 400];
  activeSites.forEach(xPos => {
    g.append("circle")
      .attr("cx", xPos)
      .attr("cy", plotHeight - 50)
      .attr("r", 8)
      .attr("fill", "gold");
  });

  // Molecule animation loop
  function animateMolecules() {
    const molData = [
      { type: "A", color: "red" },
      { type: "B", color: "blue" },
    ];

    const startY = -30;

    function spawnMolecule(molType, delay = 0) {
      const xStart = Math.random() * (plotWidth - 60) + 30;
      const mol = g.append("g")
        .attr("transform", `translate(${xStart}, ${startY})`)
        .attr("opacity", 0);

      mol.append("circle")
        .attr("r", 15)
        .attr("fill", molType.color)
        .attr("opacity", 0.7);

      mol.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .text(molType.type)
        .attr("fill", "white");

      mol.transition()
        .delay(delay)
        .duration(4000)
        .ease(d3.easeLinear)
        .attr("opacity", 1)
        .attrTween("transform", function () {
          return function (t) {
            const y = startY + t * (plotHeight - 60);
            return `translate(${xStart},${y})`;
          };
        })
        .on("end", () => {
          if (Math.abs(xStart - 200) < 30 && molType.type === "B") {
            showReaction(xStart);
          }
          mol.remove();
        });
    }

    // Reaction visualization: AB product rises and disappears
    function showReaction(x) {
      const reaction = g.append("g")
        .attr("transform", `translate(${x}, ${plotHeight - 60})`)
        .attr("opacity", 1);

      reaction.append("circle")
        .attr("r", 10)
        .attr("fill", "purple")
        .attr("opacity", 0.9);

      reaction.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("fill", "white")
        .attr("font-size", "12px")
        .text("AB");

      // Animate product rising
      reaction.transition()
        .duration(3000)
        .ease(d3.easeCubicOut)
        .attrTween("transform", () => {
          return function (t) {
            const dy = t * 100; // rise distance
            return `translate(${x}, ${plotHeight - 60 - dy})`;
          };
        })
        .attr("opacity", 0)
        .remove();
    }

    // Interval for new molecules
    d3.interval(() => {
      const mol = molData[Math.floor(Math.random() * molData.length)];
      spawnMolecule(mol);
    }, 100); // every 1.2 seconds
  }

  animateMolecules();

  // Title
  g.append("text")
    .attr("x", plotWidth / 2)
    .attr("y", -5)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .text("Catalyst Surface with Active Sites");
}
