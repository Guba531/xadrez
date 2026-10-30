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
import { renderizar, desenharAvisoXeque } from './render/drawBoard.js';
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
import { mostrarXequeMate } from './ui/xequeMate.js';
import { posicaoParaNotacao } from './core/utils.js';
import { sincronizarConfiguracoesIniciais } from './ui/nav.js';
import { animarMovimento } from './animations/animations.js';
import { tocarSomClique, tocarSomComer, tocarSomDeslizar, tocarSomPerigo } from './ui/sons.js';


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
  jogoFinalizado: false,
  animarMovimento: null,
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
  if (estado.bloqueado) return;
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

async function processarClique(row, col) {
  // async é uma palavra-chave usada para declarar uma função assíncrona.
  // Uma função declarada com async sempre retorna uma Promise.
  // Uma Promise representa o resultado de uma operação que poderá estar 
  // disponível agora ou no futuro.

  if (estado.jogoFinalizado) return;
  const peca = estado.board.grid[row][col];

  // --- [DIFERENÇA 1] BUSCAR O ESTADO DO SWITCH DE ALERTAS ---
  // Criamos essa variável logo no início para usar em todo o clique
  const elAlerts = document.getElementById('configAlerts');
  const modoAlertas = elAlerts ? elAlerts.checked : true;

  // 1. TENTAR MOVER
  const ehMovimentoValido = estado.movValidos.find(m => m.row === row && m.col === col);

  if (estado.selecionado && ehMovimentoValido) {
    const pecaSendoMovida = estado.board.grid[estado.selecionado.row][estado.selecionado.col];

    // --- [DIFERENÇA 2] LÓGICA DO REI (BLOQUEIO) ---
    // Se for o REI indo para o risco, é proibido.
    if (ehMovimentoValido.isRisk && pecaSendoMovida.type === 'king') {
      if (modoAlertas) alert("❌ Movimento Ilegal: Rei em Xeque!");

      // Mesmo sem alerta, limpamos a seleção porque o lance não pode ocorrer
      estado.selecionado = null;
      estado.movValidos = [];
      renderizarEstado();
      return;
    }

    //---[DIFERENCA 3] LOGICA DO SACRIFICIO (SILENCIOSA) ---
    // Verificamos o risco ANTES de executar o movimento
    if (ehMovimentoValido.isRisk) {
      // Se modoAlertas for FALSE, ele ignora o IF e move direto
      if (modoAlertas) {
        // await significa, aproximadamente, “aguarde o resultado 
        // desta operação assíncrona antes de continuar nesta função”.
        // await não congela o navegador inteiro. Ele suspende a
        //  continuação daquela função assíncrona enquanto a Promise está pendente,
        //  permitindo que o restante do ambiente JavaScript continue trabalhando.
        const som = await tocarSomPerigo();
        const confirmar = confirm("⚠️ Esta casa está sob ataque! Deseja mover mesmo assim?");
        if (som) {
          som.pause();
          som.currentTime = 0;
        }
        if (!confirmar) return; // Se cancelar, sai da função e não move
      }

    }
    tocarSomClique();
    executarMovimento(estado.selecionado.row, estado.selecionado.col, row, col);
    return; // Movimento feito, encerra aqui
  }

  //--- [DIFERENCA 4] DIAGNOSTICO SO APARECE SE VOCE QUISER ---
  if (estado.selecionado) {
    const pecaSel = estado.board.grid[estado.selecionado.row][estado.selecionado.col];
    // Adicionamos "&& modoAlertas" na condicao
    if (pecaSel && pecaSel.type === 'king' && (col === 2 || col === 6) && modoAlertas) {
      const motivo = explicarBloqueioRoque(estado.selecionado.row, estado.selecionado.col, col);
      if (motivo) {
        alert("⚠️ Roque Invalido\n" + motivo);
        estado.selecionado = null;
        estado.movValidos = [];
        renderizarEstado();
        return;
      }
    }
  }
  // 2. SELECIONAR PEÇA (Se clicou em uma peça da sua cor)
  if (peca && peca.color === estado.turnoAtual) {
    estado.selecionado = { row, col };

    const checkboxRisco = document.getElementById('configRisk');
    const mostrarRisco = checkboxRisco ? checkboxRisco.checked : false;
    const brutos = estado.board.getValidMoves(row, col);

    estado.movValidos = brutos.filter(m => {
      const boardSimulado = estado.board.clonar();
      boardSimulado.moverPeca(row, col, m.row, m.col);

      if (boardSimulado.estaEmXeque(estado.turnoAtual)) return false;
      if (m.isCastling && m.isRisk) return false;

      return true;
    }).map(m => ({
      ...m,
      // O Board diz se a casa é perigosa
      isRisk: estado.board.estaSendoAtacada(m.row, m.col, peca.color),
      // O Main verifica se a casa de destino tem uma peça (Capture)
      isCapture: estado.board.grid[m.row][m.col] !== null
    }));

    const qtd = estado.movValidos.length;
    // --- [NOVO] AVISO DE PEÇA PRESA (PINNED) ---
    // Se a peça tinha movimentos possíveis "no papel" (brutos.length > 0),
    // mas todos foram filtrados pela simulação de xeque, ela está presa
    // protegendo o Rei — e o jogador merece saber o motivo.
    if (qtd === 0 && brutos.length > 0) {
      if (modoAlertas) {
        alert(`⚠️ ${peca.symbol} esta presa!\nMover essa peca deixaria seu Rei em xeque.`)
      }
      setStatus("Peca presa - protegendo o Rei", 'alerta');
    } else {
      setStatus(qtd > 0 ? `${peca.symbol} selecionado` : "Sem movimentos");
    }

    tocarSomClique()

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

  const pecaMovida = estado.board.grid[deRow][deCol];
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
    tocarSomComer();
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

  const estaEmXeque = estado.board.estaEmXeque(proximoTurno);
  console.log("O Rei branco esta em xeque?", estado.board.estaEmXeque('white'))
  console.log("O Rei preto esta em xeque?", estado.board.estaEmXeque('black'));
  const temJogadas = estado.board.temMovimentosLegais(proximoTurno);

  atualizarTurno(proximoTurno);

  // --- [NOVO] VERIFICAR XEQUE APÓS O MOVIMENTO ---

  if (estaEmXeque) {
    estado.avisoXequePendente = true;
    if (temJogadas) {
      setStatus(`XEQUE! Vez das ${proximoTurno === 'white' ? 'Brancas' : 'Pretas'}`, 'alerta');
      estado.jogoFinalizado = false;
    } else {
      const vencedor = proximoTurno === 'white' ? 'Pretas' : 'Brancas';
      setStatus(`XEQUE-MATE! Vitoria das ${estado.turnoAtual === 'white' ? 'Brancas' : 'Pretas'}`, 'alerta');
      estado.jogoFinalizado = true; // Bloquear o jogo aqui
      mostrarXequeMate();
    }
  } else {
    // [EXTRA] Empate por Afogamento (Stalmate)
    if (!temJogadas) {
      setStatus("EMPATE! Afogamento (Stalmate)", 'alerta');
      estado.jogoFinalizado = true;
    } else {
      setStatus(`${proximoTurno === 'white' ? 'Brancas' : 'Pretas'} - sua vez`);
      estado.jogoFinalizado = false;
    }
  }
  if (estado.animacoesAtivas) {

    estado.animarMovimento = {
      peca: pecaMovida,
      row: deRow,
      col: deCol,
      paraRow,
      paraCol
    };

    animarMovimento(
      pecaMovida,
      deRow,
      deCol,
      paraRow,
      paraCol,
      (peca, row, col, angulo, rastro) => {

        estado.animarMovimento = {
          peca,
          row,
          col,
          paraRow,
          paraCol,
          angulo,
          rastro
        };

        renderizarEstado();
      },
      // 2. Callback executado quando a animacao termina.
      () => {
        estado.animarMovimento = null;
        renderizarEstado();
      }
    );

  } else {
    // Se as animações estiverem desativadas,
    // desenha o tabuleiro normalmente.
    estado.animarMovimento = null;
    renderizarEstado();
  }
  tocarSomDeslizar();
}

//Primeiro callback: atualiza a posição visual da peça enquanto ela se move.
//Segundo callback: limpa o estado da animação quando ela chega ao destino e redesenha o tabuleiro normalmente.

// ── RENDERIZAR ESTADO ─────────────────────────────────────
// Desenha o tabuleiro com o estado atual.
// Centraliza a chamada para não repetir em vários lugares.

let loopAnimacaoAtivo = false;
let piscadasRestantes = 0;
let visivelAnterior = null;

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
    mostrarRisco,
    estado.animarMovimento
  );

  //Verifica se o turno atual esta em xeque e desenha o aviso
  const estaEmXeque = estado.board.estaEmXeque(estado.turnoAtual);

  if (estaEmXeque && !loopAnimacaoAtivo && estado.avisoXequePendente) {
    loopAnimacaoAtivo = true;
    estado.bloqueado = true;
    piscadasRestantes = 3;
    visivelAnterior = null;
    estado.avisoXequePendente = false;
    requestAnimationFrame(animarXeque);
  }
}

function animarXeque() {
  if (!loopAnimacaoAtivo) return;

  renderizar(
    ctx,
    estado.board.grid,
    estado.selecionado,
    estado.movValidos,
    true,
    true
  );

  const blink = Math.floor(Date.now() / 300) % 2 === 0;
  desenharAvisoXeque(ctx, blink);

  if (visivelAnterior === true && blink === false) {
    piscadasRestantes--;
  }
  visivelAnterior = blink;

  if (piscadasRestantes > 0) {
    requestAnimationFrame(animarXeque);
  } else {
    loopAnimacaoAtivo = false;
    estado.bloqueado = false;
    renderizar(
      ctx,
      estado.board.grid,
      estado.selecionado,
      estado.movValidos,
      true,
      true
    );
  }
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

function explicarBloqueioRoque(reiRow, reiCol, destinoCol) {
  const rei = estado.board.grid[reiRow][reiCol];
  const cor = rei.color;
  const ehRoquePequeno = (destinoCol === 6); //Coluna 6
  const torreCol = ehRoquePequeno ? 7 : 0;
  const torre = estado.board.grid = [reiRow][reiCol];

  // 1. Verificar se o Rei moveu
  if (rei.moveu) return "O Roque não e permitido porque o Rei ja se moveu nesta partida";

  // 2. Verificar a Torre
  if (!torre || torre.type !== 'rook' || torre.moveu) {
    return `O Roque deste lado não e permitido porque a Torre na coluna ${ehRoquePequeno ? 'H' : 'A'} ja se moveu ou foi capturada.`;
  }

  // 3. Verificar se esta em Xeque agora
  if (estado.board.estaEmXeque(cor)) {
    return "Voce não pode fazer o Roque enquanto 0 seu Rei estiver em Xeque!";
  }

  // 4. Verificar se o caminho esta livre
  const inicio = Math.min(reiCol, torreCol) + 1;
  const fim = Math.max(reiCol, torreCol);
  for (let c = inicio; c < fim; c++) {
    if (estado.board.grid[reiRow][c] !== null) {
      return "O Roque esta bloqueado por pecas no caminho";
    }
  }

  // 5. Verificar se o Rei passara por uma casa atacada
  // No roque pequeno, ele passa pela coluna 5. No grande, pela coluna 3.
  const casaPassagem = ehRoquePequeno ? 5 : 3;
  if (estado.board.estaSendoAtacada(reiRow, casaPassagem, cor)) {
    return "O Roque não e permitido porque o Rei passaria por cima de uma casa sob ataque.";
  }

  if (estado.board.estaSendoAtacada(reiRow, destinoCol, cor)) {
    return "O Roque não e permitido porque a casa de destino do rei esta sendo atacada.";
  }

  return null; // Se chegou aqui, nao ha erro obvio (não deveria acontecer se o clique falhou)
}