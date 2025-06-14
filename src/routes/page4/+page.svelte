<script>
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import EnergyProfile from './components/EnergyProfile.svelte';
  import CatalystSurface from './components/CatalystSurface.svelte';
  import ReactionRateChart from './components/ReactionRateChart.svelte';
  import CatalystTypes from './components/CatalystTypes.svelte';

  $: isActive = (path) => {
    // Remove a barra final para consistência
    const currentPath = $page.url.pathname.replace(/\/$/, '');
    const comparePath = `${base}${path}`.replace(/\/$/, '');
    return currentPath === comparePath;
  };
  
  let showExplanation = false;
</script>

<svelte:head>
  <title>Chemical Kinetics - Catalysts</title>
</svelte:head>

<nav class="main-nav">
  <a href="{base}/" class={isActive('/') ? 'active' : ''}>Home</a>
  <a href="{base}/page0" class={isActive('/page0') ? 'active' : ''}>Introduction</a>
  <a href="{base}/page1" class={isActive('/page1') ? 'active' : ''}>Reaction Orders</a>
  <a href="{base}/page2" class={isActive('/page2') ? 'active' : ''}>Activation Energy</a>
  <a href="{base}/page3" class={isActive('/page3') ? 'active' : ''}>Simulation</a>
  <a href="{base}/page4" class={isActive('/page4') ? 'active' : ''}>Catalyst Effect</a>
  <a href="{base}/page5" class={isActive('/page5') ? 'active' : ''}>Radioactivity</a>
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

  <EnergyProfile />

  <CatalystSurface />

  <ReactionRateChart bind:showExplanation />

  <CatalystTypes />
</main>

<style>
  @import './styles/page4.css';
</style>