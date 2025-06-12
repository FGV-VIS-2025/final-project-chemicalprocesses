<script>
  import ArrheniusChart from '$lib/components/ArrheniusChart.svelte';
  import ParticleAnimation from '$lib/components/ParticleAnimation.svelte';
  import CollisionChart from '$lib/components/CollisionChart.svelte';
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Import OrbitControls

  let currentPage = $page.url.pathname;
  let Ea = 50;
  let A_slider = 5;
  $: A = A_slider * 1e13;
  let T = 300;
  let T1 = 200;
  let T2 = 500;
  let showMarker = true;

  let running = false;
  let restartKey = 0;
  let chartKey = 0;

  let collisionHistory1 = [];
  let collisionHistory2 = [];

  // 3D chart controls
  let rotate3D = true;
  let showElementary = true;
  let showFirstOrder = true;
  let showCatalyzed = true;

  // Three.js variables
  let scene, camera, renderer, controls, animationFrameId;
  let containerDiv; // Reference to the div where the Three.js canvas will be
  let elementarySurface, firstOrderSurface, catalyzedSurface; // Meshes for each surface

  // Particle animation interval (from original code)
  let animationInterval;

  onMount(() => {
    console.log("Container Div onMount:", containerDiv); // Verificação importante
    if (containerDiv) {
        initThreeJs();
        animateThreeJs();
        // Add event listener for window resize to handle responsiveness
        window.addEventListener('resize', onWindowResize);
    } else {
        console.error("Container div not found for Three.js initialization. Three.js will not render.");
    }

    return () => {
      // Clean up on component destroy
      window.removeEventListener('resize', onWindowResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (renderer) {
        // Dispose of renderer and its DOM element
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode === containerDiv) {
            containerDiv.removeChild(renderer.domElement);
        }
      }
      // Cleanup for particle animation interval (from original code)
      if (animationInterval) clearInterval(animationInterval);
    };
  });

  onDestroy(() => {
    // Ensure animation and Three.js resources are cleaned up
    // This is often redundant if onMount's return function handles it,
    // but good for robustness or if onMount doesn't complete.
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (renderer) {
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode === containerDiv) {
          containerDiv.removeChild(renderer.domElement);
      }
    }
    if (animationInterval) clearInterval(animationInterval); // Ensure interval is cleared on destroy (from original code)
  });

  function toggleRunning() {
    running = !running;
  }

  function restartSimulation() {
    restartKey += 1;
    chartKey += 1;
    collisionHistory1 = [];
    collisionHistory2 = [];
  }

  // --- Three.js Functions ---

  function initThreeJs() {
    console.log("Initializing Three.js...");
    if (!containerDiv) {
        console.error("Container div was null in initThreeJs. Aborting initialization.");
        return;
    }

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); // Light grey background

    // Camera
    camera = new THREE.PerspectiveCamera(75, containerDiv.clientWidth / containerDiv.clientHeight, 0.1, 1000);
    camera.position.set(2, 2, 4); // Adjusted camera position for better view

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerDiv.clientWidth, containerDiv.clientHeight);
    containerDiv.appendChild(renderer.domElement);
    console.log("Three.js canvas appended to containerDiv:", renderer.domElement);


    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // An animation loop is required when damping is enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below the ground
    // controls.autoRotate = rotate3D; // Can be set here, or managed manually in animateThreeJs

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Initial drawing of surfaces
    drawPotentialEnergySurfaceThreeJs();
  }

  function onWindowResize() {
    if (!containerDiv || !camera || !renderer) return; // Safeguard
    camera.aspect = containerDiv.clientWidth / containerDiv.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(containerDiv.clientWidth, containerDiv.clientHeight);
    // No explicit render call needed here as animateThreeJs runs continuously
    // but good practice if you only render on demand
  }

  function animateThreeJs() {
    animationFrameId = requestAnimationFrame(animateThreeJs);

    if (controls) {
        if (rotate3D) {
            // Apply auto-rotation if desired
            controls.autoRotate = true;
            controls.autoRotateSpeed = 2.0; // Adjust speed as needed
        } else {
            controls.autoRotate = false;
        }
        controls.update(); // Required if controls.enableDamping or controls.autoRotate are true
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
  }

  function createSurface(zData, color, name) {
    // Corrected: segments should be equal to steps for 51x51 points
    const steps = 50; // Number of divisions used when generating zData
    const segments = steps; // Number of segments for PlaneGeometry to match steps+1 vertices

    const geometry = new THREE.PlaneGeometry(10, 10, segments, segments); // Adjusted size to match data range (8 is too small for -2 to 8)
    geometry.rotateX(-Math.PI / 2); // Orient the plane to be horizontal

    const xRange = 10; // Corresponds to original x[i] = i/steps * 10 - 2 (range 10 units: 8 - (-2))
    const yRange = 10; // Corresponds to original y[i] = i/steps * 10 - 2 (range 10 units)
    const xMin = -2;
    const yMin = -2;

    const vertices = geometry.attributes.position.array;
    for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
        // Normalize the vertex position from PlaneGeometry's default (-width/2 to width/2) to (0 to 1)
        // geometry.parameters.width/2 because PlaneGeometry is centered at 0,0
        const u = (vertices[i + 0] + (geometry.parameters.width / 2)) / geometry.parameters.width; // Normalized X (0 to 1)
        const v = (vertices[i + 2] + (geometry.parameters.height / 2)) / geometry.parameters.height; // Normalized Y (0 to 1)

        // Map normalized (0-1) position to zData array indices (0 to steps)
        // Ensure indices are within bounds (0 to steps)
        const dataX = Math.round(u * steps); // Rounds to the nearest integer index
        const dataY = Math.round(v * steps); // Rounds to the nearest integer index

        // Assign Z value (potential energy) from zData
        // Add a small offset to the Z value to visually separate overlapping surfaces
        const zOffset = 0.01; // Small offset
        vertices[i + 1] = zData[dataY][dataX] + zOffset; // zData is [row][col]
    }
    geometry.computeVertexNormals(); // For lighting

    const material = new THREE.MeshPhongMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        specular: 0x111111,
        shininess: 30,
        flatShading: true, // Gives a faceted look
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name; // For easy identification

    // Center the geometry to align with your original data range (-2 to 8)
    // PlaneGeometry is centered at 0,0. Its actual x-range is -5 to 5.
    // Your data range is -2 to 8 (length 10).
    // To align, shift by (x_min_data + x_max_data)/2 = (-2+8)/2 = 3
    // Shift PlaneGeometry's center from 0 to 3.
    mesh.position.set( (xMin + xRange / 2), 0, (yMin + yRange / 2)); // Shift to align with data origin/center
                                                                     // (xMin + width/2) = -2 + 5 = 3
    return mesh;
  }

  function drawPotentialEnergySurfaceThreeJs() {
    console.log("Drawing Potential Energy Surfaces (Three.js)...");
    // Clear existing surfaces from the scene
    // Dispose of geometry and material to prevent memory leaks
    scene.children.forEach(child => {
        if (child.isMesh && (child.name === 'elementary' || child.name === 'firstOrder' || child.name === 'catalyzed')) {
            scene.remove(child);
            child.geometry.dispose();
            child.material.dispose();
        }
    });


    // Generate Z data (same logic as before)
    const steps = 50; // Number of divisions in x and y (for PlaneGeometry this is segments+1)
    const x = [], y = [], zElementary = [], zFirstOrder = [], zCatalyzed = [];


    for (let i = 0; i <= steps; i++) {
      x[i] = i/steps * 10 - 2; // Range -2 to 8
      y[i] = i/steps * 10 - 2; // Range -2 to 8
    }

    for (let i = 0; i <= steps; i++) {
      zElementary[i] = [];
      zFirstOrder[i] = [];
      zCatalyzed[i] = [];
      for (let j = 0; j <= steps; j++) {
        const xVal = x[j]; // Note: used j for x-coordinate to match array indexing [row][col] where col is x
        const yVal = y[i]; // used i for y-coordinate

        const xMinus3 = xVal - 3;
        const yMinus3 = yVal - 3;
        const xMinus7 = xVal - 7;
        const yMinus7 = yVal - 7;

        zElementary[i][j] = 3 * Math.exp(-(xMinus3*xMinus3) - (yMinus3*yMinus3)) +
                            0.5 * Math.exp(-(xMinus7*xMinus7) - (yMinus7*yMinus7));

        const xMinus2 = xVal - 2;
        const yMinus2 = yVal - 2;
        const xMinus5 = xVal - 5;
        const yMinus5 = yVal - 5;
        const xMinus8 = xVal - 8;
        const yMinus8 = yVal - 8;

        zFirstOrder[i][j] = 2 * Math.exp(-(xMinus2*xMinus2) - (yMinus2*yMinus2)) +
                            1.5 * Math.exp(-(xMinus5*xMinus5) - (yMinus5*yMinus5)) +
                            0.5 * Math.exp(-(xMinus8*xMinus8) - (yMinus8*yMinus8));

        zCatalyzed[i][j] = 1.5 * Math.exp(-(xMinus3*xMinus3) - (yMinus3*yMinus3)) +
                           1.2 * Math.exp(-(xMinus5*xMinus5) - (yMinus5*yMinus5)) +
                           0.3 * Math.exp(-(xMinus8*xMinus8) - (yMinus8*yMinus8));
      }
    }

    // Create and add surfaces if selected
    if (showElementary) {
      elementarySurface = createSurface(zElementary, 0x008000, 'elementary'); // Green
      scene.add(elementarySurface);
    }
    if (showFirstOrder) {
      firstOrderSurface = createSurface(zFirstOrder, 0x0000ff, 'firstOrder'); // Blue
      scene.add(firstOrderSurface);
    }
    if (showCatalyzed) {
      catalyzedSurface = createSurface(zCatalyzed, 0xff0000, 'catalyzed'); // Red
      scene.add(catalyzedSurface);
    }

    // If controls exist, update them after adding/removing meshes
    if (controls) {
        controls.update();
    }
  }

  // Reactive statement to redraw when controls change
  $: {
    // Only redraw if Three.js is initialized and any of the relevant control variables change
    if (scene && renderer && camera && (showElementary !== undefined || showFirstOrder !== undefined || showCatalyzed !== undefined || rotate3D !== undefined)) {
        // A simple check like 'showElementary !== undefined' ensures the reactive block runs after these variables are set
        // However, Svelte's reactivity usually handles this well.
        // The most critical part is ensuring scene, renderer, camera are initialized.
        drawPotentialEnergySurfaceThreeJs();
    }
  }
</script>

<svelte:head>
  <title>Activation Energy</title>
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

<main class="page" id="page2">
  <h1>
    <span class="chem-icon">⚗️</span> Activation Energy
  </h1>

  <p>
    This page illustrates the concept of **activation energy** using the Arrhenius equation
    and dynamic simulations. You can explore how temperature affects the likelihood of particles gaining
    enough energy to react.
  </p>

  <div class="controls">
    <label>
      <span>Activation Energy (Ea):</span>
      <input type="range" min="20" max="100" bind:value={Ea} />
      <span>{Ea} kJ/mol</span>
    </label>

    <label>
      <span>Pre-exponential Factor (A):</span>
      <input type="range" min="1" max="10" step="0.1" bind:value={A_slider} />
      <span>{A_slider.toFixed(1)} × 10<sup>13</sup> s<sup>-1</sup></span>
    </label>

    <label>
      <span>Temperature for Arrhenius Chart (T):</span>
      <input type="range" min="200" max="500" bind:value={T} />
      <span>{T} K</span>
    </label>
  </div>

  <p>
    The chart below shows the **Arrhenius equation**, which models the rate constant k
    as a function of temperature and activation energy. The marker highlights the current value of k
    for the selected temperature T.
  </p>

  <div class="chart-container">
    <ArrheniusChart {Ea} {A} {T} {showMarker} />
  </div>

  <div class="content-section">
    <h2>Particle Animation & Collision Graph</h2>

    <p>
      The following animations simulate particles at two different temperatures. Each particle has a chance
      to overcome the activation energy barrier and become "activated". You can adjust T_1 and T_2
      to observe how increasing temperature affects activation.
    </p>

    <div class="controls">
      <label>
        <span>Temperature T₁:</span>
        <input type="range" min="200" max="500" bind:value={T1} />
        <span>{T1} K</span>
      </label>

      <label>
        <span>Temperature T₂:</span>
        <input type="range" min="200" max="500" bind:value={T2} />
        <span>{T2} K</span>
      </label>

      <div class="animation-controls">
        <button on:click={toggleRunning} class="action-btn">
          {running ? "Pause Animation" : "Start/Resume Animation"}
        </button>
        <button on:click={restartSimulation} class="action-btn">
          Restart Simulation
        </button>
      </div>
    </div>

    <p>
      The particles are initialized with random positions and velocities, and they collide with each other.
      When a particle's energy exceeds the activation energy (Ea), it is marked as "activated" and changes color.
      In the animations below, the particles do not follow straight paths. Instead, they move in a random, jittery way, simulating
      what is known as **Brownian motion**. This phenomenon occurs when small particles are constantly bombarded by
      molecules in a fluid, causing erratic movement. It helps illustrate how thermal energy translates into microscopic motion,
      and how higher temperatures increase the chances of particles overcoming the activation barrier.
    </p>

    <div class="side-by-side" style="margin-top: -1rem">
      <div class="sim-header">
        <h4>Simulation T₁ = {T1} K</h4>
        <div class="color-legend">
          <div><span class="color-box blue"></span> Not yet activated</div>
          <div><span class="color-box orange"></span> Activated</div>
        </div>
        <ParticleAnimation
          {Ea}
          {A}
          T={T1}
          {running}
          triggerRestart={restartKey}
          on:collisionUpdate={(e) => collisionHistory1 = [...collisionHistory1, e.detail]}
        />
      </div>
      <div class="sim-header">
        <h4>Simulation T₂ = {T2} K</h4>
        <div class="color-legend">
          <div><span class="color-box blue"></span> Not yet activated</div>
          <div><span class="color-box orange"></span> Activated</div>
        </div>
        <ParticleAnimation
          {Ea}
          {A}
          T={T2}
          {running}
          triggerRestart={restartKey}
          on:collisionUpdate={(e) => collisionHistory2 = [...collisionHistory2, e.detail]}
        />
      </div>
    </div>

    <p>
      The graph below compares the number of activated collisions over time for both simulations. You can
      hover over the lines to inspect the number of collisions at each moment.
    </p>

    <div style="margin-top: 3rem; display: flex; justify-content: center;">
      {#key chartKey}
        <CollisionChart history1={collisionHistory1} history2={collisionHistory2} />
      {/key}
    </div>
  </div>

  <div class="content-section">
    <h2>Potential Energy Surfaces for Different Reaction Types (Three.js)</h2>

    <p>
      The 3D visualization below shows potential energy surfaces for different types of chemical reactions, rendered using Three.js.
      The surface represents how the potential energy changes as reactants transform into products.
    </p>

    <div class="controls">
      <label>
        <input type="checkbox" bind:checked={rotate3D} />
        <span>Auto-rotate 3D view</span>
      </label>
      <div class="surface-options">
        <label>
          <input type="checkbox" bind:checked={showElementary} />
          <span>Elementary Reactions</span>
        </label>
        <label>
          <input type="checkbox" bind:checked={showFirstOrder} />
          <span>First-Order Reactions</span>
        </label>
        <label>
          <input type="checkbox" bind:checked={showCatalyzed} />
          <span>Catalyzed Reactions</span>
        </label>
      </div>
    </div>

    <div bind:this={containerDiv} style="width: 100%; height: 500px; background-color: #f0f0f0; border: 1px solid #ccc;"></div>

    <div class="reaction-explanations">
      <div class:explanation-box-active={showElementary} class="explanation-box">
        <h3>Elementary Reactions</h3>
        <p>
          Elementary reactions occur in a single step with a single transition state (the peak in the energy surface).
          The activation energy (Ea) is the energy difference between reactants and this transition state.
          These reactions follow a simple energy landscape with one clear energy barrier.
        </p>
      </div>

      <div class:explanation-box-active={showFirstOrder} class="explanation-box">
        <h3>First-Order Reactions</h3>
        <p>
          First-order reactions often show more complex energy landscapes where the rate depends on the concentration
          of only one reactant. The energy surface may show intermediate states before reaching the final products,
          with multiple small energy barriers along the reaction pathway.
        </p>
      </div>

      <div class:explanation-box-active={showCatalyzed} class="explanation-box">
        <h3>Catalyzed Reactions</h3>
        <p>
          Catalyzed reactions have a different pathway with lower activation energy. The catalyst provides an alternative
          route for the reaction, often with multiple intermediate steps, but the overall energy barrier is reduced.
          This allows the reaction to proceed faster at the same temperature.
        </p>
      </div>
    </div>
  </div>
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
    padding: 2rem;
    max-width: 900px;
    margin: 2rem auto;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
  }

  h1 {
    color: #003366;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }

  .controls {
    background: #e3f2f9;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .controls label {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  .controls input[type="range"] {
    width: 100%;
    margin: 0.5rem 0;
  }

  .chart-container {
    margin: 2rem 0;
  }

  .animation-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
  }

  .action-btn {
    background: #003366;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-family: sans-serif;
    transition: background-color 0.3s;
    min-width: 180px;
  }

  .action-btn:hover {
    background: #003366;
  }

  .side-by-side {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: flex-start;
  }

  .sim-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .color-legend {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    font-weight: bold;
    color: #333;
  }

  .color-box {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 3px;
    margin-right: 0.3rem;
    vertical-align: middle;
  }

  .color-box.blue {
    background-color: #003366;
  }

  .color-box.orange {
    background-color: orange;
  }

  .surface-options {
    display: flex;
    gap: 1.5rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }

  .surface-options label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .reaction-explanations {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .explanation-box {
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #e3f2f9;
    transition: all 0.3s ease;
  }

  .explanation-box-active {
    border-left-color: #003366;
    background: #e3f2f9;
  }

  .explanation-box h3 {
    color: #003366;
    margin-top: 0;
  }

  @media (max-width: 600px) {
    .side-by-side {
      flex-direction: column;
    }

    .animation-controls {
      flex-direction: column;
    }

    nav a {
      width: 100%;
      text-align: center;
    }

    .reaction-explanations {
      grid-template-columns: 1fr;
    }
  }
</style>