// ANIMAÇÃO DE DECAIMENTO PARA TODOS OS ELEMENTOS DA TABELA PERIÓDICA

document.addEventListener("DOMContentLoaded", () => {
    const chat = document.getElementById("chat");
    const options = document.getElementById("options");
    const result = document.getElementById("result");
  

    // Dados básicos da tabela periódica (Z, símbolo, nome)
    // Fonte simplificada - Z 1 a 118
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

  function botFala(texto) {
    const p = document.createElement("p");
    p.className = "bot-msg";
    p.textContent = texto;
    chat.appendChild(p);
    chat.scrollTop = chat.scrollHeight;
  }

  function limpaOpcoes() {
    options.innerHTML = "";
  }

  function criaBotao(texto, callback) {
    const btn = document.createElement("button");
    btn.textContent = texto;
    btn.onclick = callback;
    options.appendChild(btn);
  }

  function etapa1() {
    botFala("Olá! Vamos começar escolhendo um elemento.");
    botFala("Você quer escolher pelo nome ou pelo número atômico?");
    limpaOpcoes();
    criaBotao("Pelo nome", () => {
      estado.metodoEscolha = "nome";
      etapa2();
    });
    criaBotao("Pelo número atômico", () => {
      estado.metodoEscolha = "numero";
      etapa2();
    });
  }

  function etapa2() {
    limpaOpcoes();

    if (estado.metodoEscolha === "nome") {
      botFala("Digite o nome do elemento:");
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Ex: Carbono";
      input.style.fontSize = "1.4rem";
      options.appendChild(input);

      const btn = document.createElement("button");
      btn.textContent = "Confirmar";
      btn.onclick = () => {
        const nomeBusca = input.value.trim().toLowerCase();
        const elem = tabelaPeriodica.find(
          (el) => el.nome.toLowerCase() === nomeBusca
        );
        if (elem) {
          estado.elementoSelecionado = elem;
          botFala(
            `Você escolheu ${elem.nome} (${elem.simbolo}), Z=${elem.Z}.`
          );
          etapa3();
        } else {
          botFala("Elemento não encontrado. Tente novamente.");
        }
      };
      options.appendChild(btn);
    } else {
      botFala("Digite o número atômico (1 a 118):");
      const input = document.createElement("input");
      input.type = "number";
      input.min = "1";
      input.max = "118";
      options.appendChild(input);

      const btn = document.createElement("button");
      btn.textContent = "Confirmar";
      btn.onclick = () => {
        const num = parseInt(input.value);
        const elem = tabelaPeriodica.find((el) => el.Z === num);
        if (elem) {
          estado.elementoSelecionado = elem;
          botFala(
            `Você escolheu ${elem.nome} (${elem.simbolo}), Z=${elem.Z}.`
          );
          etapa3();
        } else {
          botFala("Número atômico inválido. Tente novamente.");
        }
      };
      options.appendChild(btn);
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
    botFala("Agora escolha um isótopo plausível para esse elemento.");

    const Z = estado.elementoSelecionado.Z;
    const isotopos = gerarIsotopos(Z);

    const label = document.createElement("label");
    label.textContent = "Selecione um isótopo:";
    label.style.display = "block";
    label.style.marginBottom = "5px";
    options.appendChild(label);

    const select = document.createElement("select");
    select.style.fontSize = "1.2rem";
    select.style.marginBottom = "10px";

    isotopos.forEach((a) => {
      const option = document.createElement("option");
      option.value = a;
      option.textContent = `A = ${a}`;
      select.appendChild(option);
    });

    select.selectedIndex = 2;
    options.appendChild(select);

    const btn = document.createElement("button");
    btn.textContent = "Confirmar Isótopo";
    btn.onclick = () => {
      const A = +select.value;
      estado.isotopoSelecionado = {
        A,
        nome: `${estado.elementoSelecionado.nome}-${A}`
      };
      botFala(`Isótopo selecionado: ${estado.isotopoSelecionado.nome}`);
      etapa4();
    };
    options.appendChild(btn);
  }

  function etapa4() {
    limpaOpcoes();
    botFala("Quantas partículas de cada tipo serão emitidas?");

    const tipos = ["alfa", "beta", "positron", "neutron"];
    estado.emissoes = { alfa: 0, beta: 0, positron: 0, neutron: 0 };

    tipos.forEach((tipo) => {
      const label = document.createElement("label");
      label.textContent = `Partículas ${tipo}:`;
      label.style.display = "block";
      options.appendChild(label);

      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.value = "0";
      input.dataset.tipo = tipo;
      input.style.marginBottom = "10px";
      options.appendChild(input);
    });

    const btn = document.createElement("button");
    btn.textContent = "Calcular Decaimento";
    btn.onclick = () => {
      const inputs = options.querySelectorAll("input[type=number]");
      inputs.forEach((i) => {
        estado.emissoes[i.dataset.tipo] = parseInt(i.value) || 0;
      });
      calculaDecaimento();
    };
    options.appendChild(btn);
  }

  function calculaDecaimento() {
    limpaOpcoes();
    result.textContent = "";

    let Z = estado.elementoSelecionado.Z;
    let A = estado.isotopoSelecionado.A;
    let explicacao = `Decaimento de ${estado.isotopoSelecionado.nome} (Z=${Z}, A=${A}):\n\n`;

    const aplicarDecaimento = (tipo, vezes) => {
      for (let i = 0; i < vezes; i++) {
        if (tipo === "alfa") {
          Z -= 2;
          A -= 4;
          explicacao += `→ Emissão alfa: Z -= 2, A -= 4 ⇒ Z=${Z}, A=${A}\n`;
        } else if (tipo === "beta") {
          Z += 1;
          explicacao += `→ Emissão beta (β⁻): Z += 1 ⇒ Z=${Z}, A=${A}\n`;
        } else if (tipo === "positron") {
          Z -= 1;
          explicacao += `→ Emissão de pósiton (β⁺): Z -= 1 ⇒ Z=${Z}, A=${A}\n`;
        } else if (tipo === "neutron") {
          A -= 1;
          explicacao += `→ Emissão de nêtron: A -= 1 ⇒ Z=${Z}, A=${A}\n`;
        }
      }
    };

    for (const tipo in estado.emissoes) {
      aplicarDecaimento(tipo, estado.emissoes[tipo]);
    }

    const novoElemento = tabelaPeriodica.find((e) => e.Z === Z);

    if (novoElemento) {
      explicacao += `\nResultado final: ${novoElemento.simbolo}-${A} (${novoElemento.nome}), Z=${Z}, A=${A}`;
    } else {
      explicacao += `\nResultado final: Elemento fora da tabela periódica (Z=${Z}, A=${A})`;
    }

    const pre = document.createElement("pre");
    pre.style.whiteSpace = "pre-wrap";
    pre.style.backgroundColor = "#f0f0f0";
    pre.style.padding = "10px";
    pre.style.borderRadius = "8px";
    pre.textContent = explicacao;
    result.appendChild(pre);

    animarParticulas(estado.emissoes);

    criaBotao("Reiniciar", () => {
      chat.innerHTML = "";
      result.textContent = "";
      etapa1();
    });
  }
function animarParticulas(quantidades) {
  const largura = 600, altura = 600;
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
    alfa: { cor: "red", dur: 4000, texto: "Partícula α" },
    beta: { cor: "blue", dur: 3500, texto: "Partícula β⁻" },
    positron: { cor: "magenta", dur: 3200, texto: "Pósitron (β⁺)" },
    neutron: { cor: "gray", dur: 4500, texto: "Nêutron" }
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


  etapa1();
});