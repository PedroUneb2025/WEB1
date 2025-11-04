// ======== VARIÁVEIS GLOBAIS ========
let vidas, pontos, palavras, palavraAtual, exibicao, ordemPalavras, indiceAtual;
let historico = [];

const btnIniciar = document.getElementById("btn_iniciar");
const imagem     = document.getElementById("img-menino");
const lblPalavra = document.getElementById("palavra");
const boxTeclado = document.getElementById("box-teclado");

// HUD
const lblCategoria = document.getElementById("categoria");
const lblPontos    = document.getElementById("pontos");
const lblVidas     = document.getElementById("vidas");

// Modal
const modal         = document.getElementById("modal");
const modalTitle    = document.getElementById("modal-title");
const modalMsg      = document.getElementById("modal-msg");
const btnContinuar  = document.getElementById("btn_continuar");
const btnReiniciar  = document.getElementById("btn_reiniciar");

// Histórico (UI)
const listaHistorico = document.getElementById("lista-historico");

// ======== EVENTOS ========
btnIniciar.addEventListener("click", iniciarJogo);
btnContinuar.addEventListener("click", () => { modal.close(); proximaPalavra(); });
btnReiniciar.addEventListener("click", () => { modal.close(); iniciarJogo(); });

// ======== CARREGAMENTO INICIAL ========
carregarFase();

async function carregarFase() {
  try {
    const resp = await fetch("fases.json");
    const data = await resp.json();
    palavras = data.frutas.map(s => String(s).toUpperCase()); // do seu JSON:contentReference[oaicite:4]{index=4}
  } catch (e) {
    console.error("Erro ao carregar fases.json:", e);
    palavras = ["BANANA", "UVA", "MANGA"];
  }
  btnIniciar.disabled = false;
  lblCategoria.textContent = "Categoria: Frutas";
}

// ======== LÓGICA PRINCIPAL ========
function iniciarJogo() {
  btnIniciar.disabled = true; // desativa enquanto joga
  pontos = 0;
  vidas = 6;
  indiceAtual = 0;
  ordemPalavras = embaralhar([...Array(palavras.length).keys()]);
  atualizarHUD();
  carregarPalavra();
}

function proximaPalavra() {
  indiceAtual++;
  if (indiceAtual >= ordemPalavras.length) {
    abrirModal("🎉 Fim!", `Você concluiu todas as palavras.<br><strong>Pontuação: ${pontos}</strong>`);
    btnIniciar.disabled = false; // reativa no fim do jogo
    return;
  }
  vidas = 6;
  atualizarHUD();
  carregarPalavra();
}

function carregarPalavra() {
  const idx = ordemPalavras[indiceAtual];
  palavraAtual = palavras[idx];
  exibicao = Array.from({ length: palavraAtual.length }, () => "_");
  lblPalavra.textContent = exibicao.join(" ");

  imagem.src = "assets/menino1.png";
  montarTeclado();

  // 🔹 Reset do histórico para a nova rodada
  historico = [];
  renderHistorico();
}

function montarTeclado() {
  boxTeclado.innerHTML = "";
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (const ch of letras) {
    const btn = document.createElement("button");
    btn.textContent = ch;
    btn.className = "tecla";
    btn.setAttribute("aria-label", `Letra ${ch}`);
    btn.addEventListener("click", () => verificarLetra(ch, btn));
    boxTeclado.appendChild(btn);
  }
}

function verificarLetra(letra, botao) {
  botao.disabled = true;

  let acertou = false;
  for (let i = 0; i < palavraAtual.length; i++) {
    if (palavraAtual[i] === letra) {
      exibicao[i] = letra;
      acertou = true;
    }
  }

  lblPalavra.textContent = exibicao.join(" ");

  // 🔹 Registrar no histórico
  historico.push({ letra, ok: acertou });
  renderHistorico();

  if (!acertou) {
    vidas--;
    atualizarHUD();
    const passo = Math.min(7, 7 - vidas); // mesmo esquema do seu código original:contentReference[oaicite:5]{index=5}
    imagem.src = `assets/menino${passo}.png`;
  }

  if (vidas <= 0) {
    desativarTeclado();
    abrirModal("😢 Fim de jogo", `A palavra era: <strong>${palavraAtual}</strong>`);
    btnIniciar.disabled = false; // pode reiniciar
    return;
  }

  if (!exibicao.includes("_")) {
    pontos += 100;
    atualizarHUD();
    desativarTeclado();
    abrirModal("🎉 Parabéns!", `Você acertou: <strong>${palavraAtual}</strong>`);
  }
}

function desativarTeclado() {
  boxTeclado.querySelectorAll("button").forEach(b => b.disabled = true);
}

function atualizarHUD() {
  lblCategoria.textContent = "Categoria: Frutas";
  lblVidas.textContent = `Vidas: ${vidas}`;
  lblPontos.textContent = `Pontos: ${pontos}`;
}

// ======== HISTÓRICO (render) ========
function renderHistorico() {
  if (!listaHistorico) return;
  listaHistorico.innerHTML = historico
    .map(h => `<li class="${h.ok ? "hit" : "miss"}">${h.letra}</li>`)
    .join("");
}

// ======== UTIL ========
function embaralhar(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function abrirModal(titulo, msgHTML) {
  modalTitle.textContent = titulo;
  modalMsg.innerHTML = msgHTML;
  try { modal.showModal(); } catch { modal.setAttribute("open", ""); }
}

/* Suporte a teclado físico */
window.addEventListener("keydown", (ev) => {
  const k = ev.key?.toUpperCase();
  if (/^[A-Z]$/.test(k)) {
    const btn = [...boxTeclado.querySelectorAll("button")].find(b => b.textContent === k);
    if (btn && !btn.disabled) btn.click();
  }
});
