// ═══════════════════════════════════════════════════════
// core/board.js
//
// O QUE É ESTE ARQUIVO?
// Representa o ESTADO do tabuleiro — onde cada peça está.
//
// O QUE É "ESTADO"?
// Estado é o conjunto de dados que descreve a situação
// atual do jogo a qualquer momento. No xadrez, o estado
// principal é: quais peças estão em quais casas.
//
// POR QUE UMA CLASSE E NÃO UM ARRAY SIMPLES?
// Uma classe agrupa dados (o grid) E os comportamentos
// relacionados a esses dados (mover peça, buscar movimentos).
// Isso mantém tudo organizado no mesmo lugar — se algo
// der errado com o tabuleiro, sabemos exatamente onde olhar.
//
// RELAÇÃO COM OUTROS MÓDULOS:
//   board.js   ← usa → pieces/ (para criar as peças)
//   board.js   ← usa → utils.js (para clonar, validar)
//   game.js    ← usa → board.js (para verificar xeque etc.)
//   drawBoard  ← usa → board.js (para ler o grid e desenhar)
//   main.js    ← usa → board.js (para orquestrar o jogo)
// ═══════════════════════════════════════════════════════

import { clonarTabuleiro } from './utils.js';
import { Pawn } from './pieces/pawn.js';
import { Rook } from './pieces/rook.js';
import { Bishop } from './pieces/bishop.js';
import { King } from './pieces/king.js';
import { Queen } from './pieces/queen.js';
import { Knight } from './pieces/knight.js';



// TODO (próximas aulas): importar as demais peças
// import { Rook }   from './pieces/rook.js';
// import { Knight } from './pieces/knight.js';
// import { Bishop } from './pieces/bishop.js';
// import { Queen }  from './pieces/queen.js';
// import { King }   from './pieces/king.js';


export class Board {

  constructor() {
    // O tabuleiro é um array 2D de 8×8 posições.
    // Cada posição contém uma instância de Piece ou null.
    //
    // grid[0][0] = canto superior esquerdo (a8)
    // grid[7][7] = canto inferior direito  (h1)
    //
    // Visualizando:
    //   grid[0] = fileira 8 (peças pretas — torres, cavalos...)
    //   grid[1] = fileira 7 (peões pretos)
    //   grid[2..5] = fileiras 6 a 3 (vazias no início)
    //   grid[6] = fileira 2 (peões brancos)
    //   grid[7] = fileira 1 (peças brancas — torres, cavalos...)
    this.grid = this.#criarGridInicial();
  }

  // ── #criarGridInicial ──────────────────────────────────
  // Método PRIVADO (# no início) — só pode ser chamado
  // de dentro desta classe. Monta o tabuleiro na posição
  // inicial padrão do xadrez.
  //
  // Por que privado? O grid só deve ser montado no constructor.
  // Ninguém de fora precisa chamar esse método diretamente.
  #criarGridInicial() {

    // Cria 8 linhas, cada uma com 8 posições null (vazio)
    // Array.from + map é uma forma limpa de criar arrays 2D
    const grid = Array.from({ length: 8 }, () => Array(8).fill(null));

    // ── Peões ──────────────────────────────────────────
    // Fileira 1 (grid[1]) = peões pretos
    // Fileira 6 (grid[6]) = peões brancos
    for (let col = 0; col < 8; col++) {
      grid[1][col] = new Pawn('black');
      grid[6][col] = new Pawn('white');
    }

    // TODO (próximas aulas): adicionar as demais peças
    // A ordem da fileira de trás é sempre:
    // torre, cavalo, bispo, rainha, rei, bispo, cavalo, torre
    //
    // const fileiraPreta  = ['rook','knight','bishop','queen','king','bishop','knight','rook'];
    // const fileiraFabrica = { rook: Rook, knight: Knight, bishop: Bishop, queen: Queen, king: King };
    //
    // fileiraPreta.forEach((tipo, col) => {
    //   const Classe = fileiraFabrica[tipo];
    //   grid[0][col] = new Classe('black');
    //   grid[7][col] = new Classe('white');
    // });

    // ── Torres ─────────────────────────────────────────
    // As torres ficam nos quatro cantos do tabuleiro.

    // Torres Pretas (Fileira 0)
    grid[0][0] = new Rook('black');
    grid[0][7] = new Rook('black');

    // Torres Brancas (Fileira 7)
    grid[7][0] = new Rook('white');
    grid[7][7] = new Rook('white');

    // ── Bispos ─────────────────────────────────────────
    // Bispos Pretos
    grid[0][2] = new Bishop('black');
    grid[0][5] = new Bishop('black');

    // Bispos Brancos
    grid[7][2] = new Bishop('white');
    grid[7][5] = new Bishop('white');

    // ── Rei ─────────────────────────────────────────
    // Rei Preto 
    grid[0][4] = new King('black');

    // Rei Branco (Linha 7, Coluna 4)
    grid[7][4] = new King('white');

    // ── Rainha ─────────────────────────────────────────
    // Rainha Preta (Linha 0, Coluna 3)
    grid[0][3] = new Queen('black');

    // Rainha Branca (Linha 7, Coluna 3)
    grid[7][3] = new Queen('white');

    // ── Cavalos ─────────────────────────────────────────
    // Cavalos Pretos (Linha 0, Colunas 1 e 6)
    grid[0][1] = new Knight('black');
    grid[0][6] = new Knight('black');

    // Cavalos Brancos (Linha 7, Colunas 1 e 6)
    grid[7][1] = new Knight('white');
    grid[7][6] = new Knight('white');

    return grid;
  }

  // ── getValidMoves ──────────────────────────────────────
  // Pede à peça na posição informada quais movimentos ela
  // pode fazer. Delega para o método da própria peça.
  //
  // Por que o board delega para a peça?
  // Polimorfismo — o board não precisa saber as regras de
  // cada peça. Ele apenas pergunta: "para onde você pode ir?"
  // A peça responde com sua própria lógica.
  //
  // TODO: futuramente este método vai filtrar movimentos que
  //       deixariam o rei em xeque — isso exige clonarTabuleiro()
  //       e simular a jogada antes de confirmar.
  getValidMoves(row, col) {
    const peca = this.grid[row][col];
    if (!peca) return [];
    return peca.getValidMoves(row, col, this.grid);
  }

  // ── moverPeca ──────────────────────────────────────────
  // Executa um movimento no tabuleiro:
  //   1. Move a peça da origem para o destino
  //   2. Marca que a peça já se moveu (importante para peão e roque)
  //   3. Limpa a casa de origem
  //   4. Retorna a peça capturada (ou null se casa estava vazia)
  //
  // Por que retornar a peça capturada?
  // O main.js precisa saber se houve captura para atualizar
  // o placar e a lista de peças capturadas na sidebar.
  moverPeca(deRow, deCol, paraRow, paraCol) {
    const capturada = this.grid[paraRow][paraCol];
    const peca = this.grid[deRow][deCol];

    this.grid[paraRow][paraCol] = peca;
    this.grid[deRow][deCol] = null;

    // Marca que esta peça já se moveu pelo menos uma vez
    if (peca) peca.moveu = true;

    return capturada;
  }

  // ── clonar ─────────────────────────────────────────────
  // Devolve uma cópia independente deste Board.
  // Usado pela IA e pela verificação de xeque para simular
  // jogadas sem alterar o estado real do jogo.
  //
  // TODO: por que não basta fazer const copia = this?
  //       Teste no console e veja o que acontece ao modificar.
  clonar() {
    const novo = new Board();
    novo.grid = clonarTabuleiro(this.grid);
    return novo;
  }

  //———————————Lógica para detectar casa de risco———————————————————————————————
  estaSendoAtacada(row, col, corDaPeca) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const pecaInimiga = this.grid[r][c];

        if (pecaInimiga && pecaInimiga.color !== corDaPeca) {
          // MUDANÇA AQUI: usamos getAttackedSquares
          const casasAmeacadas = pecaInimiga.getAttackedSquares(r, c, this.grid);

          if (casasAmeacadas.some(m => m.row === row && m.col === col)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // 1. Acha a posição do Rei de uma cor específica
  localizarRei(cor) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.grid[r][c];
        if (p && p.type === 'king' && p.color === cor) {
          return { row: r, col: c };
        }
      }
    }
    return null;
  }

  // 2. Verifica se o Rei de uma cor está em Xeque
  estaEmXeque(cor) {
    const reiPos = this.localizarRei(cor);
    if (!reiPos) return false;
    // O Rei está em xeque se a casa dele "está sendo atacada"
    return this.estaSendoAtacada(reiPos.row, reiPos.col, cor);
  }
}