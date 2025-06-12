import * as d3 from 'd3';

export function drawReactionRateChart(svgRef, toggleExplanation) {
  const svg = d3.select(svgRef);
  svg.selectAll("*").remove();
  
  const width = +svg.attr("width"), height = +svg.attr("height");
  const margin = { top: 20, right: 30, bottom: 30, left: 30 };
  
  // Create containers for both visualizations
  const container = svg.append("g")
    .attr("transform", `translate(0, 30)`);

  // Add title
  container.append("text")
    .attr("x", width/2)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Catalytic Processes Comparison");

  // ==============================================
  // 1. Catalytic Hydrogenation Animation
  // ==============================================
  const hydrogenation = container.append("g")
    .attr("transform", `translate(${width/2 - 200}, 3)`);

  // Metal catalyst surface
  hydrogenation.append("rect")
    .attr("x", 0)
    .attr("y", 100)
    .attr("width", 400)
    .attr("height", 30)
    .attr("fill", "#b0b0b0")
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("class", "catalyst-surface");

  // Active sites (Ni/Pd/Pt)
  [100, 200, 300].forEach((x, i) => {
    hydrogenation.append("circle")
      .attr("cx", x)
      .attr("cy", 100)
      .attr("r", 12)
      .attr("fill", "#ffd700")
      .attr("stroke", "#c0a040")
      .attr("stroke-width", 2)
      .attr("class", `active-site-${i}`);
  });

  // Alkene molecule (C=C)
  const alkene = hydrogenation.append("g")
    .attr("class", "alkene")
    .attr("transform", "translate(0,0)");
  
  alkene.append("path")
    .attr("d", "M100,20 L140,20 L160,50 L140,80 L100,80 L80,50 Z")
    .attr("fill", "#4CAF50")
    .attr("stroke", "#2E7D32")
    .attr("stroke-width", 1.5);

  alkene.append("text")
    .attr("x", 120)
    .attr("y", 50)
    .attr("text-anchor", "middle")
    .text("C=C")
    .style("fill", "white")
    .style("font-weight", "bold");

  // Hydrogen molecule (H₂)
  const hydrogen = hydrogenation.append("g")
    .attr("class", "hydrogen")
    .attr("transform", "translate(0,0)");
  
  hydrogen.append("circle")
    .attr("cx", 200)
    .attr("cy", 40)
    .attr("r", 15)
    .attr("fill", "#2196F3")
    .attr("stroke", "#0d47a1")
    .attr("stroke-width", 1.5);

  hydrogen.append("text")
    .attr("x", 200)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .text("H₂")
    .style("fill", "white")
    .style("font-weight", "bold");

  // Product (C-C)
  const product = hydrogenation.append("g")
    .attr("class", "product")
    .attr("opacity", 0);
  
  product.append("path")
    .attr("d", "M100,100 L140,100 L160,130 L140,160 L100,160 L80,130 Z")
    .attr("fill", "#8BC34A")
    .attr("stroke", "#689F38")
    .attr("stroke-width", 1.5);

  product.append("text")
    .attr("x", 120)
    .attr("y", 130)
    .attr("text-anchor", "middle")
    .text("C-C")
    .style("fill", "white")
    .style("font-weight", "bold");

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 190)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-family", "Arial")
    .attr("class", "explanation")
    .selectAll("tspan")
    .data([
       "",
      "  ",
      "Catalytic Hydrogenation:",
      "Metal surfaces (Ni, Pd, or Pt)",
      "facilitate the addition of hydrogen (H₂) to carbon-carbon double bonds (C=C),",
      "converting them to single bonds (C-C)."
    ])
    .enter()
    .append("tspan")
      .attr("x", width / 2)
      .attr("dy", (d, i) => i === 0 ? 0 : "1.2em")
      .text(d => d);

  // ==============================================
  // 2. Enzyme Catalysis Animation
  // ==============================================
  const enzymeViz = container.append("g")
    .attr("transform", `translate(${width/2 - 200}, 220)`);

  // Enzyme body (more detailed shape)
  enzymeViz.append("path")
    .attr("d", "M50,80 C100,20 300,20 350,80 C400,140 400,220 350,280 C300,340 100,340 50,280 C0,220 0,140 50,80 Z")
    .attr("fill", "#9C27B0")
    .attr("opacity", 0.7)
    .attr("stroke", "#7B1FA2")
    .attr("stroke-width", 2)
    .attr("class", "enzyme-body");

  // Active site (more pronounced)
  const activeSite = enzymeViz.append("path")
    .attr("d", "M150,150 C200,120 250,120 300,150 C250,180 200,180 150,150 Z")
    .attr("fill", "#FFC107")
    .attr("stroke", "#FFA000")
    .attr("stroke-width", 2)
    .attr("class", "active-site");

  // Substrate
  const substrate = enzymeViz.append("g")
    .attr("class", "substrate")
    .attr("transform", "translate(400,180)");
  
  substrate.append("path")
    .attr("d", "M-40,0 L40,0 L60,30 L40,60 L-40,60 L-60,30 Z")
    .attr("fill", "#4CAF50")
    .attr("stroke", "#2E7D32")
    .attr("stroke-width", 1.5);

  substrate.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .text("S")
    .style("fill", "white")
    .style("font-weight", "bold")
    .style("font-size", "18px");

  // Product
  const enzymeProduct = enzymeViz.append("g")
    .attr("class", "enzyme-product")
    .attr("opacity", 0)
    .attr("transform", "translate(350,100)");
  
  enzymeProduct.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 25)
    .attr("fill", "#2196F3")
    .attr("stroke", "#0d47a1")
    .attr("stroke-width", 1.5);

  enzymeProduct.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .text("P")
    .style("fill", "white")
    .style("font-weight", "bold")
    .style("font-size", "18px");

  // Enzyme explanation text
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 610)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-family", "Arial")
    .attr("class", "explanation")
    .selectAll("tspan")
    .data([
      "Enzyme Catalysis:",
      "Enzymes are biological catalysts that accelerate reactions", 
      "through precise molecular recognition (lock-and-key model)."
    ])
    .enter()
    .append("tspan")
      .attr("x", width / 2)
      .attr("dy", (d, i) => i === 0 ? 0 : "1.2em")
      .text(d => d);

  // ==============================================
  // Control Buttons
  // ==============================================
  const buttonGroup = svg.append("g")
    .attr("transform", `translate(${width/2 - 180}, 680)`);

  // 1. Hydrogenation Play Button
  const hydrogenationButton = buttonGroup.append("g")
    .attr("transform", "translate(0, 0)")
    .attr("class", "hydrogenation-button")
    .style("cursor", "pointer")
    .on("click", playHydrogenation);

  hydrogenationButton.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 120)
    .attr("height", 40)
    .attr("rx", 20)
    .attr("ry", 20)
    .attr("fill", "#4CAF50")
    .attr("stroke", "#2E7D32")
    .attr("stroke-width", 1.5);

  hydrogenationButton.append("text")
    .attr("x", 60)
    .attr("y", 24)
    .attr("text-anchor", "middle")
    .text("Play Hydrogenation")
    .style("fill", "white")
    .style("font-size", "12px")
    .style("font-weight", "bold");

  // 2. Enzyme Play Button
  const enzymeButton = buttonGroup.append("g")
    .attr("transform", "translate(130, 0)")
    .attr("class", "enzyme-button")
    .style("cursor", "pointer")
    .on("click", playEnzyme);

  enzymeButton.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 120)
    .attr("height", 40)
    .attr("rx", 20)
    .attr("ry", 20)
    .attr("fill", "#9C27B0")
    .attr("stroke", "#7B1FA2")
    .attr("stroke-width", 1.5);

  enzymeButton.append("text")
    .attr("x", 60)
    .attr("y", 24)
    .attr("text-anchor", "middle")
    .text("Play Enzyme")
    .style("fill", "white")
    .style("font-size", "12px")
    .style("font-weight", "bold");

  // 3. Explanation Button
  const explanationButton = buttonGroup.append("g")
    .attr("transform", "translate(260, 0)")
    .attr("class", "explanation-button")
    .style("cursor", "pointer")
    .on("click", toggleExplanation);

  explanationButton.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 120)
    .attr("height", 40)
    .attr("rx", 20)
    .attr("ry", 20)
    .attr("fill", "#3498db")
    .attr("stroke", "#2980b9")
    .attr("stroke-width", 1.5);

  explanationButton.append("text")
    .attr("x", 60)
    .attr("y", 24)
    .attr("text-anchor", "middle")
    .text("How Catalysts Work")
    .style("fill", "white")
    .style("font-size", "12px")
    .style("font-weight", "bold");

  // Add hover effects to all buttons
  d3.selectAll(".hydrogenation-button, .enzyme-button, .explanation-button")
    .on("mouseover", function() {
      d3.select(this).select("rect")
        .transition()
        .duration(200)
        .attr("opacity", 0.8);
    })
    .on("mouseout", function() {
      d3.select(this).select("rect")
        .transition()
        .duration(200)
        .attr("opacity", 1);
    });

  // ==============================================
  // Animation Functions
  // ==============================================
  function playHydrogenation() {
    // Reset
    d3.select(".alkene").attr("transform", "translate(0,0)");
    d3.select(".hydrogen").attr("transform", "translate(0,0)");
    d3.select(".product").attr("opacity", 0);
    
    // Animate
    d3.select(".alkene").transition()
      .duration(1500)
      .attr("transform", "translate(0,80)")
      .on("end", () => {
        d3.select(".hydrogen").transition()
          .duration(1500)
          .attr("transform", "translate(0,60)")
          .on("end", () => {
            d3.select(".product").transition()
              .duration(1000)
              .attr("opacity", 1);
          });
      });
  }

  function playEnzyme() {
    // Reset
    d3.select(".substrate").attr("transform", "translate(400,180)");
    d3.select(".active-site").attr("fill", "#FFC107");
    d3.select(".enzyme-product").attr("opacity", 0).attr("transform", "translate(350,100)");
    
    // Animate
    d3.select(".substrate").transition()
      .duration(1500)
      .attr("transform", "translate(200,180)")
      .on("end", () => {
        d3.select(".substrate").transition()
          .duration(1000)
          .attr("transform", "translate(170,180)");
        
        d3.select(".active-site").transition()
          .duration(500)
          .attr("fill", "#FF5722");
          
        setTimeout(() => {
          d3.select(".enzyme-product").transition()
            .duration(1000)
            .attr("opacity", 1)
            .attr("transform", "translate(350,50)");
        }, 1000);
      });
  }

  function toggleExplanation() {
    toggleExplanation();
  }

  // Initial animations after a short delay
  setTimeout(() => {
    playHydrogenation();
    setTimeout(playEnzyme, 4000);
  }, 500);
}