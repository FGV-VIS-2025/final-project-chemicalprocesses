// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener("DOMContentLoaded", () => {
  // Seleciona os elementos de entrada e exibição de valores
  const concAInput = document.getElementById("concA");           // Slider de concentração inicial [A]₀
  const rateKInput = document.getElementById("rateK");           // Slider da constante de taxa k
  const concAVal = document.getElementById("concAVal");          // Span que exibe o valor de [A]₀
  const rateKVal = document.getElementById("rateKVal");          // Span que exibe o valor de k
  const reactionOrderSelect = document.getElementById("reactionOrder"); // Dropdown da ordem da reação

  // Atualiza a simulação sempre que os controles são modificados
  concAInput.addEventListener("input", updateSimulation);
  rateKInput.addEventListener("input", updateSimulation);
  reactionOrderSelect.addEventListener("change", updateSimulation);

  // Função principal que atualiza a simulação e o gráfico
  function updateSimulation() {
    const order = parseInt(reactionOrderSelect.value);   // Ordem da reação (0, 1 ou 2)
    const A0 = parseFloat(concAInput.value);             // Concentração inicial
    const k = parseFloat(rateKInput.value);              // Constante de velocidade

    // Atualiza os valores visíveis ao usuário
    concAVal.textContent = A0;
    rateKVal.textContent = k;

    // Atualiza a descrição da equação de taxa
    const descriptions = [
      "The rate is independent of concentration: rate = k.",
      "The rate depends linearly on the concentration of A: rate = k[A].",
      "The rate depends quadratically on the concentration of A: rate = k[A]²."
    ];
    document.getElementById("rateLawDescription").innerHTML =
      `The selected reaction is <strong>${["zero", "first", "second"][order]}-order</strong>. ${descriptions[order]}`;

    // Geração de dados de concentração [A](t) ao longo do tempo
    const timePoints = d3.range(0, 50, 1);  // Gera tempos de t = 0 até t = 49
    const data = timePoints.map(t => {
      let At;
      if (order === 0) At = A0 - k * t;
      else if (order === 1) At = A0 * Math.exp(-k * t);
      else At = A0 / (1 + k * A0 * t);
      return { time: t, conc: Math.max(0, At) };  // Garante que [A] ≥ 0
    });

    // Atualiza o gráfico
    drawChart(data);
  }

  // Função que desenha o gráfico de concentração vs tempo
  function drawChart(data) {
    const svg = d3.select("#chart");
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    svg.selectAll("*").remove(); // Limpa o conteúdo anterior do SVG

    // Define margens internas
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Escalas para os eixos x (tempo) e y (concentração)
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.time)])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.conc)])
      .range([innerHeight, 0]);

    // Cria grupo principal com margens aplicadas
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Eixo X
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(10));

    // Eixo Y
    g.append("g")
      .call(d3.axisLeft(yScale).ticks(5));

    // Define a linha da curva de concentração
    const line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.conc));

    // Desenha a curva no SVG
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#16a085")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Legenda do eixo X
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("Time");

    // Legenda do eixo Y
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("[A]");
  }

  // Executa a primeira simulação ao carregar a página
  updateSimulation();
});

// Variáveis principais
let scene, camera, renderer, controls;
let atomGeometry, bondMaterial;
let molecules = [];
let time = 0; // Controlador de tempo para animação

// Função para inicializar a cena 3D
function init() {
  // Criando a cena, câmera e renderizador
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xf0f0f0);  // Cor de fundo da cena (branco claro)
  document.getElementById('container').appendChild(renderer.domElement);

  // Controle de órbita para permitir interação com a cena
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Geometria dos átomos (esferas)
  atomGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  bondMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

  // Adicionando luz ambiente
  const light = new THREE.AmbientLight(0x404040); // Luz suave
  scene.add(light);

  // Luz direcional para iluminar a cena
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5).normalize();
  scene.add(directionalLight);

  // Definir a posição inicial da câmera
  camera.position.z = 5;

  // Criar a molécula de exemplo (NO₂)
  createMoleculeNO2();

  // Função de animação
  animate();
}

// Função para criar a molécula de NO₂
function createMoleculeNO2() {
  // Átomos de Nitrogênio (N) e Oxigênio (O)
  const nitrogenAtom = createAtom(0, 0, 0, 0x00ff00); // Nitrogênio (verde)
  const oxygenAtom1 = createAtom(2, 0, 0, 0xff0000); // Oxigênio (vermelho)
  const oxygenAtom2 = createAtom(-2, 0, 0, 0xff0000); // Oxigênio (vermelho)

  // Ligação entre Nitrogênio e Oxigênio
  createBond(nitrogenAtom.position, oxygenAtom1.position);
  createBond(nitrogenAtom.position, oxygenAtom2.position);

  // Armazenar as moléculas
  molecules.push({ nitrogenAtom, oxygenAtom1, oxygenAtom2 });
}

// Função para criar um átomo na posição especificada
function createAtom(x, y, z, color) {
  const atomMaterial = new THREE.MeshBasicMaterial({ color: color });
  const atom = new THREE.Mesh(atomGeometry, atomMaterial);
  atom.position.set(x, y, z);
  scene.add(atom);
  return atom;
}

// Função para criar uma ligação entre dois átomos
function createBond(position1, position2) {
  const geometry = new THREE.BufferGeometry().setFromPoints([position1, position2]);
  const bond = new THREE.Line(geometry, bondMaterial);
  scene.add(bond);
}

// Função de animação
function animate() {
  requestAnimationFrame(animate);

  // Atualiza os controles de órbita
  controls.update();

  // Move os átomos para simular uma reação
  time += 0.02; // Controla a velocidade da animação

  // Aqui você pode adicionar lógica para movimentar os átomos (exemplo para animar NO₂ para N₂O₄)
  animateMolecule();

  // Renderiza a cena
  renderer.render(scene, camera);
}

// Função para animar a molécula NO₂ se transformando em N₂O₄
function animateMolecule() {
  // A lógica de animação pode ser a movimentação dos átomos
  const molecule = molecules[0];

  // Exemplo: os átomos de oxigênio se movem em direção ao átomo de nitrogênio
  const nitrogenAtom = molecule.nitrogenAtom;
  const oxygenAtom1 = molecule.oxygenAtom1;
  const oxygenAtom2 = molecule.oxygenAtom2;

  // Modificando as posições de oxigênio para se aproximar do nitrogênio (simulando reação)
  oxygenAtom1.position.x -= 0.01 * Math.sin(time); // Movimento os átomos de oxigênio
  oxygenAtom2.position.x += 0.01 * Math.cos(time);

  // Agora você pode adicionar outras lógicas de animação, como rotações ou movimentos diferentes de átomos

  // Se você quiser voltar a animação ao estado inicial (loop), apenas reinicie as posições
  if (time > 20) {
    resetMoleculePositions();
    time = 0;
  }
}

// Função para resetar as posições dos átomos
function resetMoleculePositions() {
  const molecule = molecules[0];
  molecule.nitrogenAtom.position.set(0, 0, 0);
  molecule.oxygenAtom1.position.set(2, 0, 0);
  molecule.oxygenAtom2.position.set(-2, 0, 0);
}

// Inicializa a cena
window.onload = init;
