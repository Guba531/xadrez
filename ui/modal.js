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
const elModal           = document.getElementById('modal');
const elDifficultySection = document.getElementById('difficultySection');
const elColorSection    = document.getElementById('colorSection');

// ── abrirModal ────────────────────────────────────────────
// Exibe o modal — remove a classe 'hidden' e garante
// que o display está como 'flex' para centralizar o conteúdo.
export function abrirModal() {
  elModal.style.display = 'flex';

  // Pequeno delay para o browser "ver" o display:flex
  // antes de remover hidden — isso garante que a animação
  // de entrada (slideUp no CSS) vai ser executada
  requestAnimationFrame(() => {
    elModal.classList.remove('hidden');
  });
}

// ── fecharModal ───────────────────────────────────────────
// Esconde o modal com animação de saída.
// A classe 'hidden' dispara a animação CSS (fadeOut + slideDown).
// Só escondemos o elemento DEPOIS que a animação termina.
export function fecharModal() {
  elModal.classList.add('hidden');

  // Tempo em ms deve coincidir com a duração da animação CSS
  // Veja: .modal-overlay.hidden { animation: fadeOut 0.25s ... }
  setTimeout(() => {
    elModal.style.display = 'none';
  }, 280);
}


// ── lerConfiguracoes ──────────────────────────────────────
// Lê as escolhas do usuário no modal e devolve um objeto
// com todas as configurações da partida.
//
// Por que retornar um objeto e não variáveis separadas?
// Fica mais fácil passar as configurações entre módulos —
// o main.js recebe um objeto e distribui para quem precisa.
export function lerConfiguracoes() {
  // querySelector busca o primeiro elemento que corresponde
  // ao seletor CSS — aqui, o botão com classe 'active' dentro
  // de cada grupo de opções
  const modoBtn       = document.querySelector('#modeGroup .option-btn.active');
  const dificuldadeBtn = document.querySelector('#difficultyGroup .option-btn.active');
  const corBtn        = document.querySelector('#colorGroup .option-btn.active');
  const animacoesEl   = document.getElementById('toggleAnimations');
  const riscoEl = document.getElementById('toggleRisk');
  const alertsEl = document.getElementById('toggleAlerts');

  return {
    // data-value é um atributo HTML personalizado —
    // permite guardar dados extras em elementos HTML
    modo:        modoBtn?.dataset.value        || 'human',
    dificuldade: dificuldadeBtn?.dataset.value || 'easy',
    corJogador:  corBtn?.dataset.value         || 'white',

    // .checked é a propriedade do checkbox — true se marcado
    animacoes:   animacoesEl?.checked ?? true,
    risco: riscoEl?.checked ?? true,
    alerts: alertsEl?.checked ?? true,
  };
}


// ── selectOption ──────────────────────────────────────────
// Chamada pelos botões do modal via onclick no HTML.
// Remove 'active' de todos os botões do grupo e
// adiciona apenas no botão clicado.
//
// Por que window.selectOption e não só selectOption?
// Funções chamadas inline no HTML (onclick="selectOption()")
// precisam estar acessíveis no escopo global (window).
// Em ES Modules, funções são locais por padrão.
//
// TODO: existe uma forma melhor de fazer isso sem usar window?
//       Pesquise: "addEventListener vs onclick inline"
window.selectOption = function(grupoId, btnClicado) {
  const grupo = document.getElementById(grupoId);
  grupo.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });

  btnClicado.classList.add('active');
  btnClicado.setAttribute('aria-pressed', 'true');

  // Quando o modo muda, mostramos ou escondemos seções
  if (grupoId === 'modeGroup') {
    const modoIA = btnClicado.dataset.value === 'ai';
    elDifficultySection.style.display = modoIA ? 'block' : 'none';
    elColorSection.style.display      = modoIA ? 'block' : 'none';
  }
};