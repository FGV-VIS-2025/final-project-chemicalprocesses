<svelte:head>
  <title>Page 5 - Radioactivity</title>
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

  {#if resultContent}
    <div id="result" class="rate-law">
      <pre>{resultContent}</pre>
    </div>
  {/if}

  <div id="animacao" class="chart-container"></div>
</main>

<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

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
    const largura = 800, altura = 400;
    const centroX = largura / 2, centroY = altura / 2;

    const svg = d3.select("#animacao")
      .html("")
      .append("svg")
      .attr("width", largura)
      .attr("height", altura);

    const grupoNucleo = svg.append("g").attr("id", "nucleo");
    const grupoOrbitas = svg.append("g").attr("id", "orbitas");
    const grupoSetas = svg.append("g").attr("id", "setas");

    // Núcleo
    grupoNucleo.append("circle")
      .attr("cx", centroX)
      .attr("cy", centroY)
      .attr("r", 15)
      .attr("fill", "orange");

    // Orbitas e elétrons
    const orbitas = [40, 70, 100];
    orbitas.forEach((raio, idx) => {
      grupoOrbitas.append("circle")
        .attr("cx", centroX)
        .attr("cy", centroY)
        .attr("r", raio)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1);

      for (let i = 0; i < 3; i++) {
        const ang = (i / 3) * 2 * Math.PI;
        const el = grupoOrbitas.append("circle")
          .attr("r", 4)
          .attr("fill", "red");

        animateElectron(el, raio, ang, idx);
      }
    });

    function animateElectron(el, raio, anguloInicial, camada) {
      const dur = 4000 + camada * 1000;
      function mover(t) {
        const ang = anguloInicial + 2 * Math.PI * t;
        const x = centroX + raio * Math.cos(ang);
        const y = centroY + raio * Math.sin(ang);
        el.attr("cx", x).attr("cy", y);
      }
      d3.timer((elapsed) => {
        mover((elapsed % dur) / dur);
      });
    }

    const propriedades = {
      alfa: { cor: "red", dur: 4000, texto: "α particle" },
      beta: { cor: "blue", dur: 3500, texto: "β⁻ particle" },
      positron: { cor: "magenta", dur: 3200, texto: "Positron (β⁺)" },
      neutron: { cor: "gray", dur: 4500, texto: "Neutron" }
    };

    function emitir(tipo, atraso = 0) {
      const { cor, dur, texto } = propriedades[tipo];

      const angulo = Math.random() * 2 * Math.PI;
      const distancia = 120 + Math.random() * 50;
      const x2 = centroX + Math.cos(angulo) * distancia;
      const y2 = centroY + Math.sin(angulo) * distancia;

      const part = svg.append("circle")
        .attr("cx", centroX)
        .attr("cy", centroY)
        .attr("r", 6)
        .attr("fill", cor)
        .attr("opacity", 1);

      const seta = grupoSetas.append("line")
        .attr("x1", centroX)
        .attr("y1", centroY)
        .attr("x2", centroX)
        .attr("y2", centroY)
        .attr("stroke", cor)
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");

      const textoEl = grupoSetas.append("text")
        .attr("x", centroX + 10)
        .attr("y", centroY - 10)
        .attr("fill", cor)
        .style("font-size", "14px")
        .text(texto);

      svg.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 10)
        .attr("refY", 5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .attr("fill", cor);

      part.transition()
        .delay(atraso)
        .duration(dur)
        .attr("cx", x2)
        .attr("cy", y2)
        .attr("opacity", 0)
        .remove();

      seta.transition()
        .delay(atraso)
        .duration(dur)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("opacity", 0)
        .remove();

      textoEl.transition()
        .delay(atraso + dur / 2)
        .duration(1000)
        .attr("opacity", 0)
        .remove();
    }

    let ciclo = 0;
    function loopAnimacao() {
      ciclo++;
      const total = Object.entries(quantidades).reduce((acc, [tipo, qtd]) => acc + qtd, 0);
      let atrasoAcumulado = 0;
      Object.entries(quantidades).forEach(([tipo, qtd]) => {
        for (let i = 0; i < qtd; i++) {
          emitir(tipo, atrasoAcumulado);
          atrasoAcumulado += 800;
        }
      });

      setTimeout(loopAnimacao, atrasoAcumulado + 1000);
    }

    loopAnimacao();
  }

  onMount(() => {
    etapa1();
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
  }
  
  nav a:hover {
    color: #aad4ff;
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
    nav ul {
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    
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
</style>