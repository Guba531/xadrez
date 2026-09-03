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
import {
  mostrarNav,
  atualizarTurno,
  atualizarPlacar,
  animarPlacar,
  atualizarCapturadas,
  adicionarHistorico,
  setStatus
} from './ui/nav.js';
import { posicaoParaNotacao } from './core/utils.js';
import { sincronizarConfiguracoesIniciais } from './ui/nav.js';


// ── ESTADO DO JOGO ────────────────────────────────────────
// Todas as variáveis que descrevem a situação atual da partida.
// Ficam aqui no main.js porque pertencem ao jogo como um todo,
// não a nenhum módulo específico.
//
// TODO: futuramente podemos criar um core/game.js para
//       encapsular esse estado e a lógica de turno/xeque.
const estado = {
  board: null,         // instância de Board
  config: null,         // configurações da partida
  turnoAtual: 'white',      // 'white' | 'black'
  selecionado: null,         // { row, col } ou null
  movValidos: [],           // array de { row, col }
  placar: { white: 0, black: 0 },
  captPorBrancas: [],        // símbolos das peças capturadas pelas brancas
  captPorPretas: [],        // símbolos das peças capturadas pelas pretas
  numeroTurno: 1,            // contador de turnos para o histórico
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

  // Mostra o app e a nav com animações CSS
  document.getElementById('app').classList.add('visible');
  document.querySelector('.board-wrapper').classList.add('visible');
  mostrarNav();

  // Reinicia o estado
  estado.board = new Board();
  estado.turnoAtual = 'white';
  estado.selecionado = null;
  estado.movValidos = [];
  estado.placar = { white: 0, black: 0 };
  estado.captPorBrancas = [];
  estado.captPorPretas = [];
  estado.numeroTurno = 1;

  // Atualiza a sidebar
  atualizarTurno('white');
  atualizarPlacar(estado.placar);
  atualizarModoDisplay();
  sincronizarConfiguracoesIniciais(estado.config);

  // Desenha o tabuleiro inicial
  renderizar(ctx, estado.board.grid, null, []);

  setStatus('Brancas começam — selecione uma peça');
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

  // Divide pelo tamanho da casa (60px) para obter o índice
  const col = Math.floor(pixelX / 60);
  const row = Math.floor(pixelY / 60);

  // Garante que o clique foi dentro do tabuleiro
  if (col < 0 || col > 7 || row < 0 || row > 7) return;

  processarClique(row, col);
});

// ── PROCESSAR CLIQUE ──────────────────────────────────────
// Lógica principal de interação:
//   - Se há peça selecionada e clicou em movimento válido → move
//   - Se clicou em peça do turno atual → seleciona
//   - Caso contrário → deseleciona
function processarClique(row, col) {
  const peca = estado.board.grid[row][col];

  // 1. TENTAR MOVER (Se já houver algo selecionado e o clique for em casa válida)
  const ehMovimentoValido = estado.movValidos.find(m => m.row === row && m.col === col);

  if (estado.selecionado && ehMovimentoValido) {
    // Verificamos o risco ANTES de executar o movimento
    if (ehMovimentoValido.isRisk) {
      const confirmar = confirm("⚠️ Esta casa está sob ataque! Deseja mover mesmo assim?");
      if (!confirmar) return; // Se cancelar, sai da função e não move
    }

    executarMovimento(estado.selecionado.row, estado.selecionado.col, row, col);
    return; // Movimento feito, encerra aqui
  }

  // 2. SELECIONAR PEÇA (Se clicou em uma peça da sua cor)
  if (peca && peca.color === estado.turnoAtual) {
    estado.selecionado = { row, col };

    // Buscamos o valor do Switch na Sidebar/Configurações
    const checkboxRisco = document.getElementById('configRisk');
    const mostrarRisco = checkboxRisco ? checkboxRisco.checked : false;

    // Pegamos os movimentos brutos e calculamos o risco para cada um
    const brutos = estado.board.getValidMoves(row, col);

    estado.movValidos = brutos.map(m => {
      return {
        row: m.row,
        col: m.col,
        // O Board diz se a casa é perigosa
        isRisk: estado.board.estaSendoAtacada(m.row, m.col, peca.color),
        // O Main verifica se a casa de destino tem uma peça (Capture)
        isCapture: estado.board.grid[m.row][m.col] !== null
      };
    });

    const qtd = estado.movValidos.length;
    setStatus(qtd > 0 ? `${peca.symbol} selecionado` : "Sem movimentos");

    renderizarEstado();
    return; // Seleção feita, encerra aqui
  }

  // 3. DESSELECIONAR (Se clicou em casa vazia ou inválida)
  estado.selecionado = null;
  estado.movValidos = [];
  setStatus(`${estado.turnoAtual === 'white' ? 'Brancas' : 'Pretas'} — selecione uma peça`);
  renderizarEstado();
}

// ── EXECUTAR MOVIMENTO ────────────────────────────────────
// Aplica o movimento ao board, atualiza o estado e a UI.
function executarMovimento(deRow, deCol, paraRow, paraCol) {
  const pecaMovida = estado.board.grid[deRow][deCol];

  // --- [NOVO] LÓGICA DO ROQUE ---
  // Buscamos os dados extras do movimento que o jogador escolheu
  const movimentoData = estado.movValidos.find(m => m.row === paraRow && m.col === paraCol);

  if (movimentoData && movimentoData.isCastling) {
    const { rookFromCol, rookToCol } = movimentoData;
    // Movemos a Torre manualmente junto com o Rei
    const torre = estado.board.grid[deRow][rookFromCol];
    estado.board.grid[deRow][rookToCol] = torre;
    estado.board.grid[deRow][rookFromCol] = null;
    if (torre) torre.moveu = true;
  }

  const capturada = estado.board.moverPeca(deRow, deCol, paraRow, paraCol);

  // Atualiza capturadas e placar se houve captura
  if (capturada) {
    if (capturada.color === 'black') {
      estado.captPorBrancas.push(capturada.symbol);
      estado.placar.white++;
      animarPlacar('white');
    } else {
      estado.captPorPretas.push(capturada.symbol);
      estado.placar.black++;
      animarPlacar('black');
    }
    atualizarPlacar(estado.placar);
    atualizarCapturadas(estado.captPorBrancas, estado.captPorPretas);
  }

  // Registra no histórico
  const notacao = `${posicaoParaNotacao(deRow, deCol)}→${posicaoParaNotacao(paraRow, paraCol)}`;
  adicionarHistorico(notacao, estado.turnoAtual, estado.numeroTurno);

  // Troca o turno
  const proximoTurno = estado.turnoAtual === 'white' ? 'black' : 'white';
  if (estado.turnoAtual === 'black') estado.numeroTurno++;

  estado.turnoAtual = proximoTurno;
  estado.selecionado = null;
  estado.movValidos = [];

  atualizarTurno(proximoTurno);

   // --- [NOVO] VERIFICAR XEQUE APÓS O MOVIMENTO ---
  const estaEmXeque = estado.board.estaEmXeque(proximoTurno);
  
  if (estaEmXeque) {
    setStatus(`XEQUE! Vez das ${proximoTurno === 'white' ? 'Brancas' : 'Pretas'}`, 'alerta');
  } else {
    setStatus(`${proximoTurno === 'white' ? 'Brancas' : 'Pretas'} — sua vez`);
  }
  renderizarEstado();

}

// ── RENDERIZAR ESTADO ─────────────────────────────────────
// Desenha o tabuleiro com o estado atual.
// Centraliza a chamada para não repetir em vários lugares.
function renderizarEstado() {
    // Verifica se os elementos existem antes de pegar o .checked para evitar novos erros
  const elMove = document.getElementById('configShowMoves');
  const elRisk = document.getElementById('configRisk');
  // Lê os valores atuais dos switches na sidebar
  const mostrarMovimentos = elMove ? elMove.checked : true;
  const mostrarRisco = elRisk ? elRisk.checked : true;

  // Passa esses valores para o renderizador
  renderizar(
    ctx, 
    estado.board.grid, 
    estado.selecionado, 
    estado.movValidos, 
    mostrarMovimentos, 
    mostrarRisco
  );
}

// ── HELPERS DE UI ───────────────────────────────────────── 
function atualizarModoDisplay() {
  const el = document.getElementById('modeDisplay');
  if (!el) return;

  const { modo, dificuldade, corJogador } = estado.config;
  if (modo === 'ai') {
    const cor = corJogador === 'white' ? 'Brancas' : 'Pretas';
    const diff = dificuldade === 'easy' ? 'Fácil' : 'Difícil';
    el.textContent = `Você (${cor}) × IA (${diff})`;
  } else {
    el.textContent = 'Dois jogadores';
  }
}

// ── AÇÕES GLOBAIS (chamadas pelo HTML) ────────────────────
window.openModal = function () {
  document.getElementById('app').classList.remove('visible');
  document.querySelector('.board-wrapper').classList.remove('visible');
  document.getElementById('sidebar').classList.remove('visible');
  abrirModal();
};

// TODO: implementar desfazer jogada
// Precisará de um array de estados anteriores (histórico de boards)
window.undoMove = function () {
  setStatus('Desfazer ainda não implementado', 'alerta');
};

// ── INICIALIZAÇÃO ─────────────────────────────────────────
// Quando o módulo carrega, abrimos o modal imediatamente.
// Nenhum jogo existe ainda — o usuário precisa configurar.
abrirModal();

// --- LISTENERS DE CONFIGURAÇÃO NA SIDEBAR ---

// 1. Lógica das Coordenadas
document.getElementById('configCoords').addEventListener('change', (e) => {
  const coords = document.querySelectorAll('.coord-row, .coord-col');
  coords.forEach(el => el.style.opacity = e.target.checked ? '1' : '0');
});
// 2. Lógica de Mostrar/Esconder Movimentos
document.getElementById('configShowMoves').addEventListener('change', () => {
  renderizarEstado(); // Redesenha com as novas permissões
});

// 3. Sincronizar o Risco
document.getElementById('configRisk').addEventListener('change', () => {
  renderizarEstado(); // Redesenha com as novas permissões
});