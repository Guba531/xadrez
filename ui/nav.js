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
window.toggleSection = function(secaoId) {
    const secao = document.getElementById(secaoId);
    if (!secao) return;

    // O método toggle inverte a classe automaticamente
    const foiFechada = secao.classList.toggle('collapsed');

    // Atualiza aria-expanded para acessibilidade -
    // leitores de tela anunciam se a secao esta aberta ou fechada
    const botao = secao.querySelector('.nav-section-header');
    if (botao) {
        botao.setAttribute('aria-expanded', foiFechada ? 'false' : 'true');
    }
};

// ── mostrarNav ────────────────────────────────────────────
// Exibe a sidebar com animação de entrada (translateX no CSS).
// Chamada pelo main.js quando o jogo começa.
export function mostrarNav() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.add('visible');
}

// ── atualizarTurno ────────────────────────────────────────
// Atualiza o card de turno na sidebar.
// Recebe 'white' ou 'black' e atualiza texto + ícone.
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
export function atualizarCapturadas(capturadasPorBrancas, capturadasPorPretas) {
    const elPorBrancas = document.getElementById('capturedByWhite');
    const elPorPretas = document.getElementById('capturedByBlack');

    if (elPorBrancas) elPorBrancas.textContent = capturadasPorBrancas.join(' ');
    if (elPorPretas) elPorPretas.textContent = capturadasPorPretas.join(' ');
}

// ── adicionarHistorico ────────────────────────────────────
// Adiciona uma jogada ao histórico na sidebar.
// Usa notação simplificada (ex: "e2→e4").
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
    if (tipo === 'sucesso') el.classList.add('success');
}

// ── sincronizarToggle ─────────────────────────────────────
// Mantém o toggle do modal e o da sidebar em sincronia.
window.syncToggle = function(origem, destinoId) {
    const destino = document.getElementById(destinoId);
    if (destino) destino.checked = origem.checked;
    // Dispara manualmente um evento de 'change' no destino
    // para que o listener no main.js perceba a mudança!
    destino.dispatchEvent(new Event('change'));
};

// ── toggleSidebar ─────────────────────────────────────────
// Recolhe ou expande a sidebar inteira (efeito mini-menu).
// Chamada pelo botão "sidebarToggle" no HTML.
window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const btn = document.getElementById('sidebarToggle');

    // Alterna a classe que define a largura reduzida no CSS
    sidebar.classList.toggle('collapsed-manual');

    // Muda o icone de < para > dependendo do estado
    if (sidebar.classList.contains('collapsed-manual')) {
        btn.innerHTML = '›';
        btn.title = "Expandir painel";
    } else {
        btn.innerHTML = '‹';
        btn.title = "Recolher painel"
    }
};

// ── sincronizarConfiguracoesIniciais ──────────────────────
// Garante que, ao abrir o jogo, os toggles da sidebar 
// reflitam o que foi escolhido no modal.
export function sincronizarConfiguracoesInicias(config) {
    const toggleAnim = document.getElementById('configAnimations');
    const toggleRisk = document.getElementById('configRisk');

    if (toggleAnim) toggleAnim.checked = config.animacoes;
    // O risco geralmente comeca ligado por padrao se voce configurou assim
    if (toggleRisk) toggleRisk.checked = true;
}