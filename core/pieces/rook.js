// ═══════════════════════════════════════════════════════
// core/pieces/rook.js
//
// O QUE É ESTE ARQUIVO?
// Define a TORRE — a primeira peça de "deslizamento" (sliding).
//
// CONCEITO DE DESLIZAMENTO:
// Ao contrário do peão, a torre pode andar quantas casas quiser
// em uma direção, desde que o caminho esteja livre.
// Se encontrar uma peça amiga, ela para antes.
// Se encontrar uma peça inimiga, ela pode capturá-la (e para ali).
// ═══════════════════════════════════════════════════════

import { Piece } from './piece.js';
import { casaValida, casaVazia, mesmaEquipe } from '../utils.js';

export class Rook extends Piece {
  constructor(color) {
    super(color);
    this.type = 'rook';
    this.symbol = color === 'white' ? '♖' : '♜';
  }

  getValidMoves(row, col, grid) {

    const movimentos = [];
    const dRow = -1; // Continua sendo "Para cima"
    const dCol = 0;


    // Definimos as 4 direções cardinais como vetores [row, col]
    // Cima:    [-1,  0]
    // Baixo:   [ 1,  0]
    // Direita: [ 0,  1]
    // Esquerda:[ 0, -1]
    const direcoes = [
      [-1, 0], [1, 0], [0, 1], [0, -1]
    ];

    
    // 2. Percorremos cada direção da lista
    // dr = delta Row (variação da linha)
    // dc = delta Col (variação da coluna)
    direcoes.forEach(([dr, dc]) => {
      let nRow = row + dr;
      let nCol = col + dc;

      // "Enquanto a casa for válida..."
      while (casaValida(nRow, nCol)) {
        const pecaAlvo = grid[nRow][nCol]; 

        if (casaVazia(grid, nRow, nCol)) {
          movimentos.push({ row: nRow, col: nCol, isCapture: false });
        } else {
          // Se não é vazia, comparamos a equipe
          if (!mesmaEquipe(this, pecaAlvo)) {
            // É inimiga! Adicionamos como captura
            movimentos.push({ row: nRow, col: nCol, isCapture: true });
          }
          break; // Bateu em uma peça (amiga ou inimiga), para o raio laser
        }
        nRow += dr; // Vai para a próxima casa
        nCol += dc;
      }
    });

    return movimentos;
  }
}