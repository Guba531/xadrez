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

export function animarTorre(progresso, contexto) {

    const {
        deRow,
        deCol,
        deltaRow,
        deltaCol
    } = contexto;

    const movimento = 1 - Math.pow(1 - progresso, 3);

    const impacto = progresso > 0.75
    ? Math.sin(((progresso - 0.75) / 0.25) * Math.PI) * 0.22
    : 0;

    const deslocamento = movimento + impacto;

    const novaRow = deRow + deltaRow * deslocamento;
    const novaCol = deCol + deltaCol * deslocamento;

    // Tremor do impacto
    const angulo = progresso > 0.85
    ? Math.sin((progresso - 0.85) * 60) *
    0.10 *
    (1 - progresso)
    : 0;

    return {
        row: novaRow,
        col: novaCol,
        angulo,
        rastro: []
    };
}

export function animarCavalo(progresso, contexto) {
    const { deRow, deCol, paraRow, paraCol, deltaRow, deltaCol } = contexto;

    let novaRow, novaCol;

    const moverLinhaPrimeiro = Math.abs(deltaRow) > Math.abs(deltaCol);

    if (progresso < 0.5 ) {
        const p1 = progresso * 2;
        if (moverLinhaPrimeiro) {
            novaRow = deRow + deltaRow * p1;
            novaCol = deCol;
        } else {
            novaRow = deRow;
            novaCol = deCol + deltaCol * p1;
        }
    } else {
        const p2 = (progresso - 0.5) * 2;
        if (moverLinhaPrimeiro) {
            novaRow = paraRow;
            novaCol = deCol + deltaCol * p2;
        } else {
            novaRow = deRow + deltaRow * p2;
            novaCol = paraCol;
        }
    }

    const alturaSalto = Math.sin(progresso * Math.PI) * 0.6;
    novaRow -= alturaSalto;

    const angulo = Math.sin(progresso * Math.PI) * 0.12 * (deltaCol >= 0 ? 1 : -1);

    return { row: novaRow, col: novaCol, angulo, rastro: [] };
}