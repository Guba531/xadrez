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

import { casaValida, casaVazia, mesmaEquipe } from "../utils.js";
import { Piece } from "./piece.js";

export class Rook extends Piece {
    constructor(color) {
        super(color);
        this.type = 'rook';
        this.symbol = color === 'white' ? '♖' : '♜';
    }

    getValidMoves(row, col, grid) {

        const movimentos = [];

        // 1. Definir a direcao: "Para cima" (row diminui)
        const dRow = -1;
        const dCol = 0;

        //Definimos as 4 direcoes cardinais como vetores [row, col]
        // Cima: [-1, 0]
        // Baixo: [1, 0]
        // Direita: [0, 1]
        // Esquerda: [0, -1]
        const direcoes = [
            [-1, 0], [1, 0], [0, 1], [0, -1]
        ];

        direcoes.forEach(([dr, dc]) => {
            let nRow = row + dr;
            let nCol = col + dc;

            //2. Verificar se a casa logo acima existe e esta vazia
            while (casaValida(nRow, nCol)) {
                if (casaVazia(grid, nRow, nCol)) {
                    movimentos.push({ row: nRow, col: nCol });
                } else {
                    if (!mesmaEquipe(this, grid[nRow][nCol])) {
                        movimentos.push({ row: nRow, col: nCol });
                    }
                    break; // Para o loop: a torre nao pula pecas!
                }
                nRow += dr; // Vai para a proxima casa
                nCol += dc;

            }
        });

        return movimentos;

    }
}