let vidas;
let palavras;
let palavraAtual;
let numPalavra;
let exibicao;


let btnIniciar = document.getElementById("btn_iniciar");
let imagem = document.getElementById("img-menino");
let palavra = document.getElementById("palavra");

btnIniciar.addEventListener("click", novoJogo);

iniciar(); // executa o fluxo principal

async function iniciar() {
    await carregarFase(); // espera o JSON carregar
}

function novoJogo() {
    numPalavra = 0;
    vidas = 6;
    carregarPalavra(numPalavra);
    imagem.src = "assets/menino1.png";
    
}


function carregarPalavra(numPalavra) {
    palavraAtual = String(palavras[numPalavra]).toUpperCase();
    exibicao = [];

    for (let i = 0; i < palavraAtual.length; i++) {
        exibicao[i] = '_';
    }
    palavra.textContent = exibicao.join(" ");
    carregarTeclado();
    return palavras[numPalavra];
}

function carregarTeclado() {
    let boxTeclado = document.getElementById("box-teclado");
    boxTeclado.innerHTML = ""; // limpa o conteúdo anterior

    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < letras.length; i++) {
        let botao = document.createElement("button");
        botao.textContent = letras[i];

        botao.addEventListener("click", function () {
            verificarLetra(letras[i], botao);
        });

        boxTeclado.appendChild(botao);
    }


}


function verificarLetra(letra, botao) {
    botao.disabled = true;
    let acertou = false;


    for (let i = 0; i < palavraAtual.length; i++) {
        if (palavraAtual[i] === letra) {
            exibicao[i] = letra; // substitui o traço pela letra correta
            acertou = true;
        }
    }
    palavra.textContent = exibicao.join(" ");
    if (acertou == false) {
        vidas--;
        if (vidas >= 0) {
            imagem.src = "assets/menino" + (7 - vidas) + ".png";
        }
    }

    if (vidas == 0) {
        alert("😢 Fim de jogo! A palavra era: " + palavraAtual);
        desativarTeclado();
    }
    if (!exibicao.includes("_")) {
        alert("🎉 Parabéns! Você acertou a palavra: " + palavraAtual);
        numPalavra++;
        carregarPalavra(numPalavra);
    }
}

function desativarTeclado() {
    const botoes = document.querySelectorAll("#box-teclado button");
    botoes.forEach(botao => botao.disabled = true);
}

async function carregarFase() {
    try {
        const response = await fetch("fases.json");
        const data = await response.json();
        palavras = data.frutas;

    } catch (error) {
        console.error("Erro ao carregar fases.json:", error);
    }
}