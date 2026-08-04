import { casaValida, casaVazia, mesmaEquipe } from "../utils.js";
import { Piece } from "./piece.js";

export class Bishop extends Piece {
    constructor(color) {
        super(color);
        this.type = 'bishop';
        this.symbol = color === 'white' ? '♗' : '♝';
    }

    getValidMoves(row, col, grid) {

        const movimentos = [];

        const direcoes = [
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ];

        direcoes.forEach(([dr, dc]) => {
            let nRow = row + dr;
            let nCol = col + dc;

            while (casaValida(nRow, nCol)) {
                if (casaVazia(grid, nRow, nCol)) {
                    movimentos.push({ row: nRow, col: nCol });
                } else {
                    if (!mesmaEquipe(this, grid[nRow][nCol])) {
                        movimentos.push({ row: nRow, col: nCol });
                    }
                    break; // Para o loop: o bispo nao pula pecas!
                }
                nRow += dr; // Vai para a proxima casa
                nCol += dc;

            }
        });

        return movimentos;

    }
}
