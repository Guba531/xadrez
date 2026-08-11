// ═══════════════════════════════════════════════════════
// core/pieces/knight.js
//
// O QUE É ESTE ARQUIVO?
// Define o CAVALO — a única peça que pula outras.
//
// LÓGICA DO CAVALO:
// Move-se em "L" (duas casas em uma direção e uma perpendicular).
// Não usamos "while" porque ele não desliza, ele salta diretamente
// para as 8 casas possíveis ao seu redor.
// ═══════════════════════════════════════════════════════
import { Piece } from './piece.js';
import { casaValida, casaVazia, mesmaEquipe } from '../utils.js';

export class Knight extends Piece {
    constructor(color) {
        super(color);
        this.type = 'knight';
        this.symbol = color === 'white' ? '♘' : '♞';
    }

    getValidMoves(row, col, grid) {
        const movimentos = [];

        // As 8 direções possíveis (Cima, Baixo, Leste, Oeste e Diagonais)
        const saltos = [
            [-2, -1], [-2, 1],
            [-1, -2], [-1, 2],
            [1, -2], [1, 2],
            [2, -1], [2, 1],
        ];

        saltos.forEach(([dr, dc]) => {
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