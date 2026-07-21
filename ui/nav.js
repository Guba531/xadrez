// ═══════════════════════════════════════════════════════
// ui/nav.js
//
// O QUE É ESTE ARQUIVO?
// Controla a nav lateral — abrir/fechar seções,
// atualizar placar, turno, histórico e peças capturadas.
//
// POR QUE <nav> E NÃO <div>?
// Tags semânticas comunicam o SIGNIFICADO do conteúdo:
//   <nav>     → área de navegação ou controle
//   <main>    → conteúdo principal da página
//   <section> → seção com tema próprio
//   <header>  → cabeçalho de uma seção
//
// Isso importa para:
//   - Leitores de tela (acessibilidade)
//   - SEO (motores de busca entendem a estrutura)
//   - Outros desenvolvedores que leem o código
//
// CSS E TRANSIÇÕES:
// As seções colapsam via max-height animado no CSS.
// Por que max-height e não height?
// height: auto não pode ser animado no CSS.
// max-height pode — então animamos de max-height: 600px
// para max-height: 0, criando o efeito de colapso suave.
// ═══════════════════════════════════════════════════════


// ── toggleSection ─────────────────────────────────────────
// Abre ou fecha uma seção da nav ao clicar no cabeçalho.
// Chamada pelo onclick no HTML: onclick="toggleSection('sectionPlacar')"
//
// O CSS faz a animação — o JS só adiciona/remove a classe.
// Separação de responsabilidades: JS controla estado,
// CSS controla aparência.
window.toggleSection = function(secaoId) {
    const secao = document.getElementById(secaoId);
    if (!secao) return;

    const estaFechada = secao.classList.contains('collapsed');

    // Toggle: se esta fechada, abre e se estiver aberta fecha.
    secao.classList.toggle('collapsed', !estaFechada);

    // Atualiza aria-expanded para acessibilidade -
    //leitores de tela anunciam se a secao esta aberta ou fechada
    const botao = secao.querySelector('.nav-section-header');
    if (botao) {
        botao.setAttribute('aria-expanded', estaFechada ? 'true' : 'false');
    }
};
// ── mostrarNav ────────────────────────────────────────────
// Exibe a sidebar com animação de entrada (translateX no CSS).
// Chamada pelo main.js quando o jogo começa.
export function mostrarNav() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('visible');
}

// ── atualizarTurno ────────────────────────────────────────
// Atualiza o card de turno na sidebar.
// Recebe 'white' ou 'black' e atualiza texto + ícone.
//
// A animação de bounce na peça é feita pelo CSS —
// removemos e re-adicionamos a classe para "resetar"
// a animação (truque: forçar reflow com offsetWidth)
export function atualizarTurno(cor) {
    const elPeca = document.getElementById('turnPiece');
    const elNome = document.getElementById('turnName');
    if (!elPeca || !elNome) return;

    elPeca.textContent = cor === 'white' ? '♔' : '♚';
    elNome.textContent = cor === 'white' ? 'Brancas' : 'Pretas';

    // Reinicia a animacao de bounce
    elPeca.classList.remove('bounce');
    void elPeca.offsetWidth; // forca o browser a "ver" a remocao
    elPeca.classList.add('bounce');
}

// ── atualizarPlacar ───────────────────────────────────────
// Atualiza os números do placar e anima o que mudou.
export function atualizarPlacar(placar) {
    const elBrancas = document.getElementById('numWhite');
    const elPretas = document.getElementById('numBlack');
    if (!elBrancas || !elPretas) return;

    elBrancas.textContent = placar.white;
    elPretas.textContent = placar.black;
}

// Anima o numero do placar com efeito de "pop"
export function animarPlacar(cor) {
    const el = document.getElementById(cor === 'white' ? 'numWhite' : 'numBlack');
    if (!el) return;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
}

// ── atualizarCapturadas ───────────────────────────────────
// Exibe os símbolos das peças capturadas na sidebar.
//
// capturadasPorBrancas = peças pretas que as brancas capturaram
// capturadasPorPretas  = peças brancas que as pretas capturaram
export function atualizarCapturadas(capturadasPorBrancas, capturadasPorPretas) {
    const elPorBrancas = document.getElementById('capturedByWhite');
    const elPorPretas = document.getElementById('capturedByBlack');

    if (elPorBrancas) elPorBrancas.textContent = capturadasPorBrancas.join(' ');
    if (elPorPretas) elPorPretas.textContent = capturadasPorPretas.join(' ');
}

// ── adicionarHistorico ────────────────────────────────────
// Adiciona uma jogada ao histórico na sidebar.
// Usa notação simplificada (ex: "e2→e4").
//
// TODO: futuramente implementar notação algébrica padrão
//       do xadrez (ex: "e4", "Nf3", "O-O" para roque)
export function adicionarHistorico(notacao, cor, numero) {
    const el = document.getElementById('history');
    if (!el) return;

    // Remove a mensagem "nenhuma jogada" na primeira jogada
    const vazio = el.querySelector('.history-empty');
    if (vazio) vazio.remove();

    // Busca a linha do turno atual ou cria uma nova
    let linhaTurno = el.querySelector(`[data-turno="${numero}"]`);

    if (!linhaTurno) {
        linhaTurno = document.createElement('div');
        linhaTurno.className = 'history-move';
        linhaTurno.dataset.turno = numero;
        linhaTurno.innerHTML = `
            <span class="move-num">${numero}.</span>
            <span class="move-white"></span>
            <span class="move-black"></span>
        `;
        // Insere no topo para mostrar jogadas mais recentes primeiro
        el.insertBefore(linhaTurno, el.firstChild);
    }

    const classe = cor === 'white' ? '.move-white' : '.move-black';
    const span = linhaTurno.querySelector(classe);
    if (span) span.textContent = notacao;
}

// ── setStatus ─────────────────────────────────────────────
// Atualiza a mensagem de status abaixo do tabuleiro.
// tipo: 'normal' | 'alerta' | 'sucesso'
export function setStatus(mensagem, tipo = 'normal') {
    const el = document.getElementById('boardStatus');
    if (!el) return;

    el.textContent = mensagem;
    el.className = 'board-status';

    if (tipo === 'alerta') el.classList.add('alert');
    if (tipo === 'sucesso') el.classList.add('success')
}

// ── sincronizarToggle ─────────────────────────────────────
// Mantém o toggle do modal e o da sidebar em sincronia.
// Quando um muda, o outro acompanha.
window.syncToggle = function(origem, destinoId) {
    const destino = document.getElementById(destinoId);
    if (destino) destino.checked = origem.checked;
};