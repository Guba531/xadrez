/*audio.play(): É uma função (método) que comando o áudio para começar a tocar. Ela retorna uma Promise (uma promessa), o que permite usar .then() e .catch() para saber se deu certo ou se o navegador bloqueou a reprodução automática.

audio.onplay: É um evento (ou propriedade de callback) que dispara quando o áudio já começou a tocar. Ele não retorna uma Promise. Portanto, tentar colocar .catch() direto nele vai gerar um erro no console do navegador (algo como TypeError: ... is not a function).

Como seria o jeito certo se você quisesse usar o evento:
Se você quiser usar o evento de quando o áudio começa a tocar, a sintaxe correta seria separar a atribuição do evento da chamada do play():

JavaScript
// Define o que acontece quando o evento 'play' disparar
audio.onplay = () => {
    console.log("O áudio começou a tocar!");
};

// Dispara o play (e captura o erro caso o navegador bloqueie)
audio.play().catch((erro) => {
    console.log("Reprodução bloqueada pelo navegador:", erro);
});
Resumindo: use audio.play() para iniciar o som e tratar erros de permissão do navegador, pois o .onplay() serve apenas para monitorar o estado do áudio, e não para executá-lo.*/

function tocarSomXequeMate() {
    const audio = document.getElementById('somXequeMate');

    if (!audio) return;

    audio.currentTime = 0;
    audio.onplay().catch(() => {});
}

function tocarSomClique() {
    const somClique = new Audio('assets/clique.mp3');
    somClique.play();
}

function tocarSomComer() {
    const somComer = new Audio('assets/comer.mp3');
    somComer.play();
}

function tocarSomDeslizar() {
    const somDeslizar = new Audio('assets/deslizar.mp3');
    somDeslizar.play();
}

function tocarSomPerigo() {
    const somPerigo = new Audio('assets/perigo.mp3');
    somPerigo.play();
}

function tocarSomRoque() {
    const somRoque = new Audio('assets/roque.mp3');
    somRoque.play();
}