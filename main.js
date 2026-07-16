// ═══════════════════════════════════════════════════════
// main.js
//
// O QUE É ESTE ARQUIVO?
// O MAESTRO do jogo — não executa nada diretamente,
// mas orquestra todos os módulos para funcionarem juntos.
//
// ANALOGIA:
// Pense num restaurante:
//   core/    → a cozinha (regras, lógica, dados)
//   render/  → o prato (como as coisas aparecem)
//   ui/      → o garçom (interação com o usuário)
//   main.js  → o gerente (coordena tudo)
//
// O gerente não cozinha nem serve — ele garante que
// cada parte faz seu trabalho na hora certa.
//
// POR QUE type="module" NO HTML?
// ES Modules permite dividir o código em arquivos usando
// import/export. Sem ele, o browser não entende 'import'.
// Por isso não funciona abrindo o HTML diretamente —
// precisa de um servidor (Live Server, Python, etc).
//
// FLUXO DO JOGO:
//   1. Página carrega → modal aparece
//   2. Usuário configura → startGame() é chamada
//   3. Board é criado → tabuleiro é desenhado
//   4. Usuário clica → selecionaPeca() ou movePeca()
//   5. Após cada jogada → renderiza + atualiza sidebar
// ═══════════════════════════════════════════════════════

// ── IMPORTS ───────────────────────────────────────────────
// Cada import traz apenas o que precisamos de cada módulo.
// O browser carrega os arquivos automaticamente quando
// encontra estes imports.

import { Board } from './core/board.js';
import { renderizar } from './render/drawBoard.js';
import { abrirModal, fecharModal, lerConfiguracoes } from './ui/modal.js';
/*import {
    mostrarNav,
    atualizarTurno,
    atualizarPlacar,
    animarPlacar,
    atualizarCapturadas,
    atualizarHistorico,
    setStatus
} from './ui/nav.js';*/
import { posicaoParaNotacao } from './core/utils.js';

// ── ESTADO DO JOGO ────────────────────────────────────────
// Todas as variáveis que descrevem a situação atual da partida.
// Ficam aqui no main.js porque pertencem ao jogo como um todo,
// não a nenhum módulo específico.
//
// TODO: futuramente podemos criar um core/game.js para
//       encapsular esse estado e a lógica de turno/xeque.

const estado = {
    board: null, // instancia de Board
    config: null, // configuracoes da partida
    turnoAtual: 'white', // 'white' | 'black'
    selecionado: null, // { row, col } ou null
    movValidos: [], // array de { row, col }
    placar: { white: 0, black: 0 },
    captPorBrancas: [], // simbolos das pecas capturadas pelas brancas
    captPorPretas: [], // simbolos das pecas capturadas pelas pretas
    numeroTurno: 1, // contador de turnos para o historico
    animacoesAtivas: true,
};

// ── CANVAS ────────────────────────────────────────────────
// Pegamos o canvas e seu contexto 2D uma vez.
// O contexto (ctx) é o objeto com todos os métodos de desenho.

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

// ── INICIAR JOGO ──────────────────────────────────────────
// Chamada pelo botão do modal. Lê as configurações,
// monta o tabuleiro e prepara a interface.
//
// Por que window.startGame?
// O onclick no HTML chama startGame() — como estamos em
// um ES Module, precisamos expor a função globalmente.

window.startGame = function () {
    // Lê as escolhas do modal
    estado.config = lerConfiguracoes();
    estado.animacoesAtivas = estado.config.animacoes;
    fecharModal();

    estado.board = new Board();
    estado.turnoAtual = 'White';
    estado.selecionado = null;
    estado.movValidos = [];
    estado.placar = { white: 0, black: 0 };
    estado.captPorBrancas = [];
    estado.captPorPretas = [];
    estado.numeroTurno = 1;

    document.getElementById('app').classList.add('visible');
    document.querySelector('.board-wrapper').classList.add('visible');
    //mostrarNav();

    // ↓ NOVO — só isso precisa ser adicionado hoje
    //board = new Board();
    renderizar(ctx, estado.board.grid, null, []);
};

// ── CLIQUE NO CANVAS ──────────────────────────────────────
// Converte coordenadas do clique (pixels) para posição
// no grid (row, col) e decide o que fazer.
canvas.addEventListener('click', (evento) => {
    // getBoundingClientRect retorna tamanho e posição do canvas
    // na tela. Precisamos disso porque o canvas pode estar
    // redimensionado por CSS — os pixels CSS e do canvas podem
    // ser diferentes. 
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const pixelX = (evento.clientX - rect.left) * scaleX;
    const pixelY = (evento.clientY - rect.top) * scaleY;

    // Divide pelo tamanho da casa (60px) para obter o indice
    const col = Math.floor(pixelX / 60);
    const row = Math.floor(pixelY / 60);

    // Garante que o clique foi dentro do tabuleiro
    if (col < 0 || col > 7 || row < 0 || row > 7) return;

    processarClique(row, col);
});

//-----PROCESSAR CLIQUE-----------------------------------
// Lógica principal de interação:
//   - Se há peça selecionada e clicou em movimento válido → move
//   - Se clicou em peça do turno atual → seleciona
//   - Caso contrário → deseleciona
function processarClique(row, col) {
    const peca = estado.board.grid[row][col];

    //----EXECUTAR MOVIMENTO------------------------------
    // Verifica se o clique foi em uma das casas validas
    const ehMovimentoValido = estado.movValidos.some(
        m => m.row === row && m.col === col
    );
    if (estado.selecionado && ehMovimentoValido) {
        executarMovimento(estado.selecionado.row, estado.selecionado.col, row, col);
        return;
    }

    //----SELECIONAR PECA --------------------------------
    if (peca && peca.color === estado.turnoAtual) {
        estado.selecionado = { row, col };
        estado.movValidos = estado.board.getValidMoves(row, col);

        const qtd = estado.movValidos.length;
        /*setStatus(
            qtd > 0
                ? `${peca.symbol} selecionado - ${qtd} movimento${qtd > 1 ? 's' : ''} disponivel${qtd > 1 ? 'is' : ''}`
                : `${peca.symbol} nao tem movimentos disponiveis`
        );*/

        renderizarEstado();
        return;
    }

    //----DESSELECIONAR----------------------------------
    estado.selecionado = null;
    estado.movValidos = [];
    //setStatus(`${estado.turnoAtual === 'white' ? 'Brancas' : 'Pretas'} - selecione uma peca`);
    //renderizarEstado();
}

// ── EXECUTAR MOVIMENTO ────────────────────────────────────
// Aplica o movimento ao board, atualiza o estado e a UI.
function executarMovimento(deRow, deCol, paraRow, paraCol) {
    const pecaMovida = estado.board.grid[deRow][deCol];
    const capturada = estado.board.moverPeca(deRow, deCol, paraRow, paraCol);

    // Atualiza capturadas e placar se houve captura
    if (capturada) {
        if (capturada.color === 'black') {
            estado.captPorBrancas.push(capturadas.symbol);
            estado.placar.white++;
            animarPlacar('white');
        } else {
            estado.captPorPretas.push(capturada.symbol);
            estado.placar.black++;
            animarPlacar('black');
        }
        atualizarPlacar(estado.placar);
        atualizarCapturas(estado.captPorBrancas, estado.captPorPretas);
    }

    //Registro no historico
    const notacao = `${posicaoParaNotacao(deRow, deCol)}→${posicaoParaNotacao(paraRow, paraCol)}`;
    adicionarHistorico(notacao, estado.turnoAtual, estado.numeroTurno);

    //Troca o turno
    const proximoTurno = estado.turnoAtual === 'white' ? 'black' : 'white';
    if (estado.turnoAtual === 'black') estado.numeroTurno++;

    estado.turnoAtual = proximoTurno;
    estado.selecionado = null;
    estado.movValidos = [];

    atualizarTurno(proximoTurno);
    setStatus(`${proximoTurno === 'white' ? 'Brancas' : 'Pretas'} - sua vez`);
    renderizarEstado();
}

// ── RENDERIZAR ESTADO ─────────────────────────────────────
// Desenha o tabuleiro com o estado atual.
// Centraliza a chamada para não repetir em vários lugares.
function renderizarEstado() {
    renderizar(ctx, estado.board.grid, estado.selecionado, estado.movValidos);
}

// ── AÇÕES GLOBAIS (chamadas pelo HTML) ────────────────────
window.openModal = function() {
    document.getElementById('app').classList.remove('visible');
    document.querySelector('.board-wrapper').classList.remove('visible');
    document.getElementById('sidebar').classList.remove('visible');
        abrirModal();
};

// ── INICIALIZAÇÃO ─────────────────────────────────────────
// Quando o módulo carrega, abrimos o modal imediatamente.
// Nenhum jogo existe ainda — o usuário precisa configurar.
abrirModal();