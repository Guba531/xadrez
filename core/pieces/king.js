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

    // 1. MOVIMENTOS NORMAIS (O que você já tinha)
    const direcoes = [
      [-1,  0], [1,  0], [0, -1], [0,  1],
      [-1, -1], [-1, 1], [1, -1], [1,  1]
    ];

    direcoes.forEach(([dr, dc]) => {
      const nRow = row + dr;
      const nCol = col + dc;

      if (casaValida(nRow, nCol)) {
        const pecaAlvo = grid[nRow][nCol];

        if (casaVazia(grid, nRow, nCol)) {
          movimentos.push({ row: nRow, col: nCol, isCapture: false });
        } 
        else if (!mesmaEquipe(this, pecaAlvo)) {
          movimentos.push({ row: nRow, col: nCol, isCapture: true });
        }
      }
    });

    // 2. LÓGICA DO ROQUE (O DIFERENCIAL DA ÚLTIMA VERSÃO)
    // Só tentamos se o Rei NUNCA se moveu
    if (!this.moveu) {
      
      // ROQUE PEQUENO (Lado da Torre na coluna 7)
      const torreDireita = grid[row][7];
      if (torreDireita && torreDireita.type === 'rook' && !torreDireita.moveu) {
        // Verifica se o caminho entre o Rei e a Torre está vazio (casas 5 e 6)
        if (casaVazia(grid, row, 5) && casaVazia(grid, row, 6)) {
          movimentos.push({ 
            row, col: 6, 
            isCastling: true, 
            rookFromCol: 7, 
            rookToCol: 5 
          });
        }
      }

      // ROQUE GRANDE (Lado da Torre na coluna 0)
      const torreEsquerda = grid[row][0];
      if (torreEsquerda && torreEsquerda.type === 'rook' && !torreEsquerda.moveu) {
        // Verifica se o caminho está vazio (casas 1, 2 e 3)
        if (casaVazia(grid, row, 1) && casaVazia(grid, row, 2) && casaVazia(grid, row, 3)) {
          movimentos.push({ 
            row, col: 2, 
            isCastling: true, 
            rookFromCol: 0, 
            rookToCol: 3 
          });
        }
      }
    }

    return movimentos;
  }
}