<svelte:head>
  <title>Reaction Orders - Chemical Kinetics</title>
 <script src="https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js"></script>
  

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

<main class="page" id="page1">
  <h1>
    <span class="chem-icon">⚗️</span> Reaction Orders in Chemical Kinetics
  </h1>

  <section class="theory-section">
    <h2>Understanding Reaction Orders</h2>
    <p>The <strong>order of a reaction</strong> is defined as the sum of the powers to which the concentration terms are raised in the rate law equation. It indicates how the rate of reaction depends on the concentration of reactants.</p>
    
    <div class="order-types">
      <div class="order-card">
        <h3>Zero-Order Reactions</h3>
        <p>Rate is independent of reactant concentration. The rate law is:</p>
        <div class="equation">rate = k</div>
        <p>Example: <strong>Decomposition of ammonia on a platinum surface</strong> (2NH₃ → N₂ + 3H₂). The rate is constant until the catalyst surface is saturated.</p>
      </div>
      
      <div class="order-card">
        <h3>First-Order Reactions</h3>
        <p>Rate is directly proportional to one reactant concentration. The rate law is:</p>
        <div class="equation">rate = k[A]</div>
        <p>Example: <strong>Radioactive decay</strong> (e.g., Carbon-14 decay). Also, the decomposition of hydrogen peroxide (2H₂O₂ → 2H₂O + O₂) in aqueous solution.</p>
      </div>
      
      <div class="order-card">
        <h3>Second-Order Reactions</h3>
        <p>Rate depends on the square of one reactant concentration or the product of two concentrations. The rate law is:</p>
        <div class="equation">rate = k[A]² or rate = k[A][B]</div>
        <p>Example: <strong>Decomposition of nitrogen dioxide</strong> (2NO₂ → 2NO + O₂). Also common in many bimolecular elementary reactions.</p>
      </div>
    </div>
  </section>

  <section class="interactive-section">
    <h2>Interactive Reaction Order Explorer</h2>
    <p>Explore how different reaction orders affect concentration over time. Adjust the parameters below to see real-time changes in the reaction kinetics.</p>

    <div class="controls">
      <div class="control-group">
        <label>Initial Concentration [A]₀: <span class="value-display" bind:this={concAVal}>50</span> M</label>
        <input bind:this={concAInput} type="range" min="1" max="100" value="50" class="slider" />
      </div>
      
      <div class="control-group">
        <label>Rate Constant (k): <span class="value-display" bind:this={kVal}>1.0</span> </label>
        <input bind:this={kInput} type="range" min="0.1" max="5" step="0.1" value="1" class="slider" />
      </div>
      
      <div class="control-group">
        <label>Reaction Order (n): 
          <select bind:this={orderInput} class="order-select">
            <option value="0">Zero Order</option>
            <option value="1" selected>First Order</option>
            <option value="2">Second Order</option>
          </select>
        </label>
      </div>
    </div>

    <div id="rateLawDescription" bind:this={rateLawDescription} class="rate-law">
      <h3>Current Rate Law</h3>
      <p>The selected reaction has an order of <strong>1</strong>. The rate law is: <code>rate = k[A]</code></p>
    </div>

    <div class="visualization-container">
      <div class="chart-container">
        <h3>Concentration vs. Time</h3>
        <svg id="chart" width="800" height="400"></svg>
      </div>
      
      <div class="chart-container">
        <h3>Rate vs. Concentration</h3>
        <svg id="rateChart" width="800" height="400"></svg>
      </div>
      
      <div class="molecular-view">
        <h3>Molecular Visualization</h3>
        <svg id="animation" width="800" height="300"></svg>
      </div>
    </div>
  </section>

  <section class="characteristics-section">
    <h2>Key Characteristics by Order</h2>
    <table class="order-table">
      <thead>
        <tr>
          <th>Property</th>
          <th>Zero Order</th>
          <th>First Order</th>
          <th>Second Order</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Rate Law</td>
          <td>rate = k</td>
          <td>rate = k[A]</td>
          <td>rate = k[A]² or k[A][B]</td>
        </tr>
        <tr>
          <td>Integrated Rate Law</td>
          <td>[A] = [A]₀ - kt</td>
          <td>ln[A] = ln[A]₀ - kt</td>
          <td>1/[A] = 1/[A]₀ + kt</td>
        </tr>
        <tr>
          <td>Half-life</td>
          <td>t½ = [A]₀/2k</td>
          <td>t½ = ln(2)/k</td>
          <td>t½ = 1/(k[A]₀)</td>
        </tr>
        <tr>
          <td>Linear Plot</td>
          <td>[A] vs. t</td>
          <td>ln[A] vs. t</td>
          <td>1/[A] vs. t</td>
        </tr>
        <tr>
          <td>Units of k</td>
          <td>M·s⁻¹</td>
          <td>s⁻¹</td>
          <td>M⁻¹·s⁻¹</td>
        </tr>
      </tbody>
    </table>
  </section>


 <!-- 3D Potential Energy Surface Visualization -->
  <section class="tool-section">
    <h2>3D Potential Energy Surface</h2>
    <div class="info-box">
      <p>This visualization shows how potential energy changes along the reaction coordinate for different reaction orders.</p>
    </div>
    <div id="energy3d-container"></div>
    <div class="controls">
      <label>
        Surface Type:
        <select id="surface-type">
          <option value="simple">Simple (1st Order)</option>
          <option value="complex">Elementary Reaction</option>
          <option value="catalyzed">Catalyzed Reaction</option>
        </select>
      </label>
      <button id="rotate-btn">Auto Rotation</button>
    </div>

    <div class="info-box">
      
      <p>A <strong>3D Potential Energy Surface</strong> is a visual representation of how the potential energy of a chemical system changes as atoms move during a reaction.</p>
    
    <h3>Key Features:</h3>
    <ul>
      <li>The <span class="highlight">x and z axes</span> typically represent molecular coordinates or reaction progress</li>
      <li>The <span class="highlight">y axis (vertical)</span> shows potential energy</li>
      <li><span class="highlight">Reactants</span> appear at one end of the surface</li>
      <li><span class="highlight">Products</span> appear at the other end</li>
      <li>The <span class="highlight">highest point</span> represents the transition state (activation energy)</li>
    </ul>
    
    <h3>What It Tells Us:</h3>
    <p>This visualization helps chemists understand:
      <ul>
        <li>The energy pathway of reactions</li>
        <li>Activation energy requirements</li>
        <li>How catalysts lower energy barriers</li>
        <li>Why some reactions occur faster than others</li>
      </ul>
    </div>




  </section>

  <!-- Reaction Time Calculator -->
  <section class="tool-section">
    <h2>Reaction Time Calculator</h2>
    <div class="calculator-grid">
      <div class="input-group">
        <label>Initial [A]₀ (M):</label>
        <input type="number" id="initial-conc" value="1.0" min="0.1" step="0.1">
      </div>
      <div class="input-group">
        <label>Target [A] (M):</label>
        <input type="number" id="final-conc" value="0.5" min="0" step="0.1">
      </div>
      <div class="input-group">
        <label>Rate Constant (k):</label>
        <input type="number" id="rate-const" value="0.1" min="0.01" step="0.01">
      </div>
      <div class="input-group">
        <label>Reaction Order:</label>
        <select id="reaction-order">
          <option value="0">Zero Order</option>
          <option value="1" selected>First Order</option>
          <option value="2">Second Order</option>
        </select>
      </div>
      <button id="calculate-btn">Calculate Time</button>
      <div class="result-box">
        <h3>Results:</h3>
        <p id="calculated-time">Time required: --</p>
        <p id="reaction-equation">Equation used: --</p>
      </div>
    </div>

<p>This calculator determines <strong>how long a reaction takes</strong> to reach a specified concentration based on:</p>
    
    <ul>
      <li>Initial concentration ([A]₀)</li>
      <li>Target concentration ([A])</li>
      <li>Rate constant (k)</li>
      <li>Reaction order (n)</li>
    </ul>
    
    <h3>What It Calculates:</h3>
    <p>Using <strong>integrated rate laws</strong>, it computes the time required for the concentration to change from [A]₀ to [A]:</p>
    
    <div class="equation-box">
      <h4>Zero Order (n=0):</h4>
      <p class="equation">t = ([A]₀ - [A])/k</p>
      <p>Time depends linearly on concentration change</p>
    </div>
    
    <div class="equation-box">
      <h4>First Order (n=1):</h4>
      <p class="equation">t = (ln[A]₀ - ln[A])/k = ln([A]₀/[A])/k</p>
      <p>Time depends on the ratio of concentrations</p>
    </div>
    
    <div class="equation-box">
      <h4>Second Order (n=2):</h4>
      <p class="equation">t = (1/[A] - 1/[A]₀)/k</p>
      <p>Time depends on inverse concentration differences</p>
    </div>
    
    <h3>Practical Applications:</h3>
    <ul>
      <li>Determining reaction completion times</li>
      <li>Designing chemical processes</li>
      <li>Predicting shelf life of products</li>
      <li>Optimizing laboratory experiments</li>
    </ul>




  </section>

  <!-- Half-Life Comparison Graph -->
  <section class="tool-section">
    <h2>Half-Life Comparison</h2>
    <div id="half-life-chart"></div>
    <div class="controls">
      <label>
        [A]₀ Range (M):
        <input type="range" id="conc-range" min="0.1" max="10" step="0.1" value="5">
        <span id="conc-range-value">5.0</span>
      </label>
      <label>
        k Value:
        <input type="range" id="k-range" min="0.01" max="1" step="0.01" value="0.1">
        <span id="k-range-value">0.10</span>
      </label>
    </div>


 <div class="info-box">
  <p>The <strong>half-life (t<sub>½</sub>)</strong> is the time required for the concentration of a reactant to decrease to half its initial value.</p>
    
    <h3>How It Varies by Reaction Order:</h3>
    <table class="half-life-table">
      <tr>
        <th>Reaction Order</th>
        <th>Half-Life Equation</th>
        <th>Dependence on [A]₀</th>
      </tr>
      <tr>
        <td>Zero Order</td>
        <td>t<sub>½</sub> = [A]₀/(2k)</td>
        <td>Directly proportional</td>
      </tr>
      <tr>
        <td>First Order</td>
        <td>t<sub>½</sub> = ln(2)/k</td>
        <td>Independent</td>
      </tr>
      <tr>
        <td>Second Order</td>
        <td>t<sub>½</sub> = 1/(k[A]₀)</td>
        <td>Inversely proportional</td>
      </tr>
    </table>
    
    <h3>Practical Importance:</h3>
    <ul>
      <li>Helps predict how long reactions take</li>
      <li>Essential for drug dosage calculations</li>
      <li>Used in radiocarbon dating</li>
      <li>Important for chemical manufacturing</li>
    </ul>
    </div>


  </section>




  
</main>

<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let concAInput, concAVal, kInput, kVal, orderInput;
  let rateLawDescription;

  onMount(() => {
    // Main chart setup
    const svg = d3.select("#chart");
    const rateSvg = d3.select("#rateChart");
    const animSvg = d3.select("#animation");
    
    const margin = { top: 40, right: 50, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Concentration vs Time chart
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const xScale = d3.scaleLinear().domain([0, 10]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width)
      .attr("y", 30)
      .attr("text-anchor", "end")
      .text("Time (s)");

    g.append("g")
      .call(d3.axisLeft(yScale).ticks(8))
      .append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("text-anchor", "end")
      .text("Concentration [A] (M)");

    const line = d3.line().x(d => xScale(d.time)).y(d => yScale(d.conc));
    const linePath = g.append("path")
      .attr("fill", "none")
      .attr("stroke", "#2c7bb6")
      .attr("stroke-width", 3)
      .attr("stroke-linejoin", "round");

    // Rate vs Concentration chart
    const rateG = rateSvg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const rateXScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
    const rateYScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    
    rateG.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(rateXScale).ticks(10))
      .append("text")
      .attr("class", "axis-label")
      .attr("x", width)
      .attr("y", 30)
      .attr("text-anchor", "end")
      .text("Concentration [A] (M)");

    rateG.append("g")
      .call(d3.axisLeft(rateYScale).ticks(8))
      .append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("text-anchor", "end")
      .text("Reaction Rate (M/s)");

    const rateLine = d3.line().x(d => rateXScale(d.conc)).y(d => rateYScale(d.rate));
    const rateLinePath = rateG.append("path")
      .attr("fill", "none")
      .attr("stroke", "#d7191c")
      .attr("stroke-width", 3)
      .attr("stroke-linejoin", "round");

    // Animation setup
    const particleGroup = animSvg.append("g");
    let particles = [];
    const numParticles = 100;

    function initializeParticles(A0) {
      particles = d3.range(numParticles).map(() => ({
        x: Math.random() * (800 - 40) + 20,
        y: Math.random() * (300 - 40) + 20,
        active: true,
        opacity: 1
      }));
      
      particleGroup.selectAll("circle").remove();
      particleGroup.selectAll("circle")
        .data(particles)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("fill", "#2c7bb6")
        .attr("opacity", d => d.opacity);
    }

    function updateCharts() {
      const A0 = +concAInput.value;
      const k = +kInput.value;
      const n = +orderInput.value;
      
      concAVal.textContent = A0;
      kVal.textContent = k.toFixed(1);
      
      // Update rate law description
      let rateLaw, units;
      if (n == 0) {
        rateLaw = "rate = k";
        units = "M·s⁻¹";
      } else if (n == 1) {
        rateLaw = "rate = k[A]";
        units = "s⁻¹";
      } else {
        rateLaw = "rate = k[A]²";
        units = "M⁻¹·s⁻¹";
      }
      
      rateLawDescription.innerHTML = `
        <h3>Current Rate Law</h3>
        <p>The selected reaction has an order of <strong>${n}</strong>. The rate law is: <code>${rateLaw}</code></p>
        <p>Units of k: <code>${units}</code></p>
      `;
      
      // Generate concentration vs time data
      const timeData = [];
      let A = A0;
      for (let t = 0; t <= 10; t += 0.1) {
        if (n == 0) {
          A = Math.max(A0 - k * t, 0);
        } else if (n == 1) {
          A = A0 * Math.exp(-k * t);
        } else {
          A = A0 / (1 + A0 * k * t);
        }
        timeData.push({ time: t, conc: A });
      }
      
      // Generate rate vs concentration data
      const rateData = [];
      for (let c = 0; c <= A0; c += A0/100) {
        rateData.push({ 
          conc: c, 
          rate: k * Math.pow(c, n) 
        });
      }
      
      // Update charts
      linePath.datum(timeData).attr("d", line);
      rateLinePath.datum(rateData).attr("d", rateLine);
      
      // Add chart titles
      svg.select(".chart-title").remove();
      svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width/2 + margin.left)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .text(`Concentration vs. Time (${n}${n==1?'st':n==2?'nd':'th'} Order Reaction)`);
        
      rateSvg.select(".chart-title").remove();
      rateSvg.append("text")
        .attr("class", "chart-title")
        .attr("x", width/2 + margin.left)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .text(`Reaction Rate vs. Concentration (Order = ${n})`);
      
      // Initialize particles if not already done
      if (particles.length === 0) {
        initializeParticles(A0);
      }
    }

    function startAnimation() {
      clearInterval(window.animationTimer);
      
      const A0 = +concAInput.value;
      const k = +kInput.value;
      const n = +orderInput.value;
      let t = 0, A = A0, dt = 0.1;
      
      // Initialize particles if needed
      if (particles.length === 0) {
        initializeParticles(A0);
      }
      
      window.animationTimer = setInterval(() => {
        if (t > 10) { 
          t = 0; 
          A = A0; 
          initializeParticles(A0);
        }
        
        // Update concentration based on order
        if (n == 0) {
          A = Math.max(A - k * dt, 0);
        } else if (n == 1) {
          A = A * Math.exp(-k * dt);
        } else {
          A = A / (1 + A * k * dt);
        }
        
        // Update particle visualization
        const activeCount = Math.floor((A / A0) * numParticles);
        
        particleGroup.selectAll("circle")
          .data(particles)
          .attr("fill", (d, i) => i < activeCount ? "#2c7bb6" : "#d7191c")
          .attr("opacity", (d, i) => i < activeCount ? 1 : 0.3);
        
        t += dt;
      }, 100);
    }

    // Initial setup
    updateCharts();
    startAnimation();
    
    // Event listeners
    concAInput.addEventListener("input", () => { 
      initializeParticles(+concAInput.value);
      updateCharts(); 
      startAnimation(); 
    });
    
    kInput.addEventListener("input", () => { 
      updateCharts(); 
      startAnimation(); 
    });
    
    orderInput.addEventListener("change", () => { 
      updateCharts(); 
      startAnimation(); 
    });
  });

// 1. 3D Potential Energy Surface
  function init3DVisualization() {
    const container = document.getElementById('energy3d-container');
    const width = container.clientWidth;
    const height = Math.min(500, window.innerHeight * 0.6);
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    
    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(5, 5, 5);
    
    // Surface creation
    const createSurface = (type) => {
      let geometry;
      if (type === 'simple') {
        const pts = Array.from({length: 20}, (_, i) => 
          new THREE.Vector2((i/20)*8, Math.exp(-i/5)*5));
        geometry = new THREE.LatheGeometry(pts, 20);
      } else {
        geometry = new THREE.ParametricGeometry((u, v, target) => {
          u = u*2 - 1;
          target.x = u*5;
          target.y = type === 'complex' 
            ? Math.sin(u*Math.PI)*3 + Math.sin(v*2)*0.5
            : Math.exp(-u*u*2)*4 + Math.sin(v*3)*0.3;
          target.z = v*2;
        }, 50, 50);
      }
      return new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
        color: 0x1f77b4, transparent: true, opacity: 0.9
      }));
    };
    
    let surface = createSurface('simple');
    scene.add(surface);
    scene.add(new THREE.AxesHelper(5));
    scene.add(new THREE.DirectionalLight(0xffffff, 1));
    scene.add(new THREE.AmbientLight(0x404040));
    
    // Event handlers
    document.getElementById('surface-type').onchange = () => {
      scene.remove(surface);
      surface = createSurface(document.getElementById('surface-type').value);
      scene.add(surface);
    };
    
    let rotate = false;
    document.getElementById('rotate-btn').onclick = () => {
      rotate = !rotate;
      document.getElementById('rotate-btn').textContent = 
        rotate ? 'Stop Rotation' : 'Auto Rotation';
    };
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      if (rotate) surface.rotation.y += 0.005;
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }

  // 2. Reaction Time Calculator
  function setupCalculator() {
    document.getElementById('calculate-btn').onclick = () => {
      const A0 = +document.getElementById('initial-conc').value;
      const A = +document.getElementById('final-conc').value;
      const k = +document.getElementById('rate-const').value;
      const order = document.getElementById('reaction-order').value;
      
      let time, equation;
      if (order === '0') {
        time = (A0 - A)/k;
        equation = `([A]₀ - [A])/k = (${A0} - ${A})/${k}`;
      } else if (order === '1') {
        time = Math.log(A0/A)/k;
        equation = `ln([A]₀/[A])/k = ln(${A0}/${A})/${k}`;
      } else {
        time = (1/A - 1/A0)/k;
        equation = `(1/[A] - 1/[A]₀)/k = (1/${A} - 1/${A0})/${k}`;
      }
      
      document.getElementById('calculated-time').textContent = 
        `Time required: ${time.toFixed(2)} s`;
      document.getElementById('reaction-equation').textContent = 
        `Equation: ${equation}`;
    };
  }

  // 3. Half-Life Comparison Chart
  function setupHalfLifeChart() {
    const margin = {top: 30, right: 30, bottom: 50, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const svg = d3.select("#half-life-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Add axes
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`);
    
    svg.append("g")
      .attr("class", "y-axis");
    
    // Add lines for each order
    const lineColors = ['#e74c3c', '#3498db', '#2ecc71'];
    const lines = lineColors.map((color, i) => {
      return svg.append("path")
        .attr("class", `line line-${i}`)
        .attr("stroke", color)
        .attr("fill", "none")
        .attr("stroke-width", 2);
    });
    
    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 150},20)`);
    
    ['Zero Order', 'First Order', 'Second Order'].forEach((label, i) => {
      legend.append("rect")
        .attr("x", 0)
        .attr("y", i * 20)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", lineColors[i]);
      
      legend.append("text")
        .attr("x", 15)
        .attr("y", i * 20 + 9)
        .text(label)
        .attr("font-size", "12px");
    });
    
    // Update function
    function updateChart() {
      const maxConc = +document.getElementById('conc-range').value;
      const k = +document.getElementById('k-range').value;
      
      document.getElementById('conc-range-value').textContent = maxConc.toFixed(1);
      document.getElementById('k-range-value').textContent = k.toFixed(2);
      
      const x = d3.scaleLinear()
        .domain([0.1, maxConc])
        .range([0, width]);
      
      const data = d3.range(0.1, maxConc, 0.1).map(conc => ({
        conc,
        t12: [
          conc/(2*k),      // Zero order
          Math.log(2)/k,   // First order
          1/(k*conc)       // Second order
        ]
      }));
      
      const maxT12 = d3.max(data, d => Math.max(...d.t12));
      const y = d3.scaleLinear()
        .domain([0, maxT12 * 1.1])
        .range([height, 0]);
      
      // Update lines
      lines.forEach((line, i) => {
        line.datum(data)
          .attr("d", d3.line()
            .x(d => x(d.conc))
            .y(d => y(d.t12[i]))
          );
      });
      
      // Update axes
      svg.select(".x-axis").call(d3.axisBottom(x));
      svg.select(".y-axis").call(d3.axisLeft(y));
      
      // Add axis labels
      svg.select(".x-axis-label").remove();
      svg.select(".y-axis-label").remove();
      
      svg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width)
        .attr("y", height + 40)
        .attr("text-anchor", "end")
        .text("Initial Concentration [A]₀ (M)");
      
      svg.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("text-anchor", "end")
        .text("Half-Life (s)");
    }
    
    // Set up event listeners
    document.getElementById('conc-range').addEventListener('input', updateChart);
    document.getElementById('k-range').addEventListener('input', updateChart);
    
    // Initial render
    updateChart();
  }

  onMount(() => {
    init3DVisualization();
    setupCalculator();
    setupHalfLifeChart();
  });
</script>
<style>
  nav {
    background: #003366;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    font-family: 'Inter', sans-serif;
  }
  
  nav ul {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
    justify-content: center;
  }
  
  nav a {
    text-decoration: none;
    color: #ffffff;
    font-weight: 500;
    font-size: 1rem;
    transition: color 0.3s;
    padding: 0.5rem 1rem;
    border-radius: 4px;
  }
  
  nav a:hover {
    color: #aad4ff;
    background: rgba(255,255,255,0.1);
  }

  .page {
    padding: 2rem;
    max-width: 1000px;
    margin: 2rem auto;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    position: relative;
    font-family: 'Inter', sans-serif;
    color: #333;
  }

  .page h1 {
    color: #003366;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    font-size: 2rem;
    border-bottom: 2px solid #e3f2f9;
    padding-bottom: 0.5rem;
  }

  .page h2 {
    color: #005b9f;
    margin: 2rem 0 1rem;
    font-size: 1.5rem;
  }

  .page h3 {
    color: #0077cc;
    margin: 1.5rem 0 0.5rem;
    font-size: 1.2rem;
  }

  .theory-section {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    border-left: 4px solid #0077cc;
  }

  .order-types {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin: 1.5rem 0;
  }

  .order-card {
    background: white;
    padding: 1.2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    border-top: 3px solid #2c7bb6;
  }

  .order-card h3 {
    margin-top: 0;
    color: #2c7bb6;
  }

  .equation {
    background: #f0f7ff;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    margin: 0.8rem 0;
    display: inline-block;
    color: #d35400;
  }

  .controls {
    background: #e3f2f9;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .control-group {
    margin-bottom: 1rem;
  }

  .control-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #005b9f;
  }

  .slider {
    width: 100%;
    max-width: 400px;
    height: 8px;
    border-radius: 4px;
    background: #d1e3f6;
    outline: none;
    -webkit-appearance: none;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #0077cc;
    cursor: pointer;
  }

  .order-select {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #b3d7ff;
    background: white;
    font-size: 1rem;
    margin-left: 0.5rem;
  }

  .value-display {
    display: inline-block;
    min-width: 40px;
    font-weight: bold;
    color: #003366;
  }

  .rate-law {
    background: #f0f7ff;
    padding: 1.2rem;
    border-radius: 8px;
    border-left: 4px solid #0077cc;
    margin-bottom: 2rem;
  }

  .rate-law code {
    background: #e3f2f9;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    color: #d35400;
  }

  .visualization-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .chart-container {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  }

  .chart-container h3 {
    margin-top: 0;
    text-align: center;
  }

  .molecular-view {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  }

  svg {
    display: block;
    margin: 0 auto;
    background: white;
    border-radius: 4px;
  }

  .axis-label {
    fill: #555;
    font-size: 0.9rem;
  }

  .chart-title {
    fill: #003366;
    font-size: 1.1rem;
    font-weight: bold;
  }

  .characteristics-section {
    margin-top: 3rem;
  }

  .order-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.95rem;
  }

  .order-table th, .order-table td {
    padding: 0.8rem;
    text-align: center;
    border: 1px solid #ddd;
  }

  .order-table th {
    background: #0077cc;
    color: white;
    font-weight: 500;
  }

  .order-table tr:nth-child(even) {
    background: #f0f7ff;
  }

  .order-table tr:hover {
    background: #e3f2f9;
  }

  @media (max-width: 768px) {
    .page {
      padding: 1rem;
    }
    
    .order-types {
      grid-template-columns: 1fr;
    }
    
    svg {
      width: 100%;
      height: auto;
    }
  }

 .advanced-tools {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
  }
  
  h1 {
    color: #2c3e50;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2.2rem;
  }
  
  h2 {
    color: #3498db;
    margin-top: 2.5rem;
    border-bottom: 2px solid #ecf0f1;
    padding-bottom: 0.5rem;
  }
  
  .tool-section {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .info-box {
    background: #f8f9fa;
    border-left: 4px solid #3498db;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 0 4px 4px 0;
  }
  
  /* Estilos para a visualização 3D */
  #energy3d-container {
    width: 100%;
    height: 500px;
    background: #f5f7fa;
    border-radius: 4px;
    margin: 1rem 0;
    position: relative;
  }
  
  .controls-3d {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    align-items: center;
  }
  
  .controls-3d select, .controls-3d button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    background: white;
  }
  
  .controls-3d button {
    background: #3498db;
    color: white;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .controls-3d button:hover {
    background: #2980b9;
  }
  
  /* Estilos para a calculadora */
  .calculator-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin: 1.5rem 0;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
  }
  
  .input-group label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
  }
  
  .input-group input, .input-group select {
    padding: 0.7rem;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  
  #calculate-btn {
    grid-column: span 2;
    padding: 0.8rem;
    background: #2ecc71;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  #calculate-btn:hover {
    background: #27ae60;
  }
  
  .result-box {
    grid-column: span 2;
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 4px;
    border-left: 4px solid #2ecc71;
  }
  
  .result-box h3 {
    margin-top: 0;
    color: #2c3e50;
  }
  
  #calculated-time {
    font-size: 1.2rem;
    font-weight: bold;
    color: #e74c3c;
  }
  
  /* Estilos para o gráfico de meia-vida */
  #half-life-chart {
    margin: 1.5rem 0;
  }
  
  .controls-chart {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
  }
  
  .controls-chart label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }
  
  .controls-chart input[type="range"] {
    flex-grow: 1;
    max-width: 200px;
  }
  
  .line {
    fill: none;
    stroke-width: 2px;
  }
  
  .line0 {
    stroke: #e74c3c;
  }
  
  .line1 {
    stroke: #3498db;
  }
  
  .line2 {
    stroke: #2ecc71;
  }
  
  @media (max-width: 768px) {
    .calculator-grid {
      grid-template-columns: 1fr;
    }
    
    #calculate-btn, .result-box {
      grid-column: span 1;
    }
    
    .controls-chart {
      flex-direction: column;
      gap: 1rem;
    }
    
    #energy3d-container {
      height: 350px;
    }
  }


  /* Base Styles */
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background: #f5f7fa;
    color: #333;
  }
  
  main {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  /* Tool Section Styling */
  .tool-section {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  h2 {
    color: #2c3e50;
    margin-top: 0;
    border-bottom: 2px solid #ecf0f1;
    padding-bottom: 0.5rem;
  }
  
  .info-box {
    background: #f8f9fa;
    border-left: 4px solid #3498db;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 0 4px 4px 0;
  }
  
  /* 3D Visualization Styles */
  #energy3d-container {
    width: 100%;
    height: 500px;
    background: #f5f7fa;
    border-radius: 4px;
    margin: 1rem 0;
  }
  
  /* Calculator Styles */
  .calculator-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin: 1.5rem 0;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
  }
  
  .input-group label {
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  #calculate-btn {
    grid-column: span 2;
    background: #2ecc71;
    color: white;
    border: none;
    padding: 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  #calculate-btn:hover {
    background: #27ae60;
  }
  
  .result-box {
    grid-column: span 2;
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 4px;
    border-left: 4px solid #2ecc71;
  }
  
  /* Half-Life Chart Styles */
  #half-life-chart svg {
    display: block;
    margin: 0 auto;
    background: white;
    border-radius: 4px;
  }
  
  .line {
    fill: none;
    stroke-width: 2;
  }
  
  .line.zero {
    stroke: #e74c3c;
  }
  
  .line.first {
    stroke: #3498db;
  }
  
  .line.second {
    stroke: #2ecc71;
  }
  
  .legend {
    font-size: 0.9rem;
  }
  
  .legend.zero {
    fill: #e74c3c;
  }
  
  .legend.first {
    fill: #3498db;
  }
  
  .legend.second {
    fill: #2ecc71;
  }
  
  /* Controls Styling */
  .controls {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
  }
  
  .controls label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .calculator-grid {
      grid-template-columns: 1fr;
    }
    
    #calculate-btn, .result-box {
      grid-column: span 1;
    }
    
    .controls {
      flex-direction: column;
      gap: 1rem;
    }
    
    #energy3d-container {
      height: 350px;
    }
  }

</style>