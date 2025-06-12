// Import D3
import * as d3 from 'd3';

export function drawReactionRateChart(svgRef, toggleExplanation) {
  const svg = d3.select(svgRef);
  svg.selectAll("*").remove();

  const width = +svg.attr("width"), height = +svg.attr("height");
  const margin = { top: 20, right: 30, bottom: 30, left: 30 };

  const container = svg.append("g")
    .attr("transform", `translate(0, 30)`);

  // ==================== CATALYTIC HYDROGENATION SECTION ====================
  container.append("text")
    .attr("x", width/2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "28px")
    .style("font-weight", "bold")
    .text("Catalytic Hydrogenation");

  const hydrogenation = container.append("g")
    .attr("transform", `translate(${width/2 - 300}, 40)`);

  // Metal surface (Catalyst)
  hydrogenation.append("rect")
    .attr("x", 50).attr("y", 250)
    .attr("width", 500).attr("height", 40)
    .attr("fill", "#607D8B")
    .attr("stroke", "#455A64").attr("stroke-width", 3);

  // Active sites (Metal atoms) with d orbitals
  const metalAtomsData = [
    {x: 100, y: 250}, {x: 180, y: 250}, {x: 260, y: 250}, {x: 340, y: 250}, {x: 420, y: 250}, {x: 500, y: 250},
    {x: 140, y: 280}, {x: 220, y: 280}, {x: 300, y: 280}, {x: 380, y: 280}, {x: 460, y: 280}
  ];

  metalAtomsData.forEach(atom => {
    hydrogenation.append("circle")
      .attr("cx", atom.x).attr("cy", atom.y)
      .attr("r", 15).attr("fill", "#B0BEC5")
      .attr("stroke", "#78909C").attr("stroke-width", 1.5)
      .attr("class", "metal-atom");

    hydrogenation.append("text")
      .attr("x", atom.x).attr("y", atom.y + 5)
      .attr("text-anchor", "middle").text("M")
      .style("fill", "black").style("font-size", "14px").style("font-weight", "bold")
      .attr("class", "metal-label");

    const orbitalRx = 18, orbitalRy = 10;
    hydrogenation.append("ellipse")
      .attr("cx", atom.x).attr("cy", atom.y - 8)
      .attr("rx", orbitalRx).attr("ry", orbitalRy)
      .attr("transform", `rotate(45, ${atom.x}, ${atom.y - 8})`)
      .attr("fill", "none").attr("stroke", "#FFC107").attr("stroke-width", 2)
      .attr("class", "d-orbital");
    hydrogenation.append("ellipse")
      .attr("cx", atom.x).attr("cy", atom.y - 8)
      .attr("rx", orbitalRx).attr("ry", orbitalRy)
      .attr("transform", `rotate(-45, ${atom.x}, ${atom.y - 8})`)
      .attr("fill", "none").attr("stroke", "#FFC107").attr("stroke-width", 2)
      .attr("class", "d-orbital");
  });

  // Alkene (C=C)
  const alkene = hydrogenation.append("g").attr("class", "alkene")
    .attr("transform", "translate(0, 50)");

  const carbonRadius = 15;
  alkene.append("circle")
    .attr("cx", 220).attr("cy", 120).attr("r", carbonRadius)
    .attr("fill", "#6A1B9A").attr("stroke", "#4A148C").attr("stroke-width", 2.5)
    .attr("class", "carbon-atom c1");
  alkene.append("circle")
    .attr("cx", 280).attr("cy", 120).attr("r", carbonRadius)
    .attr("fill", "#6A1B9A").attr("stroke", "#4A148C").attr("stroke-width", 2.5)
    .attr("class", "carbon-atom c2");

  alkene.append("text")
    .attr("x", 220).attr("y", 125).attr("text-anchor", "middle").text("C")
    .style("fill", "white").style("font-size", "16px").style("font-weight", "bold");
  alkene.append("text")
    .attr("x", 280).attr("y", 125).attr("text-anchor", "middle").text("C")
    .style("fill", "white").style("font-size", "16px").style("font-weight", "bold");

  const bondWidth = 4;
  alkene.append("line")
    .attr("x1", 220 - carbonRadius).attr("y1", 120).attr("x2", 280 + carbonRadius).attr("y2", 120)
    .attr("stroke", "#9C27B0").attr("stroke-width", bondWidth)
    .attr("class", "double-bond-line");
  alkene.append("line")
    .attr("x1", 220 - carbonRadius).attr("y1", 120 + 7).attr("x2", 280 + carbonRadius).attr("y2", 120 + 7)
    .attr("stroke", "#9C27B0").attr("stroke-width", bondWidth)
    .attr("class", "double-bond-line");

  const piOrbitalRx = 40, piOrbitalRy = 20;
  alkene.append("ellipse")
    .attr("cx", 250).attr("cy", 120 - piOrbitalRy).attr("rx", piOrbitalRx).attr("ry", piOrbitalRy)
    .attr("fill", "rgba(0, 188, 212, 0.4)").attr("stroke", "#00BCD4").attr("stroke-width", 1.5)
    .attr("class", "pi-orbital top");
  alkene.append("ellipse")
    .attr("cx", 250).attr("cy", 120 + piOrbitalRy).attr("rx", piOrbitalRx).attr("ry", piOrbitalRy)
    .attr("fill", "rgba(0, 188, 212, 0.4)").attr("stroke", "#00BCD4").attr("stroke-width", 1.5)
    .attr("class", "pi-orbital bottom");

  // Hydrogen molecule (H₂)
  const hydrogen = hydrogenation.append("g").attr("class", "hydrogen")
    .attr("transform", "translate(400, 50)");

  const hRadius = 12;
  hydrogen.append("circle").attr("cx", 0).attr("cy", 0).attr("r", hRadius)
    .attr("fill", "#E0F2F7").attr("stroke", "#B2EBF2").attr("stroke-width", 2)
    .attr("class", "h-atom h1");
  hydrogen.append("text")
    .attr("x", 0).attr("y", 4).attr("text-anchor", "middle").text("H")
    .style("fill", "black").style("font-size", "12px").style("font-weight", "bold");

  hydrogen.append("circle").attr("cx", 25).attr("cy", 0).attr("r", hRadius)
    .attr("fill", "#E0F2F7").attr("stroke", "#B2EBF2").attr("stroke-width", 2)
    .attr("class", "h-atom h2");
  hydrogen.append("text")
    .attr("x", 25).attr("y", 4).attr("text-anchor", "middle").text("H")
    .style("fill", "black").style("font-size", "12px").style("font-weight", "bold");

  hydrogen.append("line")
    .attr("x1", 0).attr("y1", 0).attr("x2", 25).attr("y2", 0)
    .attr("stroke", "#E0F2F7").attr("stroke-width", 3)
    .attr("class", "h-bond");

  // Dissociated hydrogens (H_ads)
  const hAds = hydrogenation.append("g").attr("class", "h-ads").attr("opacity", 0);
  hAds.append("circle").attr("cx", 100).attr("cy", 220).attr("r", hRadius).attr("fill", "#E0F2F7").attr("class", "h-ads-1");
  hAds.append("text")
    .attr("x", 100).attr("y", 224).attr("text-anchor", "middle").text("H")
    .style("fill", "black").style("font-size", "12px").style("font-weight", "bold");
  hAds.append("circle").attr("cx", 180).attr("cy", 220).attr("r", hRadius).attr("fill", "#E0F2F7").attr("class", "h-ads-2");
  hAds.append("text")
    .attr("x", 180).attr("y", 224).attr("text-anchor", "middle").text("H")
    .style("fill", "black").style("font-size", "12px").style("font-weight", "bold");

  // Product (Alkane C-C)
  const product = hydrogenation.append("g").attr("class", "product").attr("opacity", 0);

  product.append("circle")
    .attr("cx", 250 - (carbonRadius / 2)).attr("cy", 220).attr("r", carbonRadius)
    .attr("fill", "#6A1B9A").attr("stroke", "#4A148C").attr("stroke-width", 2.5)
    .attr("class", "carbon-atom-product c1");
  product.append("text")
    .attr("x", 250 - (carbonRadius / 2)).attr("y", 225).attr("text-anchor", "middle").text("C")
    .style("fill", "white").style("font-size", "16px").style("font-weight", "bold");

  product.append("circle")
    .attr("cx", 250 + (carbonRadius / 2) + 40).attr("cy", 220).attr("r", carbonRadius)
    .attr("fill", "#6A1B9A").attr("stroke", "#4A148C").attr("stroke-width", 2.5)
    .attr("class", "carbon-atom-product c2");
  product.append("text")
    .attr("x", 250 + (carbonRadius / 2) + 40).attr("y", 225).attr("text-anchor", "middle").text("C")
    .style("fill", "white").style("font-size", "16px").style("font-weight", "bold");

  product.append("line")
    .attr("x1", 250 - (carbonRadius / 2) - 10).attr("y1", 220).attr("x2", 250 + (carbonRadius / 2) + 50).attr("y2", 220)
    .attr("stroke", "#9C27B0").attr("stroke-width", bondWidth);

  product.append("circle").attr("cx", 250 - (carbonRadius / 2) - 5).attr("cy", 220 - 20).attr("r", hRadius).attr("fill", "#E0F2F7");
  product.append("text").attr("x", 250 - (carbonRadius / 2) - 5).attr("y", 220 - 16).attr("text-anchor", "middle").text("H").style("fill", "black").style("font-size", "12px").style("font-weight", "bold");
  product.append("line").attr("x1", 250 - (carbonRadius / 2)).attr("y1", 220).attr("x2", 250 - (carbonRadius / 2) - 5).attr("y2", 220 - 20).attr("stroke", "#E0F2F7").attr("stroke-width", 2);

  product.append("circle").attr("cx", 250 + (carbonRadius / 2) + 45).attr("cy", 220 - 20).attr("r", hRadius).attr("fill", "#E0F2F7");
  product.append("text").attr("x", 250 + (carbonRadius / 2) + 45).attr("y", 220 - 16).attr("text-anchor", "middle").text("H").style("fill", "black").style("font-size", "12px").style("font-weight", "bold");
  product.append("line").attr("x1", 250 + (carbonRadius / 2) + 40).attr("y1", 220).attr("x2", 250 + (carbonRadius / 2) + 45).attr("y2", 220 - 20).attr("stroke", "#E0F2F7").attr("stroke-width", 2);

  // HYDROGENATION BUTTON
  const hydrogenationButtonGroup = container.append("g")
    .attr("transform", `translate(${width/2 - 100}, 500)`);

  const hydrogenationButton = hydrogenationButtonGroup.append("g")
    .attr("class", "hydrogenation-button")
    .style("cursor", "pointer")
    .on("click", playHydrogenation);

  hydrogenationButton.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 200)
    .attr("height", 40)
    .attr("rx", 20)
    .attr("ry", 20)
    .attr("fill", "#00BCD4")
    .attr("stroke", d3.color("#00BCD4").darker(1))
    .attr("stroke-width", 1.5);

  hydrogenationButton.append("text")
    .attr("x", 100)
    .attr("y", 24)
    .attr("text-anchor", "middle")
    .text("Show Hydrogenation")
    .style("fill", "white")
    .style("font-size", "16px")
    .style("font-weight", "bold");

  // HYDROGENATION EXPLANATION
  container.append("text")
    .attr("x", width / 2)
    .attr("y", 590)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .style("font-family", "Arial")
    .attr("class", "explanation")
    .selectAll("tspan")
    .data([
      "Catalytic Hydrogenation:",
      "1. The alkene approaches the metal surface.",
      "2. H₂ is adsorbed and dissociates into H atoms.",
      "3. The alkene forms a π-complex with the metal d orbitals.",
      "4. H atoms are transferred to the alkene, forming an alkane (C-C)."
    ])
    .enter().append("tspan")
    .attr("x", width / 2)
    .attr("dy", (d, i) => i === 0 ? 0 : "1.5em")
    .text(d => d);

  // ==================== ENZYMATIC CATALYSIS SECTION ====================
  container.append("text")
    .attr("x", width/2)
    .attr("y", 800)
    .attr("text-anchor", "middle")
    .style("font-size", "28px")
    .style("font-weight", "bold")
    .text("Enzymatic Catalysis");

  const enzymeViz = container.append("g")
    .attr("transform", `translate(${width/2 - 300}, 820)`);

  // Enzyme
  enzymeViz.append("path")
    .attr("d", "M50,80 C100,20 300,20 350,80 C400,140 400,220 350,280 C300,340 100,340 50,280 C0,220 0,140 50,80 Z")
    .attr("fill", "#8E24AA").attr("opacity", 0.7)
    .attr("stroke", "#6A1B9A").attr("stroke-width", 2);

  // Active site
  enzymeViz.append("path")
    .attr("d", "M150,150 C200,120 250,120 300,150 C250,180 200,180 150,150 Z")
    .attr("fill", "#FFEE58").attr("stroke", "#FBC02D")
    .attr("stroke-width", 2).attr("class", "active-site");

  // Substrate
  const substrate = enzymeViz.append("g")
    .attr("class", "substrate").attr("transform", "translate(400,180)");

  substrate.append("path")
    .attr("d", "M-40,0 L40,0 L60,30 L40,60 L-40,60 L-60,30 Z")
    .attr("fill", "#66BB6A").attr("stroke", "#388E3C").attr("stroke-width", 1.5);

  substrate.append("text")
    .attr("x", 0).attr("y", 30).attr("text-anchor", "middle")
    .text("S").style("fill", "white").style("font-weight", "bold").style("font-size", "18px");

  // Product
  const enzymeProduct = enzymeViz.append("g")
    .attr("class", "enzyme-product").attr("opacity", 0).attr("transform", "translate(350,100)");

  enzymeProduct.append("circle")
    .attr("cx", 0).attr("cy", 0).attr("r", 25)
    .attr("fill", "#42A5F5").attr("stroke", "#1976D2").attr("stroke-width", 1.5);

  enzymeProduct.append("text")
    .attr("x", 0).attr("y", 5).attr("text-anchor", "middle")
    .text("P").style("fill", "white").style("font-weight", "bold").style("font-size", "18px");

  // ENZYME BUTTON
  const enzymeButtonGroup = container.append("g")
    .attr("transform", `translate(${width/2 - 100}, 1200)`);

  const enzymeButton = enzymeButtonGroup.append("g")
    .attr("class", "enzyme-button")
    .style("cursor", "pointer")
    .on("click", playEnzyme);

  enzymeButton.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 200)
    .attr("height", 40)
    .attr("rx", 20)
    .attr("ry", 20)
    .attr("fill", "#8E24AA")
    .attr("stroke", d3.color("#8E24AA").darker(1))
    .attr("stroke-width", 1.5);

  enzymeButton.append("text")
    .attr("x", 100)
    .attr("y", 24)
    .attr("text-anchor", "middle")
    .text("Show Enzyme Action")
    .style("fill", "white")
    .style("font-size", "12px")
    .style("font-weight", "bold");

  // ENZYME EXPLANATION
  container.append("text")
    .attr("x", width / 2)
    .attr("y", 1290)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .style("font-family", "Arial")
    .attr("class", "explanation")
    .selectAll("tspan")
    .data([
      "Enzymatic Catalysis:",
      "1. The substrate recognizes and binds to the enzyme's active site.",
      "2. A temporary enzyme-substrate complex is formed.",
      "3. The product is released and the enzyme is regenerated."
    ])
    .enter().append("tspan")
    .attr("x", width / 2)
    .attr("dy", (d, i) => i === 0 ? 0 : "1.5em")
    .text(d => d);

  // ==================== CENTRAL BUTTON ====================
  const centralButtonGroup = container.append("g")
    .attr("transform", `translate(${width/2 - 100}, 1420)`);

  const centralButton = centralButtonGroup.append("g")
    .attr("class", "explanation-button")
    .style("cursor", "pointer")
    .on("click", toggleExplanation);

  centralButton.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 200)
    .attr("height", 40)
    .attr("rx", 20)
    .attr("ry", 20)
    .attr("fill", "#42A5F5")
    .attr("stroke", d3.color("#42A5F5").darker(1))
    .attr("stroke-width", 1.5);

  centralButton.append("text")
    .attr("x", 100)
    .attr("y", 24)
    .attr("text-anchor", "middle")
    .text("How Catalysts Work?")
    .style("fill", "white")
    .style("font-size", "12px")
    .style("font-weight", "bold");

  // ==================== ANIMATIONS ====================
  function playHydrogenation() {
    // Reset positions and opacities
    d3.select(".alkene").attr("transform", "translate(0, 50)");
    d3.select(".hydrogen").attr("transform", "translate(400, 50)");
    d3.select(".h-ads").attr("opacity", 0);
    d3.select(".product").attr("opacity", 0);
    d3.selectAll(".d-orbital").attr("opacity", 1).attr("fill", "none");
    d3.selectAll(".pi-orbital").attr("opacity", 1).attr("fill", "rgba(0, 188, 212, 0.4)");
    d3.selectAll(".double-bond-line").attr("opacity", 1);

    // Step 1: Alkene approaches
    d3.select(".alkene").transition().duration(1500)
      .attr("transform", `translate(${metalAtomsData[2].x - 220}, ${metalAtomsData[2].y - 120})`)
      .on("end", () => {
        // Step 2: H₂ approaches and dissociates
        d3.select(".hydrogen").transition().duration(1000)
          .attr("transform", `translate(${metalAtomsData[0].x - 10}, ${metalAtomsData[0].y - 30})`)
          .on("end", () => {
            d3.select(".hydrogen").attr("opacity", 0);
            d3.select(".h-ads").transition().duration(500).attr("opacity", 1)
              .on("end", () => {
                // Step 3: π-complex formation
                d3.selectAll(".d-orbital").transition().duration(700).attr("fill", "rgba(255, 193, 7, 0.4)");
                d3.select(".alkene").select(".pi-orbital.bottom").transition().duration(700)
                  .attr("ry", 30).attr("cy", 120 + 30);
                d3.select(".alkene").select(".pi-orbital.top").transition().duration(700)
                  .attr("ry", 30).attr("cy", 120 - 30);

                setTimeout(() => {
                  // Step 4: Hydrogen transfer
                  d3.select(".h-ads-1").transition().duration(800)
                    .attr("cx", 220).attr("cy", 120 - 20);
                  d3.select(".h-ads-2").transition().duration(800)
                    .attr("cx", 280).attr("cy", 120 - 20)
                    .on("end", () => {
                      d3.select(".alkene").attr("opacity", 0);
                      d3.select(".h-ads").attr("opacity", 0);
                      d3.selectAll(".d-orbital").transition().duration(300).attr("fill", "none");
                      d3.select(".product").attr("opacity", 1)
                        .attr("transform", `translate(${metalAtomsData[2].x - 250}, ${metalAtomsData[2].y - 80})`);

                      setTimeout(() => {
                        d3.select(".product").transition().duration(700).attr("opacity", 0).on("end", () => {
                          // Reset for replay
                          d3.select(".alkene").attr("opacity", 1);
                          d3.select(".hydrogen").attr("opacity", 1);
                          d3.select(".alkene").attr("transform", "translate(0, 50)");
                          d3.select(".hydrogen").attr("transform", "translate(400, 50)");
                          d3.select(".h-ads").select(".h-ads-1").attr("cx", 100).attr("cy", 220);
                          d3.select(".h-ads").select(".h-ads-2").attr("cx", 180).attr("cy", 220);
                          d3.selectAll(".pi-orbital").attr("ry", piOrbitalRy).attr("cy", (d,i) => i === 0 ? 120 - piOrbitalRy : 120 + piOrbitalRy);
                        });
                      }, 2000);
                    });
                }, 800);
              });
          });
      });
  }

  function playEnzyme() {
    d3.select(".substrate").attr("transform", "translate(400,180)");
    d3.select(".active-site").attr("fill", "#FFEE58");
    d3.select(".enzyme-product").attr("opacity", 0).attr("transform", "translate(350,100)");

    d3.select(".substrate").transition().duration(1500)
      .attr("transform", "translate(200,180)").on("end", () => {
        d3.select(".substrate").transition().duration(1000)
          .attr("transform", "translate(170,180)");
        d3.select(".active-site").transition().duration(500).attr("fill", "#EF6C00");
        setTimeout(() => {
          d3.select(".enzyme-product").transition().duration(1000)
            .attr("opacity", 1).attr("transform", "translate(350,50)");
        }, 1000);
      });
  }

  // Hover effects
  d3.selectAll(".hydrogenation-button, .enzyme-button, .explanation-button")
    .on("mouseover", function() {
      d3.select(this).select("rect").transition().duration(200).attr("opacity", 0.8);
    })
    .on("mouseout", function() {
      d3.select(this).select("rect").transition().duration(200).attr("opacity", 1);
    });

  // Initial animations
  setTimeout(() => {
    playHydrogenation();
    setTimeout(playEnzyme, 12000);
  }, 500);
}