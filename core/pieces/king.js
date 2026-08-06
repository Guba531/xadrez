// ═══════════════════════════════════════════════════════
// core/pieces/king.js
//
// O QUE É ESTE ARQUIVO?
// Define o REI — a peça mais importante.
//
// LÓGICA DO REI:
// O Rei se move para qualquer casa adjacente (8 direções).
// É como se fosse a Rainha, mas sem o loop "while",
// já que ele só tem alcance de 1 casa.
// ═══════════════════════════════════════════════════════

import { Piece } from './piece.js';
import { casaValida, casaVazia, mesmaEquipe } from '../utils.js';

export class King extends Piece {
  constructor(color) {
    super(color);
    this.type = 'king';
    this.symbol = color === 'white' ? '♔' : '♚';
  }

  getValidMoves(row, col, grid) {
    const movimentos = [];

    // As 8 direções possíveis (Cima, Baixo, Leste, Oeste e Diagonais)
    const direcoes = [
      [-1,  0], [1,  0], [0, -1], [0,  1],
      [-1, -1], [-1, 1], [1, -1], [1,  1]
    ];

    direcoes.forEach(([dr, dc]) => {
      const nRow = row + dr;
      const nCol = col + dc;

      // 1. Verificamos se a casa destino existe no tabuleiro
      if (casaValida(nRow, nCol)) {
        const pecaAlvo = grid[nRow][nCol];

        // 2. Se a casa estiver vazia, ele pode ir
        if (casaVazia(grid, nRow, nCol)) {
          movimentos.push({ row: nRow, col: nCol, isCapture: false });
        } 
        // 3. Se tiver alguém, só pode ir se for inimigo (Captura)
        else if (!mesmaEquipe(this, pecaAlvo)) {
          movimentos.push({ row: nRow, col: nCol, isCapture: true });
        }
      }
      // Note que NÃO temos o loop 'while' aqui. 
      // Ele verifica a direção uma vez e encerra.
    });

    return movimentos;
  }
}