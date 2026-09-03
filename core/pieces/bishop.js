// ═══════════════════════════════════════════════════════
// core/pieces/bishop.js
// ═══════════════════════════════════════════════════════

import { Piece } from './piece.js';
import { casaValida, casaVazia, mesmaEquipe } from '../utils.js';

export class Bishop extends Piece {
  constructor(color) {
    super(color);
    this.type = 'bishop';
    this.symbol = color === 'white' ? '♗' : '♝';
  }

  getValidMoves(row, col, grid) {
    const movimentos = [];

    // O segredo do Bispo está aqui: as 4 DIAGONAIS
    const direcoes = [
      [-1, -1], // Cima-Esquerda
      [-1,  1], // Cima-Direita
      [ 1, -1], // Baixo-Esquerda
      [ 1,  1]  // Baixo-Direita
    ];

    direcoes.forEach(([dr, dc]) => {
      let nRow = row + dr;
      let nCol = col + dc;   

      // A mesma lógica de "raio laser" da Torre!
      while (casaValida(nRow, nCol)) {
        const pecaAlvo = grid[nRow][nCol];

        if (casaVazia(grid, nRow, nCol)) {
          movimentos.push({ row: nRow, col: nCol, isCapture: false });
        } else {
          if (!mesmaEquipe(this, pecaAlvo)) {
            movimentos.push({ row: nRow, col: nCol, isCapture: true });
          }
          break; // Bloqueado por uma peça
        }
        nRow += dr;
        nCol += dc;
      }
    });

    return movimentos;
  }
}