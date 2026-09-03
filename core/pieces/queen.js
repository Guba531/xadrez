// ═══════════════════════════════════════════════════════
// core/pieces/queen.js
//
// O QUE É ESTE ARQUIVO?
// Define a RAINHA — a peça mais poderosa.
//
// LÓGICA DA RAINHA:
// Ela é a combinação da Torre (Rook) e do Bispo (Bishop).
// Move-se em linha reta (8 direções) por quantas casas 
// o caminho permitir.
// ═══════════════════════════════════════════════════════

import { Piece } from './piece.js';
import { casaValida, casaVazia, mesmaEquipe } from '../utils.js';

export class Queen extends Piece {
  constructor(color) {
    super(color);
    this.type = 'queen';
    this.symbol = color === 'white' ? '♕' : '♛';
  }

  getValidMoves(row, col, grid) {
    const movimentos = [];

    // O "Super Poder" da Rainha: 8 direções combinadas
    const direcoes = [
      [-1,  0], [1,  0], [0, -1], [0,  1], // Ortogonais (Torre)
      [-1, -1], [-1, 1], [1, -1], [1,  1]  // Diagonais (Bispo)
    ];

    direcoes.forEach(([dr, dc]) => {
      let nRow = row + dr;
      let nCol = col + dc;

      // Reutilizamos a lógica de "raio laser" (sliding)
      while (casaValida(nRow, nCol)) {
        const pecaAlvo = grid[nRow][nCol];

        if (casaVazia(grid, nRow, nCol)) {
          // Casa livre: movimento normal e sem captura
          movimentos.push({ row: nRow, col: nCol, isCapture: false });
        } else {
          // Encontrou uma peça:
          if (!mesmaEquipe(this, pecaAlvo)) {
            // Se for inimiga: é uma captura!
            movimentos.push({ row: nRow, col: nCol, isCapture: true });
          }
          // Bloqueio: Rainha não pula peças.
          break; 
        }
        nRow += dr;
        nCol += dc;
      }
    });

    return movimentos;
  }
}