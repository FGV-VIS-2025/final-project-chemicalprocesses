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
      
        // Funções auxiliares de interface
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
      
        // Etapas do fluxo de interação
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
      
        // Gera isotopos plausíveis para o elemento selecionado
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
      
          select.selectedIndex = 2; // valor central
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
      
        



        function animarParticulas(quantidades) {
            const largura = 300, altura = 300;
            const centroX = largura / 2, centroY = altura / 2;
            const svg = d3.select("#animacao")
              .html("")
              .append("svg")
              .attr("width", largura)
              .attr("height", altura);
          
            // Gradientes (iguais à versão anterior)
            const defs = svg.append("defs");
            const gradientes = {
              alfa: [["0%", "rgba(255,0,0,1)"], ["100%", "rgba(255,0,0,0)"]],
              beta: [["0%", "rgba(0,0,255,1)"], ["100%", "rgba(0,0,255,0)"]],
              positron: [["0%", "rgba(255,0,255,1)"], ["100%", "rgba(255,0,255,0)"]],
              neutron: [["0%", "rgba(128,128,128,1)"], ["100%", "rgba(128,128,128,0)"]],
            };
          
            Object.entries(gradientes).forEach(([tipo, stops]) => {
              const grad = defs.append("radialGradient").attr("id", `grad-${tipo}`);
              grad.selectAll("stop").data(stops).enter().append("stop")
                .attr("offset", d => d[0])
                .attr("stop-color", d => d[1]);
            });
          
            const propriedades = {
              alfa: { r: 6, dur: 2200, cor: "url(#grad-alfa)" },
              beta: { r: 4, dur: 1800, cor: "url(#grad-beta)" },
              positron: { r: 5, dur: 1600, cor: "url(#grad-positron)" },
              neutron: { r: 8, dur: 2500, cor: "url(#grad-neutron)" }
            };
          
            // 🌟 Explosão no centro (círculo pulsante)
            const explosao = svg.append("circle")
              .attr("cx", centroX)
              .attr("cy", centroY)
              .attr("r", 0)
              .attr("fill", "orange")
              .attr("opacity", 0.7);
          
            explosao.transition()
              .duration(400)
              .attr("r", 40)
              .attr("opacity", 0)
              .remove();
          
            // Partículas
            Object.entries(quantidades).forEach(([tipo, qtd]) => {
              const { r, dur, cor } = propriedades[tipo];
          
              for (let i = 0; i < qtd; i++) {
                const angulo = Math.random() * 2 * Math.PI;
                const distancia = 80 + Math.random() * 80;
                const controleAngulo = angulo + (Math.random() - 0.5);
          
                const x1 = centroX;
                const y1 = centroY;
                const cx = centroX + Math.cos(controleAngulo) * (distancia * 0.5);
                const cy = centroY + Math.sin(controleAngulo) * (distancia * 0.5);
                const x2 = centroX + Math.cos(angulo) * distancia;
                const y2 = centroY + Math.sin(angulo) * distancia;
          
                const caminho = svg.append("path")
                  .attr("d", `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`)
                  .attr("fill", "none");
          
                const part = svg.append("circle")
                  .attr("r", r)
                  .attr("fill", cor)
                  .attr("opacity", 1);
          
                part.transition()
                  .duration(dur)
                  .ease(d3.easeCubicOut)
                  .attrTween("transform", () => {
                    return t => {
                      const p = caminho.node().getPointAtLength(t * caminho.node().getTotalLength());
                      return `translate(${p.x},${p.y})`;
                    };
                  })
                  .attrTween("opacity", () => t => 1 - t)
                  .on("end", () => part.remove());
          
                setTimeout(() => caminho.remove(), dur + 100);
              }
            });
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
                explicacao += `→ Emissão de pósitron (β⁺): Z -= 1 ⇒ Z=${Z}, A=${A}\n`;
              } else if (tipo === "neutron") {
                A -= 1;
                explicacao += `→ Emissão de nêutron: A -= 1 ⇒ Z=${Z}, A=${A}\n`;
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
      
          // Exibir resultado
          const pre = document.createElement("pre");
          pre.style.whiteSpace = "pre-wrap";
          pre.style.backgroundColor = "#f0f0f0";
          pre.style.padding = "10px";
          pre.style.borderRadius = "8px";
          pre.textContent = explicacao;
          result.appendChild(pre);
      
          // Botão reiniciar
          criaBotao("Reiniciar", () => {
            chat.innerHTML = "";
            result.textContent = "";
            etapa1();
          });
        }
        animarParticulas(estado.emissoes);

        etapa1();
      });
      