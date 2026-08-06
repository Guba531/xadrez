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
import { casaValida, casaVazia, mesmaEquipe } from "../utils.js";
import { Piece } from "./piece.js";

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
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ];

        direcoes.forEach(([dr, dc]) => {
            let nRow = row + dr;
            let nCol = col + dc;
            
            // Reutilizamos a lógica de "raio laser" (sliding)
            while (casaValida(nRow, nCol)) {
                if (casaVazia(grid, nRow, nCol)) {
                    movimentos.push({ row: nRow, col: nCol });
                } else {
                    if (!mesmaEquipe(this, grid[nRow][nCol])) {
                        movimentos.push({ row: nRow, col: nCol });
                    }
                    break; // Para o loop: a rainha nao pula pecas!
                }
                nRow += dr; // Vai para a proxima casa
                nCol += dc;

            }
        });

        return movimentos;

    }
}
