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

import { Board }      from './core/board.js';
import { renderizar } from './render/drawBoard.js';
import {abrirModal, fecharModal, lerConfiguracoes } from './ui/modal.js';
import {
    mostrarNav,
    atualizarTurno,
    atualizarPlacar,
    animarPlacar,
    atualizarCapturadas,
    atualizarHistorico,
    setStatus
} from './ui/nav.js';
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
    placar: { white: 0, black: 0},
    captPorBrancas: [], // simbolos das pecas capturadas pelas brancas
    captPorPretas: [], // simbolos das pecas capturadas pelas pretas
    numeroTurno: 1, // contador de turnos para o historico
    animacoesAtivas: true,
};

// ── CANVAS ────────────────────────────────────────────────
// Pegamos o canvas e seu contexto 2D uma vez.
// O contexto (ctx) é o objeto com todos os métodos de desenho.

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// ── INICIAR JOGO ──────────────────────────────────────────
// Chamada pelo botão do modal. Lê as configurações,
// monta o tabuleiro e prepara a interface.
//
// Por que window.startGame?
// O onclick no HTML chama startGame() — como estamos em
// um ES Module, precisamos expor a função globalmente.

window.startGame = function(){
    // Lê as escolhas do modal
    estado.config = lerConfiguracoes();
    estado.animacoesAtivas = estado.config.animacoes;
    fecharModal();

    estado.board = new Board();
    estado.turnoAtual = 'White';
    estado.selecionado = null;
    estado.movValidos = [];
    estado.placar = {white: 0, black: 0};
    estado.captPorBrancas = [];
    estado.captPorPretas = [];
    estado.numeroTurno = 1;
    
    renderizar(); //adicionar props
};