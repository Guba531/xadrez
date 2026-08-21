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
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, -1], [-1, 1], [1, -1], [1, 1]
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

    // --- LÓGICA DO ROQUE (NOVO) ---
    // Só tentamos se o Rei nunca se moveu e NÃO está em xeque
    // Nota: A classe Board precisa ser passada ou acessada. 
    // Se 'grid' é apenas a matriz, não conseguimos checar 'estaEmXeque' aqui.
    // Por enquanto, vamos checar apenas se o caminho está vazio e se as peças não moveram.
    if (!this.moveu) {

      // ROQUE PEQUENO (Lado da Torre na coluna 7)
      const torreDireita = grid[row][7];
      if (torreDireita && torreDireita.type === 'rook' && !torreDireita.moveu) {
        // Verifica se o caminho entre o Rei e a Torre esta vazio (casas 5 e 6)
        if (casaVazia(grid, row, 5) && casaVazia(grid, row, 6)) {
          movimentos.push({
            row, col: 6,
            isCastling: true,
            rookFromCol: 7,
            rookToCol: 5
          });
        }
      }

      const torreEsquerda = grid[row][7];
      if (torreEsquerda && torreEsquerda.type === 'rook' && !torreEsquerda.moveu) {
        // Verifica se o caminho entre o Rei e a Torre esta vazio (casas 1, 2 e 3)
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