/* ─────────────────────────────────────────────
   ANIMAÇÕES INDIVIDUAIS DAS PEÇAS
   Cada função controla seu próprio comportamento.
   ───────────────────────────────────────────── */

export function animarDama(progresso, contexto) {
    const {
        row,
        col,
        deltaRow,
        deltaCol,
        distancia,
        rastro
    } = contexto;

    let novaRow = row;
    let novaCol = col;
    let angulo = 0;

    if (distancia > 0) {
        const fase = progresso * Math.PI * 4;
        const envelope = Math.sin(progresso * Math.PI);
        const amplitude = 0.07;

        const desvio = Math.sin(fase) * amplitude * envelope;

        novaRow += (-deltaCol / distancia) * desvio;
        novaCol += (deltaRow / distancia) * desvio;

        angulo = Math.cos(fase) * 0.025 * envelope;
    }

    rastro.push({ row: novaRow, col: novaCol });

    if (rastro.lenght > 24) {
        rastro.shift();
    }

    return {
        row: novaRow,
        col: novaCol,
        angulo,
        rastro
    };
}

