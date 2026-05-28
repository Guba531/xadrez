// ═══════════════════════════════════════════════════════
// ui/modal.js
//
// O QUE É ESTE ARQUIVO?
// Controla o modal de configuração de partida —
// abrir, fechar e ler as escolhas do usuário.
//
// O QUE É O DOM?
// DOM = Document Object Model. É a representação do HTML
// como objetos JavaScript. Quando fazemos:
//   document.getElementById('modal')
// estamos "pegando" o elemento HTML e podendo manipulá-lo
// via JS: mudar texto, classes CSS, mostrar/esconder etc.
//
// O QUE SÃO EVENTOS?
// Eventos são ações do usuário (clique, teclado, mouse).
// Com addEventListener() dizemos ao JS: "quando o usuário
// fizer X, execute essa função".
// ═══════════════════════════════════════════════════════


// Referências aos elementos do DOM
// Buscamos uma vez e guardamos — mais eficiente do que
// chamar getElementById toda vez que precisamos
const elModal = document.getElementById('modal');
const elDifficultySection = document.getElementById('difficultySection');
const elColorSection = document.getElementById(`colorSection`);

export function abrirModal() {
    elModal.style.display = 'flex';
    
    requestAnimationFrame(() => {
        elModal.classList.remove('hidden');
    });
}