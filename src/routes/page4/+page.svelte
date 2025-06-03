<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { page } from '$app/stores';
  import { base } from '$app/paths';

  let currentPage = $page.url.pathname;
  let activeCatalyst = 'enzyme';
  let reactionRate = 1;
  let showExplanation = false;

  onMount(() => {
    drawEnergyProfile();
    drawCatalystSurface();
    drawReactionRateChart();
  });

  function drawEnergyProfile() {
    const svg = d3.select("#energyProfile");
    svg.selectAll("*").remove();
    
    const width = +svg.attr("width"), height = +svg.attr("height");
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Energy profile data
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

    // Scales
    const x = d3.scaleLinear().domain([0, 2]).range([0, plotWidth]);
    const y = d3.scaleLinear().domain([0, 200]).range([plotHeight, 0]);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${plotHeight})`)
      .call(d3.axisBottom(x).tickValues([0, 1, 2]).tickFormat(d => ["Reactants", "Transition State", "Products"][d]));
    
    g.append("g")
      .call(d3.axisLeft(y).tickFormat(d => `${d} kJ/mol`));

    // Lines
    const line = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveBasis);

    g.append("path")
      .datum(uncatalyzed)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 3)
      .attr("d", line);

    g.append("path")
      .datum(catalyzed)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "5,5")
      .attr("d", line);

    // Labels and annotations
    g.append("text")
      .attr("x", plotWidth / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Catalyst Effect on Activation Energy");

    g.append("line")
      .attr("x1", x(1))
      .attr("y1", y(uncatalyzed[1].y))
      .attr("x2", x(1))
      .attr("y2", y(catalyzed[3].y))
      .attr("stroke", "black")
      .attr("stroke-dasharray", "3,3");

    g.append("text")
      .attr("x", x(1) + 10)
      .attr("y", y((uncatalyzed[1].y + catalyzed[3].y)/2))
      .text("ΔEa")
      .style("font-size", "14px");

    // Energy values
    uncatalyzed.forEach((point, i) => {
      g.append("circle")
        .attr("cx", x(point.x))
        .attr("cy", y(point.y))
        .attr("r", 5)
        .attr("fill", "red");

      g.append("text")
        .attr("x", x(point.x) + (i === 1 ? -30 : 10))
        .attr("y", y(point.y) - 10)
        .text(`${point.y} kJ/mol`)
        .style("font-size", "12px");
    });

    catalyzed.forEach((point, i) => {
      if (i === 3) {
        g.append("circle")
          .attr("cx", x(point.x))
          .attr("cy", y(point.y))
          .attr("r", 5)
          .attr("fill", "blue");

        g.append("text")
          .attr("x", x(point.x) - 30)
          .attr("y", y(point.y) - 10)
          .text(`${point.y} kJ/mol`)
          .style("font-size", "12px");
      }
    });
  }

  function drawCatalystSurface() {
    const svg = d3.select("#catalystSurface");
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

function drawReactionRateChart() {
  const svg = d3.select("#reactionRateChart");
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
    // This function should be defined in your Svelte component
    // It will handle showing/hiding the detailed explanation
    showExplanation = !showExplanation;
  }

  // Initial animations after a short delay
  setTimeout(() => {
    playHydrogenation();
    setTimeout(playEnzyme, 4000);
  }, 500);
}
  function updateReactionRate() {
    reactionRate = Math.random() * 2 + 0.5; // Random rate between 0.5 and 2.5
    drawReactionRateChart();
  }

  function toggleExplanation() {
    showExplanation = !showExplanation;
  }
</script>

<svelte:head>
  <title>Chemical Kinetics - Catalysts</title>
</svelte:head>

<nav class="main-nav">
  <a href="{base}/" class={currentPage === `${base}/` ? 'active' : ''}>Home</a>
  <a href="{base}/page0" class={currentPage === `${base}/page0` ? 'active' : ''}>Introduction</a>
  <a href="{base}/page1" class={currentPage === `${base}/page1` ? 'active' : ''}>Reaction Orders</a>
  <a href="{base}/page2" class={currentPage === `${base}/page2` ? 'active' : ''}>Activation Energy</a>
  <a href="{base}/page3" class={currentPage === `${base}/page3` ? 'active' : ''}>Simulation</a>
  <a href="{base}/page4" class={currentPage === `${base}/page4` ? 'active' : ''}>Catalyst Effect</a>
  <a href="{base}/page5" class={currentPage === `${base}/page5` ? 'active' : ''}>Radioactivity</a>
</nav>

<main class="page" id="page4">
  <h1>Catalysts in Chemical Kinetics</h1>
  
  <section class="intro">
    <p>
      Catalysts are substances that increase the rate of a chemical reaction without being consumed in the process. 
      They work by providing an alternative reaction pathway with a lower activation energy. This page explores 
      how catalysts affect chemical reactions through interactive visualizations.
    </p>
  </section>

  <section class="visualization">
    <h2>1. Energy Profile With and Without Catalyst</h2>
    <svg id="energyProfile" width="800" height="400"></svg>
    <div class="explanation">
      <p>
        This diagram compares the energy profiles of a reaction with (blue) and without (red) a catalyst. 
        The catalyst provides an alternative pathway with a significantly lower activation energy (ΔEa), 
        while the overall energy change (ΔH) remains the same.
      </p>
    </div>
  </section>

  <section class="visualization">
    <h2>2. Catalyst Surface Mechanism</h2>
    <svg id="catalystSurface" width="800" height="300"></svg>
    <div class="explanation">
      <p>
        Heterogeneous catalysts provide a surface with active sites where reactant molecules can adsorb, 
        react, and then desorb as products. The gold circles represent active sites on the catalyst surface 
        where the reaction A + B → AB occurs more easily than in the gas phase.
      </p>
    </div>
  </section>

  <section class="visualization">
    <h2>3. Examples of catalysis</h2>
    <svg id="reactionRateChart" width="800" height="800"></svg>
  
   
    {#if showExplanation}
      <div class="explanation">
        <h3>How Catalysts Increase Reaction Rate</h3>
        <p>
          Catalysts increase reaction rates through several mechanisms:
        </p>
        <ul>
          <li><strong>Lowering Activation Energy:</strong> As shown in the first visualization, catalysts provide an alternative pathway with lower Ea</li>
          <li><strong>Increasing Effective Collisions:</strong> By orienting molecules properly on active sites</li>
          <li><strong>Stabilizing Transition States:</strong> The catalyst may stabilize the transition state complex</li>
        </ul>
        <p>
          The blue curve shows how the reaction proceeds faster with a catalyst, reaching equilibrium more quickly. 
          The exact rate enhancement depends on the catalyst type and reaction conditions.
        </p>
      </div>
    {/if}
  </section>

  <section class="catalyst-types">
    <h2>Types of Catalysts</h2>
    <div class="tabs">
      <button 
        class:active={activeCatalyst === 'homogeneous'} 
        on:click={() => activeCatalyst = 'homogeneous'}
      >
        Homogeneous
      </button>
      <button 
        class:active={activeCatalyst === 'heterogeneous'} 
        on:click={() => activeCatalyst = 'heterogeneous'}
      >
        Heterogeneous
      </button>
      <button 
        class:active={activeCatalyst === 'enzyme'} 
        on:click={() => activeCatalyst = 'enzyme'}
      >
        Enzymes
      </button>
    </div>

    <div class="tab-content">
      {#if activeCatalyst === 'homogeneous'}
        <div>
          <h3>Homogeneous Catalysts</h3>
          <p>
            Homogeneous catalysts exist in the same phase (usually liquid) as the reactants. They often work by 
            forming intermediate complexes with reactants. Examples include:
          </p>
          <ul>
            <li>Acid-base catalysts in esterification reactions</li>
            <li>Transition metal complexes in hydrogenation</li>
            <li>Enzymes in biological systems (though these are often classified separately)</li>
          </ul>
        </div>
      {:else if activeCatalyst === 'heterogeneous'}
        <div>
          <h3>Heterogeneous Catalysts</h3>
          <p>
            Heterogeneous catalysts are in a different phase than the reactants, typically solids interacting with 
            gases or liquids. They are widely used in industrial processes:
          </p>
          <ul>
            <li>Platinum in catalytic converters for automobiles</li>
            <li>Iron in the Haber process for ammonia synthesis</li>
            <li>Zeolites in petroleum cracking</li>
          </ul>
        </div>
      {:else}
        <div>
          <h3>Enzymes - Biological Catalysts</h3>
          <p>
            Enzymes are protein molecules that catalyze biochemical reactions with incredible specificity and efficiency. 
            Key features include:
          </p>
          <ul>
            <li>Active sites precisely shaped for their substrates</li>
            <li>Optimal activity within narrow pH and temperature ranges</li>
            <li>Regulation through inhibitors and activators</li>
            <li>Examples: Amylase (digests starch), DNA polymerase (replicates DNA)</li>
          </ul>
        </div>
      {/if}
    </div>
  </section>
</main>

<style>
  .main-nav {
    background-color: #2c3e50;
    padding: 1rem 2rem;
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .main-nav a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .main-nav a:hover {
    background-color: #34495e;
  }

  .main-nav a.active {
    background-color: #3498db;
  }
  
  .page {
    padding: 20px;
    font-family: Arial, sans-serif;
    max-width: 900px;
    margin: 0 auto;
  }

  h1, h2, h3 {
    color: #2c3e50;
  }

  .visualization {
    margin: 40px 0;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .explanation {
    margin-top: 15px;
    padding: 15px;
    background: #fff;
    border-left: 4px solid #3498db;
  }

  button {
    padding: 8px 15px;
    margin-right: 10px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #2980b9;
  }

  button.active {
    background: #2c3e50;
  }

  .tabs {
    display: flex;
    margin-bottom: 20px;
  }

  .tabs button {
    flex: 1;
  }

  .tab-content {
    padding: 20px;
    background: #f0f0f0;
    border-radius: 0 0 8px 8px;
  }

  ul {
    padding-left: 20px;
  }

  li {
    margin-bottom: 8px;
  }

 #reactionRateChart {
  display: block;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.explanation {
  font-family: Arial, sans-serif;
  fill: #333;
}
</style>