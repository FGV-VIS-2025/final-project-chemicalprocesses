<svelte:head>
  <title>Page 3 - Simulation</title>
</svelte:head>

<nav class="main-nav">
  <a href="/" class={currentPage === '/' ? 'active' : ''}>Home</a>
  <a href="/page0" class={currentPage === '/page0' ? 'active' : ''}>Introduction</a>
  <a href="/page1" class={currentPage === '/page1' ? 'active' : ''}>Reaction Orders</a>
  <a href="/page2" class={currentPage === '/page2' ? 'active' : ''}>Activation Energy</a>
  <a href="/page3" class={currentPage === '/page3' ? 'active' : ''}>Simulation</a>
  <a href="/page4" class={currentPage === '/page4' ? 'active' : ''}>Catalyst Effect</a>
  <a href="/page5" class={currentPage === '/page5' ? 'active' : ''}>Radioactivity</a>
</nav>

<main class="page" id="page5">
  <h1>
    <span class="chem-icon">☢️</span> Interactive Radioactive Decay Simulator
  </h1>

  <div class="controls">
    <div id="chat">
      {#each chatMessages as message}
        <p class:bot-msg={message.type === 'bot'}>
          {message.text}
        </p>
      {/each}
    </div>

    <div id="options">
      {#each optionsContent as option}
        {#if option.type === 'button'}
          <button on:click={option.action}>{option.text}</button>
        {:else if option.type === 'input'}
          <label>
            {option.label || ''}
            <input 
              type={option.inputType} 
              id={option.id} 
              placeholder={option.placeholder || ''} 
              min={option.min} 
              max={option.max} 
              value={option.value || ''}
            />
          </label>
        {:else if option.type === 'select'}
          <label>
            {option.label || ''}
            <select id={option.id}>
              {#each option.options as opt}
                <option value={opt.value} selected={opt.value === option.selected}>{opt.text}</option>
              {/each}
            </select>
          </label>
        {:else if option.type === 'label'}
          <label>{option.text}</label>
        {/if}
      {/each}
    </div>
  </div>

  <div id="animacao" class="chart-container" style="width: 900px; height: 600px;"></div>


  {#if resultContent}
    <div id="result" class="rate-law">
      <pre>{resultContent}</pre>
    </div>
  {/if}


<!-- NEW SECTION: Natural Radioactive Series -->
  <div class="series-section">
    <h2>Natural Radioactive Decay Series</h2>
    <p>
      These are chains of unstable isotopes that decay through alpha (α) and beta (β) emissions 
      until reaching a stable lead (Pb) isotope. They occur in nature and are key to understanding 
      nuclear chemistry and geology.
    </p>
    
     <div class="series-controls">
    <select bind:value={selectedSeries}>
      {#each Object.keys(seriesData) as serie}
        <option value={serie}>{serie}</option>
      {/each}
    </select>
    
    <div class="animation-controls">
      <button on:click={prevStep} disabled={currentStep === 0}>
        ⏪ Previous
      </button>
      <button on:click={playPause}>
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>
      <button on:click={nextStep} disabled={currentStep === seriesData[selectedSeries].length - 1}>
        ⏩ Next
      </button>
      <button on:click={reset}>
        🔄 Restart
      </button>
    </div>
  </div>

  <div class="series-animation">
    {#each seriesData[selectedSeries] as step, i}
      {#if i <= currentStep}
        <div class="atom" in:fade={{ duration: 300 }}>
          <span class="symbol">{step.symbol}</span>
          <span class="name">{step.name}</span>
          {#if i < currentStep && step.decay}
            <div class="decay-particle {step.decay}">
              {step.decay === 'α' ? 'α' : 'β'}
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>

  <!-- Lista detalhada dos elementos -->
  <!-- Substitua a tabela atual por esta versão simplificada -->
<div class="decay-path">
  <h3>Decay Path Details:</h3>
  <table>
    <thead>
      <tr>
        <th>Isotope</th>
        <th>Decay</th>
        <th>Half-life</th>
      </tr>
    </thead>
    <tbody>
      {#each decayPath as step, i}
        <tr>
          <td>
            <strong>{step.symbol}</strong><br>
            {step.name}
          </td>
          <td class={step.decay || 'stable'}>
            {step.decay ? 
              (step.decay === 'α' ? 'Alpha (α)' : 'Beta (β)') : 
              'Stable'}
          </td>
          <td>{step.halfLife}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>


</main>

<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';
  let currentPage = $page.url.pathname; // Isso identifica a página atual

// Natural radioactive series data
const seriesData = {
  "Uranium-238 (→ Pb-206)": [
    { symbol: "²³⁸U", name: "Uranium-238", decay: null, halfLife: "4.5 billion years" },
    { symbol: "²³⁴Th", name: "Thorium-234", decay: "α", halfLife: "24.1 days" },
    { symbol: "²³⁴Pa", name: "Protactinium-234", decay: "β", halfLife: "6.7 hours" },
    { symbol: "²³⁴U", name: "Uranium-234", decay: "α", halfLife: "245,500 years" },
    { symbol: "²³⁰Th", name: "Thorium-230", decay: "α", halfLife: "75,400 years" },
    { symbol: "²²⁶Ra", name: "Radium-226", decay: "α", halfLife: "1,600 years" },
    { symbol: "²²²Rn", name: "Radon-222", decay: "α", halfLife: "3.8 days" },
    { symbol: "²¹⁸Po", name: "Polonium-218", decay: "α", halfLife: "3.1 minutes" },
    { symbol: "²¹⁴Pb", name: "Lead-214", decay: "β", halfLife: "26.8 minutes" },
    { symbol: "²¹⁴Bi", name: "Bismuth-214", decay: "β", halfLife: "19.9 minutes" },
    { symbol: "²¹⁴Po", name: "Polonium-214", decay: "α", halfLife: "0.16 milliseconds" },
    { symbol: "²¹⁰Pb", name: "Lead-210", decay: "β", halfLife: "22.3 years" },
    { symbol: "²¹⁰Bi", name: "Bismuth-210", decay: "β", halfLife: "5.01 days" },
    { symbol: "²¹⁰Po", name: "Polonium-210", decay: "α", halfLife: "138 days" },
    { symbol: "²⁰⁶Pb", name: "Lead-206", decay: null, halfLife: "Stable" }
  ],
  "Thorium-232 (→ Pb-208)": [
    { symbol: "²³²Th", name: "Thorium-232", decay: null, halfLife: "14 billion years" },
    { symbol: "²²⁸Ra", name: "Radium-228", decay: "α", halfLife: "5.75 years" },
    { symbol: "²²⁸Ac", name: "Actinium-228", decay: "β", halfLife: "6.15 hours" },
    { symbol: "²²⁸Th", name: "Thorium-228", decay: "α", halfLife: "1.91 years" },
    { symbol: "²²⁴Ra", name: "Radium-224", decay: "α", halfLife: "3.66 days" },
    { symbol: "²²⁰Rn", name: "Radon-220", decay: "α", halfLife: "55.6 seconds" },
    { symbol: "²¹⁶Po", name: "Polonium-216", decay: "α", halfLife: "0.15 seconds" },
    { symbol: "²¹²Pb", name: "Lead-212", decay: "β", halfLife: "10.64 hours" },
    { symbol: "²¹²Bi", name: "Bismuth-212", decay: "β", halfLife: "60.6 minutes" },
    { symbol: "²¹²Po", name: "Polonium-212", decay: "α", halfLife: "0.3 µs" },
    { symbol: "²⁰⁸Pb", name: "Lead-208", decay: null, halfLife: "Stable" }
  ],
  "Uranium-235 (→ Pb-207)": [
    { symbol: "²³⁵U", name: "Uranium-235", decay: null, halfLife: "704 million years" },
    { symbol: "²³¹Th", name: "Thorium-231", decay: "α", halfLife: "25.5 hours" },
    { symbol: "²³¹Pa", name: "Protactinium-231", decay: "β", halfLife: "32,760 years" },
    { symbol: "²²⁷Ac", name: "Actinium-227", decay: "α", halfLife: "21.8 years" },
    { symbol: "²²⁷Th", name: "Thorium-227", decay: "α", halfLife: "18.7 days" },
    { symbol: "²²³Ra", name: "Radium-223", decay: "α", halfLife: "11.4 days" },
    { symbol: "²¹⁹Rn", name: "Radon-219", decay: "α", halfLife: "3.96 seconds" },
    { symbol: "²¹⁵Po", name: "Polonium-215", decay: "α", halfLife: "1.78 ms" },
    { symbol: "²¹¹Pb", name: "Lead-211", decay: "β", halfLife: "36.1 minutes" },
    { symbol: "²¹¹Bi", name: "Bismuth-211", decay: "α", halfLife: "2.14 minutes" },
    { symbol: "²⁰⁷Tl", name: "Thallium-207", decay: "β", halfLife: "4.77 minutes" },
    { symbol: "²⁰⁷Pb", name: "Lead-207", decay: null, halfLife: "Stable" }
  ]
};

// Animation logic
// Estados da animação
  let selectedSeries = Object.keys(seriesData)[0];
  let currentStep = 0;
  let isPlaying = false;
  let intervalId;
  let animationSpeed = 1000;
  let decayPath = [];

  // Controles da animação
  function playPause() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      intervalId = setInterval(() => {
        if (currentStep < seriesData[selectedSeries].length - 1) {
          nextStep();
        } else {
          clearInterval(intervalId);
          isPlaying = false;
        }
      }, animationSpeed);
    } else {
      clearInterval(intervalId);
    }
  }

  function nextStep() {
    if (currentStep < seriesData[selectedSeries].length - 1) {
      currentStep += 1;
      updateDecayPath();
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep -= 1;
      updateDecayPath();
    }
  }

  function reset() {
    currentStep = 0;
    decayPath = [];
    if (isPlaying) {
      clearInterval(intervalId);
      isPlaying = false;
    }
  }

  function updateDecayPath() {
    decayPath = seriesData[selectedSeries].slice(0, currentStep + 1);
  }

  // Atualiza o caminho quando a série muda
  $: if (selectedSeries) {
    reset();
    updateDecayPath();
  }



  // Dados básicos da tabela periódica (Z, símbolo, nome)
  const tabelaPeriodica = [
    {Z:1, simbolo:"H", nome:"Hidrogênio"},
    {Z:2, simbolo:"He", nome:"Hélio"},
    {Z:3, simbolo:"Li", nome:"Lítio"},
    {Z:4, simbolo:"Be", nome:"Berílio"},
    {Z:5, simbolo:"B", nome:"Boro"},
    {Z:6, simbolo:"C", nome:"Carbono"},
    {Z:7, simbolo:"N", nome:"Nitrogênio"},
    {Z:8, simbolo:"O", nome:"Oxigênio"},
    {Z:9, simbolo:"F", nome:"Flúor"},
    {Z:10, simbolo:"Ne", nome:"Neônio"},
    {Z:11, simbolo:"Na", nome:"Sódio"},
    {Z:12, simbolo:"Mg", nome:"Magnésio"},
    {Z:13, simbolo:"Al", nome:"Alumínio"},
    {Z:14, simbolo:"Si", nome:"Silício"},
    {Z:15, simbolo:"P", nome:"Fósforo"},
    {Z:16, simbolo:"S", nome:"Enxofre"},
    {Z:17, simbolo:"Cl", nome:"Cloro"},
    {Z:18, simbolo:"Ar", nome:"Argônio"},
    {Z:19, simbolo:"K", nome:"Potássio"},
    {Z:20, simbolo:"Ca", nome:"Cálcio"},
    {Z:21, simbolo:"Sc", nome:"Escândio"},
    {Z:22, simbolo:"Ti", nome:"Titânio"},
    {Z:23, simbolo:"V", nome:"Vanádio"},
    {Z:24, simbolo:"Cr", nome:"Cromo"},
    {Z:25, simbolo:"Mn", nome:"Manganês"},
    {Z:26, simbolo:"Fe", nome:"Ferro"},
    {Z:27, simbolo:"Co", nome:"Cobalto"},
    {Z:28, simbolo:"Ni", nome:"Níquel"},
    {Z:29, simbolo:"Cu", nome:"Cobre"},
    {Z:30, simbolo:"Zn", nome:"Zinco"},
    {Z:31, simbolo:"Ga", nome:"Gálio"},
    {Z:32, simbolo:"Ge", nome:"Germânio"},
    {Z:33, simbolo:"As", nome:"Arsênio"},
    {Z:34, simbolo:"Se", nome:"Selênio"},
    {Z:35, simbolo:"Br", nome:"Bromo"},
    {Z:36, simbolo:"Kr", nome:"Criptônio"},
    {Z:37, simbolo:"Rb", nome:"Rubídio"},
    {Z:38, simbolo:"Sr", nome:"Estrôncio"},
    {Z:39, simbolo:"Y", nome:"Ítrio"},
    {Z:40, simbolo:"Zr", nome:"Zircônio"},
    {Z:41, simbolo:"Nb", nome:"Nióbio"},
    {Z:42, simbolo:"Mo", nome:"Molibdênio"},
    {Z:43, simbolo:"Tc", nome:"Tecnécio"},
    {Z:44, simbolo:"Ru", nome:"Rutênio"},
    {Z:45, simbolo:"Rh", nome:"Ródio"},
    {Z:46, simbolo:"Pd", nome:"Paládio"},
    {Z:47, simbolo:"Ag", nome:"Prata"},
    {Z:48, simbolo:"Cd", nome:"Cádmio"},
    {Z:49, simbolo:"In", nome:"Índio"},
    {Z:50, simbolo:"Sn", nome:"Estanho"},
    {Z:51, simbolo:"Sb", nome:"Antimônio"},
    {Z:52, simbolo:"Te", nome:"Telúrio"},
    {Z:53, simbolo:"I", nome:"Iodo"},
    {Z:54, simbolo:"Xe", nome:"Xenônio"},
    {Z:55, simbolo:"Cs", nome:"Césio"},
    {Z:56, simbolo:"Ba", nome:"Bário"},
    {Z:57, simbolo:"La", nome:"Lantânio"},
    {Z:58, simbolo:"Ce", nome:"Cério"},
    {Z:59, simbolo:"Pr", nome:"Praseodímio"},
    {Z:60, simbolo:"Nd", nome:"Neodímio"},
    {Z:61, simbolo:"Pm", nome:"Promécio"},
    {Z:62, simbolo:"Sm", nome:"Samário"},
    {Z:63, simbolo:"Eu", nome:"Európio"},
    {Z:64, simbolo:"Gd", nome:"Gadolínio"},
    {Z:65, simbolo:"Tb", nome:"Térbio"},
    {Z:66, simbolo:"Dy", nome:"Disprósio"},
    {Z:67, simbolo:"Ho", nome:"Hólmio"},
    {Z:68, simbolo:"Er", nome:"Érbio"},
    {Z:69, simbolo:"Tm", nome:"Túlio"},
    {Z:70, simbolo:"Yb", nome:"Itérbio"},
    {Z:71, simbolo:"Lu", nome:"Lutécio"},
    {Z:72, simbolo:"Hf", nome:"Háfnio"},
    {Z:73, simbolo:"Ta", nome:"Tântalo"},
    {Z:74, simbolo:"W", nome:"Tungstênio"},
    {Z:75, simbolo:"Re", nome:"Rênio"},
    {Z:76, simbolo:"Os", nome:"Ósmio"},
    {Z:77, simbolo:"Ir", nome:"Irídio"},
    {Z:78, simbolo:"Pt", nome:"Platina"},
    {Z:79, simbolo:"Au", nome:"Ouro"},
    {Z:80, simbolo:"Hg", nome:"Mercúrio"},
    {Z:81, simbolo:"Tl", nome:"Tálio"},
    {Z:82, simbolo:"Pb", nome:"Chumbo"},
    {Z:83, simbolo:"Bi", nome:"Bismuto"},
    {Z:84, simbolo:"Po", nome:"Polônio"},
    {Z:85, simbolo:"At", nome:"Astato"},
    {Z:86, simbolo:"Rn", nome:"Radônio"},
    {Z:87, simbolo:"Fr", nome:"Frâncio"},
    {Z:88, simbolo:"Ra", nome:"Rádio"},
    {Z:89, simbolo:"Ac", nome:"Actínio"},
    {Z:90, simbolo:"Th", nome:"Tório"},
    {Z:91, simbolo:"Pa", nome:"Protactínio"},
    {Z:92, simbolo:"U", nome:"Urânio"},
    {Z:93, simbolo:"Np", nome:"Neptúnio"},
    {Z:94, simbolo:"Pu", nome:"Plutônio"},
    {Z:95, simbolo:"Am", nome:"Amerício"},
    {Z:96, simbolo:"Cm", nome:"Cúrio"},
    {Z:97, simbolo:"Bk", nome:"Berquélio"},
    {Z:98, simbolo:"Cf", nome:"Califórnio"},
    {Z:99, simbolo:"Es", nome:"Einstênio"},
    {Z:100, simbolo:"Fm", nome:"Férmio"},
    {Z:101, simbolo:"Md", nome:"Mendelévio"},
    {Z:102, simbolo:"No", nome:"Nobélio"},
    {Z:103, simbolo:"Lr", nome:"Laurêncio"},
    {Z:104, simbolo:"Rf", nome:"Rutherfordônio"},
    {Z:105, simbolo:"Db", nome:"Dúbnio"},
    {Z:106, simbolo:"Sg", nome:"Seabórgio"},
    {Z:107, simbolo:"Bh", nome:"Bóhrio"},
    {Z:108, simbolo:"Hs", nome:"Hássio"},
    {Z:109, simbolo:"Mt", nome:"Meitnério"},
    {Z:110, simbolo:"Ds", nome:"Darmstádio"},
    {Z:111, simbolo:"Rg", nome:"Roentgênio"},
    {Z:112, simbolo:"Cn", nome:"Copernício"},
    {Z:113, simbolo:"Nh", nome:"Nihônio"},
    {Z:114, simbolo:"Fl", nome:"Fleróvio"},
    {Z:115, simbolo:"Mc", nome:"Moscóvio"},
    {Z:116, simbolo:"Lv", nome:"Livermório"},
    {Z:117, simbolo:"Ts", nome:"Tenessino"},
    {Z:118, simbolo:"Og", nome:"Oganessônio"}
  ];

  let estado = {
    metodoEscolha: null,
    elementoSelecionado: null,
    isotopoSelecionado: null,
    emissoes: { alfa: 0, beta: 0, positron: 0, neutron: 0 }
  };

  let chatMessages = [];
  let optionsContent = [];
  let resultContent = '';

  function botFala(texto) {
    chatMessages = [...chatMessages, { text: texto, type: 'bot' }];
  }

  function limpaOpcoes() {
    optionsContent = [];
  }

  function etapa1() {
    botFala("Hello! Let's start by choosing an element.");
    botFala("Do you want to choose by name or by atomic number?");
    limpaOpcoes();
    optionsContent = [
      { type: 'button', text: 'By name', action: () => { estado.metodoEscolha = "nome"; etapa2(); } },
      { type: 'button', text: 'By atomic number', action: () => { estado.metodoEscolha = "numero"; etapa2(); } }
    ];
  }

  function etapa2() {
    limpaOpcoes();

    if (estado.metodoEscolha === "nome") {
      botFala("Enter the element name:");
      optionsContent = [
        { 
          type: 'input', 
          inputType: 'text', 
          placeholder: 'Ex: Carbon',
          id: 'nomeElemento',
          label: 'Element name:'
        },
        { 
          type: 'button', 
          text: 'Confirm', 
          action: () => {
            const nomeBusca = document.getElementById('nomeElemento')?.value.trim().toLowerCase();
            const elem = tabelaPeriodica.find((el) => el.nome.toLowerCase() === nomeBusca);
            if (elem) {
              estado.elementoSelecionado = elem;
              botFala(`You chose ${elem.nome} (${elem.simbolo}), Z=${elem.Z}.`);
              etapa3();
            } else {
              botFala("Element not found. Please try again.");
            }
          }
        }
      ];
    } else {
      botFala("Enter the atomic number (1 to 118):");
      optionsContent = [
        { 
          type: 'input', 
          inputType: 'number', 
          min: 1, 
          max: 118,
          id: 'numeroAtomico',
          label: 'Atomic number:'
        },
        { 
          type: 'button', 
          text: 'Confirm', 
          action: () => {
            const num = parseInt(document.getElementById('numeroAtomico')?.value);
            const elem = tabelaPeriodica.find((el) => el.Z === num);
            if (elem) {
              estado.elementoSelecionado = elem;
              botFala(`You chose ${elem.nome} (${elem.simbolo}), Z=${elem.Z}.`);
              etapa3();
            } else {
              botFala("Invalid atomic number. Please try again.");
            }
          }
        }
      ];
    }
  }

  function gerarIsotopos(Z) {
    const Aprovavel = Math.round(Z * 1.3);
    return [Aprovavel - 2, Aprovavel - 1, Aprovavel, Aprovavel + 1, Aprovavel + 2].filter(
      (a) => a >= Z
    );
  }

  function etapa3() {
    limpaOpcoes();
    botFala("Now choose a plausible isotope for this element.");

    const Z = estado.elementoSelecionado.Z;
    const isotopos = gerarIsotopos(Z);
    let selectedIsotope = isotopos[2];

    optionsContent = [
      { 
        type: 'select', 
        options: isotopos.map(a => ({ value: a, text: `A = ${a}` })),
        selected: selectedIsotope,
        id: 'isotopoSelect',
        label: 'Select an isotope:'
      },
      { 
        type: 'button', 
        text: 'Confirm Isotope', 
        action: () => {
          const A = parseInt(document.getElementById('isotopoSelect')?.value);
          estado.isotopoSelecionado = {
            A,
            nome: `${estado.elementoSelecionado.nome}-${A}`
          };
          botFala(`Selected isotope: ${estado.isotopoSelecionado.nome}`);
          etapa4();
        }
      }
    ];
  }

  function etapa4() {
    limpaOpcoes();
    botFala("How many particles of each type will be emitted?");

    estado.emissoes = { alfa: 0, beta: 0, positron: 0, neutron: 0 };

    optionsContent = [
      { type: 'input', inputType: 'number', min: 0, value: 0, id: 'alfaInput', label: 'Alpha particles:' },
      { type: 'input', inputType: 'number', min: 0, value: 0, id: 'betaInput', label: 'Beta particles:' },
      { type: 'input', inputType: 'number', min: 0, value: 0, id: 'positronInput', label: 'Positrons:' },
      { type: 'input', inputType: 'number', min: 0, value: 0, id: 'neutronInput', label: 'Neutrons:' },
      { 
        type: 'button', 
        text: 'Calculate Decay', 
        action: () => {
          estado.emissoes.alfa = parseInt(document.getElementById('alfaInput')?.value) || 0;
          estado.emissoes.beta = parseInt(document.getElementById('betaInput')?.value) || 0;
          estado.emissoes.positron = parseInt(document.getElementById('positronInput')?.value) || 0;
          estado.emissoes.neutron = parseInt(document.getElementById('neutronInput')?.value) || 0;
          calculaDecaimento();
        }
      }
    ];
  }

  function calculaDecaimento() {
    limpaOpcoes();
    resultContent = '';

    let Z = estado.elementoSelecionado.Z;
    let A = estado.isotopoSelecionado.A;
    let explicacao = `Decay of ${estado.isotopoSelecionado.nome} (Z=${Z}, A=${A}):\n\n`;

    const aplicarDecaimento = (tipo, vezes) => {
      for (let i = 0; i < vezes; i++) {
        if (tipo === "alfa") {
          Z -= 2;
          A -= 4;
          explicacao += `→ Alpha emission: Z -= 2, A -= 4 ⇒ Z=${Z}, A=${A}\n`;
        } else if (tipo === "beta") {
          Z += 1;
          explicacao += `→ Beta emission (β⁻): Z += 1 ⇒ Z=${Z}, A=${A}\n`;
        } else if (tipo === "positron") {
          Z -= 1;
          explicacao += `→ Positron emission (β⁺): Z -= 1 ⇒ Z=${Z}, A=${A}\n`;
        } else if (tipo === "neutron") {
          A -= 1;
          explicacao += `→ Neutron emission: A -= 1 ⇒ Z=${Z}, A=${A}\n`;
        }
      }
    };

    for (const tipo in estado.emissoes) {
      aplicarDecaimento(tipo, estado.emissoes[tipo]);
    }

    const novoElemento = tabelaPeriodica.find((e) => e.Z === Z);

    if (novoElemento) {
      explicacao += `\nFinal result: ${novoElemento.simbolo}-${A} (${novoElemento.nome}), Z=${Z}, A=${A}`;
    } else {
      explicacao += `\nFinal result: Element outside the periodic table (Z=${Z}, A=${A})`;
    }

    resultContent = explicacao;
    animarParticulas(estado.emissoes);

    optionsContent = [
      { 
        type: 'button', 
        text: 'Restart', 
        action: () => {
          chatMessages = [];
          resultContent = '';
          etapa1();
        }
      }
    ];
  }

   function animarParticulas(quantidades) {
    const largura = 900, altura = 600; // Format fixo conforme solicitado
    const centroX = largura / 2, centroY = altura / 2;
    let Z = estado.elementoSelecionado.Z;
    let A = estado.isotopoSelecionado.A;

    const svg = d3.select("#animacao")
      .html("")
      .append("svg")
      .attr("width", largura)
      .attr("height", altura)
      .style("background", "radial-gradient(circle, #f8f9fa 0%, #e9ecef 100%)")
      .style("border-radius", "8px")
      .style("box-shadow", "0 4px 20px rgba(0, 0, 0, 0.1)");

    // Elemento atual (texto grande)
    const elementoAtual = svg.append("text")
      .attr("x", 80)
      .attr("y", 50)
      .attr("text-anchor", "left")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("fill", "#1D3557") // Cor mais forte
      .text(`${estado.elementoSelecionado.simbolo}-${A}`);

    // Configuração inicial
    const configInicial = obterConfiguracaoEletronica(Z);
    let configAtual = JSON.parse(JSON.stringify(configInicial));

    // Desenhar átomo inicial
    const grupoAtomo = svg.append("g").attr("class", "atomo-container");
    desenharAtomo(grupoAtomo, centroX, centroY, Z, A, configAtual);

    // Propriedades das partículas (aumentei os tamanhos)
    const propriedades = {
      alfa: { 
        cor: "#E63946", 
        texto: "α", 
        desc: "Partícula Alfa (⁴He²⁺)", 
        size: 14, // Aumentado
        dZ: -2,
        dA: -4
      },
      beta: { 
        cor: "#457B9D", 
        texto: "β⁻", 
        desc: "Partícula Beta (e⁻)", 
        size: 10, // Aumentado
        dZ: 1,
        dA: 0
      },
      positron: { 
        cor: "#A8DADC", 
        texto: "β⁺", 
        desc: "Pósitron (e⁺)", 
        size: 10, // Aumentado
        dZ: -1,
        dA: 0
      },
      neutron: { 
        cor: "#1D3557", 
        texto: "n", 
        desc: "Nêutron", 
        size: 12, // Aumentado
        dZ: 0,
        dA: -1
      }
    };

    // Criar marcadores
    criarMarcadores(svg);

    // Painel de informações
    const infoPanel = svg.append("g")
      .attr("transform", `translate(${largura - 280}, 30)`);

    infoPanel.append("rect")
      .attr("width", 270)
      .attr("height", 120)
      .attr("fill", "white")
      .attr("stroke", "#1d3557")
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("opacity", 0.9);

    const infoTitle = infoPanel.append("text")
      .attr("x", 125)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("fill", "#1D3557") // Cor mais forte
      .text("Atomic Transformation");

    const infoElement = infoPanel.append("text")
      .attr("x", 10)
      .attr("y", 50)
      .style("fill", "#1D3557") // Cor mais forte
      .text(`Element: ${estado.elementoSelecionado.nome} (Z=${Z}, A=${A})`);

    const infoProtons = infoPanel.append("text")
      .attr("x", 10)
      .attr("y", 70)
      .style("fill", "#1D3557") // Cor mais forte
      .text(`Protons: ${Z}`);

    const infoNeutrons = infoPanel.append("text")
      .attr("x", 10)
      .attr("y", 90)
      .style("fill", "#1D3557") // Cor mais forte
      .text(`Neutrons: ${A - Z}`);

    const infoEletrons = infoPanel.append("text")
      .attr("x", 10)
      .attr("y", 110)
      .style("fill", "#1D3557") // Cor mais forte
      .text(`Electrons: ${Z}`);

    // Função para atualizar o átomo
    function atualizarAtomo(dZ, dA) {
      Z += dZ;
      A += dA;
      
      const novoElemento = tabelaPeriodica.find(e => e.Z === Z) || {
        simbolo: `X${Z}`,
        nome: `Elemento ${Z}`
      };
      
      configAtual = obterConfiguracaoEletronica(Z);
      
      // Atualizar displays com cores fortes
      elementoAtual.text(`${novoElemento.simbolo}-${A}`)
        .style("fill", "#1D3557");
      
      infoElement.text(`Element: ${novoElemento.nome} (Z=${Z}, A=${A})`)
        .style("fill", "#1D3557");
      infoProtons.text(`Protons: ${Z}`)
        .style("fill", "#1D3557");
      infoNeutrons.text(`Nêutrons: ${A - Z}`)
        .style("fill", "#1D3557");
      infoEletrons.text(`Electrons: ${Z}`)
        .style("fill", "#1D3557");
      
      grupoAtomo.selectAll("*").remove();
      desenharAtomo(grupoAtomo, centroX, centroY, Z, A, configAtual);
      
      return novoElemento;
    }

    // Animação de decaimento
    let delay = 0;
    Object.entries(quantidades).forEach(([tipo, qtd]) => {
      for (let i = 0; i < qtd; i++) {
        setTimeout(() => {
          const props = propriedades[tipo];
          const novoElemento = atualizarAtomo(props.dZ, props.dA);
          
          chatMessages = [...chatMessages, {
            text: `Emitida 1 partícula ${props.desc}. Novo elemento: ${novoElemento.nome} (${novoElemento.simbolo}-${A})`,
            type: 'bot'
          }];
          
          setTimeout(() => {
            const chatDiv = document.getElementById('chat');
            if (chatDiv) chatDiv.scrollTop = chatDiv.scrollHeight;
          }, 100);
          
          emitirParticula(
            svg.append("g"),
            centroX,
            centroY,
            props,
            grupoAtomo.select("g.nucleo").node().getBBox().width/2
          );
        }, delay);
        
        delay += 1500;
      }
    });
  }

  function desenharAtomo(grupo, cx, cy, Z, A, config) {
    const grupoNucleo = grupo.append("g").attr("class", "nucleo");
    const raioBase = 15 + Math.sqrt(A) * 1.5;
    
    // Núcleo com gradiente mais contrastante
    grupoNucleo.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", raioBase)
      .attr("fill", `url(#nucleo-gradient-${Z})`)
      .attr("stroke", "#1d3557")
      .attr("stroke-width", 2);
    
    // Texto no núcleo - cor mais forte e contraste
    const elemento = tabelaPeriodica.find(e => e.Z === Z) || { simbolo: `X${Z}` };
    grupoNucleo.append("text")
      .attr("x", cx)
      .attr("y", cy)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("font-size", `${Math.min(24, 14 + raioBase/3)}px`)
      .style("font-weight", "bold")
      .style("fill", "#1D3557") // Mudei para azul escuro
      .text(`${elemento.simbolo}-${A}`);
    
    // Elétrons
    const grupoEletrons = grupo.append("g").attr("class", "eletrons");
    config.forEach(orbital => {
      grupoEletrons.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", orbital.raio)
        .attr("fill", "none")
        .attr("stroke", `rgba(69, 123, 157, ${0.2 + 0.1*orbital.camada})`)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", orbital.tipo === 's' ? "none" : "2,2");
      
      for (let i = 0; i < orbital.eletrons; i++) {
        const ang = (i / orbital.eletrons) * Math.PI * 2;
        const el = grupoEletrons.append("g");
        
        el.append("circle")
          .attr("r", 7)
          .attr("fill", "#a8dadc")
          .attr("stroke", "#457b9d")
          .attr("stroke-width", 1);
        
        el.append("circle")
          .attr("r", 3)
          .attr("fill", "#f1faee");
        
        animateElectron(el, cx, cy, orbital.raio, ang, orbital.camada);
      }
    });
  }

  function emitirParticula(grupo, cx, cy, props, raioNucleo) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 200 + Math.random() * 100;
    const targetX = cx + Math.cos(angle) * distance;
    const targetY = cy + Math.sin(angle) * distance;
    
    // Partícula maior (tamanhos já ajustados nas propriedades)
    const particula = grupo.append("g")
      .attr("transform", `translate(${cx},${cy})`)
      .attr("opacity", 0);
    
    particula.append("circle")
      .attr("r", props.size)
      .attr("fill", props.cor)
      .attr("stroke", d3.color(props.cor).darker(0.5))
      .attr("stroke-width", 2); // Borda mais grossa
    
    particula.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("fill", "white")
      .style("font-size", `${props.size * 1.5}px`) // Texto maior
      .style("font-weight", "bold")
      .text(props.texto);
    
    // Linha de trajetória mais visível
    const trajetoria = grupo.append("line")
      .attr("x1", cx)
      .attr("y1", cy)
      .attr("x2", cx)
      .attr("y2", cy)
      .attr("stroke", props.cor)
      .attr("stroke-width", 2) // Mais grossa
      .attr("stroke-dasharray", "3,2")
      .attr("opacity", 0)
      .attr("marker-end", `url(#arrow-${props.texto.includes("α") ? "alfa" : "beta"})`);
    
    // Animação
    particula.transition()
      .duration(300)
      .attr("opacity", 1)
      .attr("transform", `translate(${cx + Math.cos(angle)*raioNucleo}, ${cy + Math.sin(angle)*raioNucleo})`)
      .transition()
      .duration(2000)
      .attr("transform", `translate(${targetX},${targetY})`)
      .attr("opacity", 0)
      .remove();
    
    trajetoria.transition()
      .delay(300)
      .duration(2000)
      .attr("x2", targetX)
      .attr("y2", targetY)
      .attr("opacity", 0.9) // Mais visível
      .transition()
      .duration(300)
      .attr("opacity", 0)
      .remove();
  }

  function obterConfiguracaoEletronica(Z) {
    const ordemOrbitais = [
      '1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', 
      '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'
    ];
    
    const capacidades = { s: 2, p: 6, d: 10, f: 14 };
    let config = [];
    let eRestantes = Z;
    
    for (const orbital of ordemOrbitais) {
      if (eRestantes <= 0) break;
      
      const [n, tipo] = orbital.split('');
      const capacidade = capacidades[tipo];
      const eOrbital = Math.min(capacidade, eRestantes);
      
      if (eOrbital > 0) {
        config.push({
          camada: parseInt(n),
          tipo,
          eletrons: eOrbital,
          raio: 60 + (parseInt(n) * 50 + (tipo === 'p' ? 20 : tipo === 'd' ? 40 : tipo === 'f' ? 60 : 0))
        });
        eRestantes -= eOrbital;
      }
    }
    
    return config;
  }

  

  function animateElectron(group, cx, cy, radius, initialAngle, layer) {
    const duration = 3000 + layer * 1000;
    const variation = 0.1 * layer;
    
    function update(t) {
      const currentVariation = Math.sin(t * Math.PI * 4) * variation;
      const angle = initialAngle + 2 * Math.PI * t + currentVariation;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      group.attr("transform", `translate(${x},${y})`);
      
      // Efeito de spin
      group.select("circle:first-child")
        .attr("transform", `rotate(${t * 720})`);
    }
    
    d3.timer((elapsed) => {
      update((elapsed % duration) / duration);
    });
  }

  function criarMarcadores(svg) {
    const defs = svg.append("defs");
    
    // Gradiente para o núcleo
    const grad = defs.append("radialGradient")
      .attr("id", "nucleo-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%")
      .attr("fx", "30%")
      .attr("fy", "30%");
    
    grad.append("stop").attr("offset", "0%").attr("stop-color", "#f1faee");
    grad.append("stop").attr("offset", "100%").attr("stop-color", "#a8dadc");
    
    // Marcadores de seta
    defs.append("marker")
      .attr("id", "arrow-alfa")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#E63946");
    
    defs.append("marker")
      .attr("id", "arrow-beta")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#457B9D");
  }
  onMount(() => {
    etapa1();
  });
</script>

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
  
#animacao {
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    margin: 1rem 0;
    overflow: hidden;
    background: white;
  }

  .nucleo {
    filter: drop-shadow(0 0 4px rgba(69, 123, 157, 0.5));
  }

  #chat {
    max-height: 200px;
    overflow-y: auto;
    padding-right: 10px;
  }

  #chat p {
    margin: 0.5rem 0;
    padding: 0.8rem;
    background: #f5f5f5;
    border-radius: 6px;
    transition: background 0.3s;
  }

  #chat p.bot-msg {
    background: #e3f2fd;
    border-left: 4px solid #0077cc;
  }

  #chat p:hover {
    background: #e9ecef;
  }

  .page {
    padding: 2rem;
    max-width: 900px;
    margin: 2rem auto;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    position: relative;
  }

  .page h1 {
    color: #003366;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }

  .chem-icon {
    font-size: 1.5em;
  }

  .controls {
    background: #e3f2f9;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .controls label {
    display: block;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .controls input[type="number"] {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.3rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .controls select {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.3rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .controls button {
    background: #0077cc;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 1rem;
  }

  .controls button:hover {
    background: #005fa3;
  }

  #chat {
    margin-bottom: 1.5rem;
  }

  #chat p {
    margin: 0.5rem 0;
    padding: 0.8rem;
    background: #f5f5f5;
    border-radius: 6px;
  }

  #chat p.bot-msg {
    background: #e3f2fd;
    border-left: 4px solid #0077cc;
  }

  .rate-law {
    background: #f9f9f9;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #0077cc;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  .rate-law pre {
    margin: 0;
    white-space: pre-wrap;
    font-family: 'Courier New', monospace;
    line-height: 1.5;
  }

  .chart-container {
    width: 100%;
    height: 400px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0,0,0,0.1);
    margin-top: 2rem;
  }

  @media (max-width: 600px) {    
    nav a {
      padding: 0.3rem 0;
    }

    .page {
      padding: 1rem;
    }

    .controls {
      padding: 1rem;
    }
  }

.series-section {
    margin-top: 3rem;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #4CAF50;
  }

  .series-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .animation-controls {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  button {
    padding: 0.5rem 1rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  }

  button:hover {
    background: #3e8e41;
  }

  button:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  select {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ddd;
  }

  .series-animation {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin: 2rem 0;
    min-height: 120px;
  }

  .atom {
    position: relative;
    padding: 1rem;
    border: 2px solid #333;
    border-radius: 8px;
    background: white;
    text-align: center;
    min-width: 80px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  .symbol {
    font-weight: bold;
    font-size: 1.2rem;
    display: block;
  }

  .name {
    font-size: 0.8rem;
    color: #666;
    display: block;
  }

  .decay-particle {
    position: absolute;
    font-weight: bold;
    animation: emit 1s ease-out forwards;
    font-size: 1.2rem;
  }

  .decay-particle.α { color: #e63946; }
  .decay-particle.β { color: #457b9d; }

  @keyframes emit {
    from { transform: translate(0, 0); opacity: 1; }
    to { transform: translate(50px, -50px); opacity: 0; }
  }

  .decay-path {
    margin-top: 2rem;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  tr:hover {
    background-color: #f5f5f5;
  }

  .α {
    color: #e63946;
    font-weight: bold;
  }

  .β {
    color: #457b9d;
    font-weight: bold;
  }

  .stable {
    color: #2a9d8f;
    font-weight: bold;
  }

</style>