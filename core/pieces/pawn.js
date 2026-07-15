// ═══════════════════════════════════════════════════════
// core/pieces/pawn.js
//
// O QUE É ESTE ARQUIVO?
// Define o PEÃO — a primeira peça que vamos implementar.
//
// POR QUE COMEÇAR PELO PEÃO?
// O peão parece simples mas tem as regras mais únicas:
//   - Move para frente, mas captura na diagonal
//   - Na primeira jogada pode avançar 2 casas
//   - Direção depende da cor (branco sobe, preto desce)
// Se você entender o peão, as outras peças são mais fáceis.
//
// HERANÇA:
// Pawn estende Piece. Isso significa que Pawn TEM TUDO
// que Piece tem (color, moveu, toString) e adiciona
// apenas o que é específico do peão.
// ═══════════════════════════════════════════════════════

import { Piece } from "./piece.js";
import { casaValida, casaVazia, mesmaEquipe } from '../utils.js';

// 'extends Piece' = Pawn herda de Piece
export class Pawn extends Piece {

    constructor(color) {
    // super() DEVE ser a primeira linha — chama o constructor
    // da classe pai (Piece), que define this.color, this.moveu etc.
    // Sem super(), o JavaScript lança um erro.
    super(color);

    this.type = 'pawn';

    // Peças brancas usam símbolo vazio (claro),
    // peças pretas usam símbolo preenchido (escuro).
    // Isso é padrão Unicode para xadrez.
    this.symbol = color === 'white' ? '♙' : '♟';
    }

    // ── getValidMoves ──────────────────────────────────────
  // Sobrescreve o método da classe Piece com a lógica real
  // do peão. Recebe a posição atual e o estado do tabuleiro.
  //
  // Retorna um array de objetos { row, col } representando
  // cada casa para onde o peão pode se mover.
  getValidMoves(row, col, grid) {
    const movimentos = [];

    // DIREÇÃO DE MOVIMENTO
    // Brancas sobem no tabuleiro (row diminui → direção -1)
    // Pretas descem no tabuleiro (row aumenta → direção +1)
    //
    // Isso é elegante: em vez de dois blocos de if/else,
    // usamos um número que muda o sinal da operação.
    //
    // TODO: inverta os valores e veja o que acontece no jogo.
    const direcao = this.color === 'white' ? -1 : 1;

    //Linha de inicio: brancas comecam na fileira 6, pretas na 1
    // (lembrando que o array comeca em 0, de cima para baixo)
    const linhaIncio = this.color === 'white' ? 6 : 1;

    // ── MOVER PARA FRENTE (1 casa) ──────────────────────
    // O peão só pode avançar se a casa da frente estiver VAZIA.
    // Diferente da captura — aqui não pode ter ninguém.
    const umaFrente = row + direcao;

    if (casaValida(umaFrente, col) && casaVazia(grid, umaFrente, col)) {
        movimentos.push({ row: umaFrente, col });

      // ── MOVER PARA FRENTE (2 casas) — primeiro movimento
      // Só permitido se:
      //   1. O peão ainda está na linha de início (nunca moveu)
      //   2. A casa imediatamente à frente está vazia (já verificamos)
      //   3. A segunda casa à frente também está vazia
      //
      // TODO: por que verificar this.moveu em vez de só linhaInicio?
      //       Existe algum caso onde row === linhaInicio mas
      //       a peça já teria se movido?
      const duasFrente = row + direcao * 2;

      if (row === linhaIncio && casaValida(duasFrente, col) && casaVazia(grid, duasFrente, col)) {
        movimentos.push({ row: duasFrente, col });
      }
    }

    // ── CAPTURA NA DIAGONAL ─────────────────────────────
    // O peão captura de forma diferente de como ele anda —
    // ele captura nas diagonais à frente, não em linha reta.
    //
    // Verificamos as duas diagonais: col - 1 e col + 1
    [-1, 1].forEach(ladoCol => {
        const captRow = row + direcao;
        const captCol = col + ladoCol;

        // A casa diagonal precisa:
      //   1. Existir dentro do tabuleiro
      //   2. Ter uma peça adversária (não vazia, não mesma equipe)
      if (
        casaValida(captRow, captCol) &&
        !casaVazia(grid, captRow, captCol) &&
        !mesmaEquipe(this, grid[captRow][captCol])
      ) {
        //sem o else: "Se a casa for válida, tiver uma peça e essa peça
      //  for do inimigo, adicione esse movimento como uma captura válida".
      //Se alguma das condições falhar (por exemplo, se a casa estiver vazia), 
      // o programa simplesmente ignora o bloco de código dentro do {} e pula 
      // para a próxima linha do seu script. Isso é muito comum no xadrez quando
      // um movimento de captura não é possível naquela casa específica. 
      // Quando você precisaria de um else? 
      // colocar um else se precisar que o jogo faça outra ação caso essa captura não mude nada.
      movimentos.push({ row: captRow, col: captCol });
      }
    });

    return movimentos;
  }
}