<svelte:head>
  <title>Chemical Reaction Visualizer</title>
</svelte:head>

<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/page0">Introduction</a></li>
    <li><a href="/page1">Reaction Orders</a></li>
    <li><a href="/page2">Activation Energy</a></li>
    <li><a href="/page3">Reaction Mechanism</a></li>
    <li><a href="/page4">Catalyst Effect</a></li>
    <li><a href="/page5">Radioactivity</a></li>
  </ul>
</nav>

<div id="content">
  <h1>Chemical Kinetics Visualizer</h1>
  <p>
    This interactive tool helps you visualize chemical reactions step-by-step, including kinetics, activation energy,
    reaction mechanisms, and catalyst effects. It allows users to manipulate variables such as concentration,
    temperature, and catalysts to observe the effect on reaction rates.
  </p>
</div>

<div class="team-info">
  <h2>Project Team</h2>
  <p>
    This project was developed by a dedicated team of Data Science and Artificial Intelligence students. We have
    worked together to bring an intuitive and informative experience for understanding chemical reactions.
  </p>
  <ul>
    <li>
      <span>Integrante 1:</span>
      <a href="https://www.linkedin.com/in/anajuliaamaropereirarocha/" target="_blank" rel="noopener noreferrer">
        Ana Júlia Amaro Pereira Rocha
      </a>
    </li>
    <li>
      <span>Integrante 2:</span>
      <a href="https://www.linkedin.com/in/eduardammag/" target="_blank" rel="noopener noreferrer">
        Maria Eduarda Mesquita Magalhães
      </a>
    </li>
    <li>
      <span>Integrante 3:</span>
      <a href="https://www.linkedin.com/in/ramyro-correa-aquines/" target="_blank" rel="noopener noreferrer">
        Ramyro Corrêa Aquines
      </a>
    </li>
  </ul>
</div>

<footer>
  <p>&copy; 2025 Chemical Reaction Visualizer | All rights reserved</p>
</footer>

<style>
  nav ul {
    display: flex;
    gap: 1rem;
    list-style: none;
    padding: 0;
  }

  nav a {
    text-decoration: none;
    color: #0077cc;
    font-weight: bold;
  }

  #content {
    padding: 2rem;
    background: #f9f9f9;
  }

  .team-info {
    padding: 2rem;
    background: #eaf3f9;
  }

  .team-info ul {
    padding-left: 1rem;
  }

  .team-info li {
    margin-bottom: 0.5rem;
  }

  footer {
    margin-top: 2rem;
    text-align: center;
    color: #777;
    font-size: 0.9rem;
    border-top: 1px solid #ccc;
    padding: 1rem;
  }
</style>
