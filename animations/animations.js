/* ─────────────────────────────────────────────
   MOTOR GERAL DE ANIMAÇÃO
   Controla tempo, deslocamento e atualização.
   Os efeitos específicos ficam em pieceAnimations.js.
   ───────────────────────────────────────────── */

import {
    animarDama,
    animarTorre,
    animarBispo,
    animarCavalo,
    animarPeao,
    animarRei
} from './pieceAnimations.js';

const estrategias = {
    queen: animarDama,
    rook: animarTorre,
    bishop: animarBispo,
    knight: animarCavalo,
    pawn: animarPeao,
    king: animarRei
};

export function animarMovimento(
    peca,
    deRow,
    deCol,
    paraRow,
    paraCol,
    desenhar,
    aoTerminar
) {

    // A dama precisa de mais tempo para executar sua dança.
    // As outras peças continuam usando os 600 ms originais
    const duracao = peca.type === 'queen' ? 1100 : 600;
    const inicio = performance.now();

    // Guarda as últimas posições da dama para desenhar seu rastro.
    // A lista existe apenas durante esta animação.
    const rastro = [];
    const estrategia = estrategias[peca.type];

    // Calcula a direção do movimento no tabuleiro.
    const deltaRow = paraRow - deRow;
    const deltaCol = paraCol - deCol;

    // Calcula o comprimento do deslocamento.
    // Math.hypot evita que precisemos calcular a raiz manualmente.
    const distancia = Math.hypot(deltaRow, deltaCol);

    function animar(agora) {

        // Quanto da animacao ja passou: 0 - 1
        const progresso = Math.min((agora - inicio) / duracao, 1);

        // Calcula a posicao intermediaria da peca
        const row = deRow + deltaRow * progresso;
        const col = deCol + deltaCol * progresso;

        const contexto = {
            row,
            col,
            deRow,
            deCol,
            paraRow,
            paraCol,
            deltaRow,
            deltaCol,
            distancia,
            rastro
        };

        const resultado = estrategia
            ? estrategia(progresso, contexto)
            : { row, col, angulo: 0, rastro: [] };

        desenhar(
            peca,
            resultado.row,
            resultado.col,
            resultado.angulo ?? 0,
            resultado.rastro ?? [],
            progresso,
            resultado.extras ?? {}
        );

        // Ainda nao terminou?
        if (progresso < 1) {
            requestAnimationFrame(animar);
        } else {
            aoTerminar?.();
        }
    }

    requestAnimationFrame(animar);
}