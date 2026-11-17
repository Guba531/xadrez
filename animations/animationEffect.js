/* ─────────────────────────────────────────────────────────────
   render/animationEffects.js
   
   ARQUITETURA DE EFEITOS VISUAIS (CANVAS 2D)
   
   CONCEITO DIDÁTICO:
   No Canvas, a ordem em que você desenha determina a profundidade
   (conhecido como "Painter's Algorithm" ou Algoritmo do Pintor).
   
   Para criar uma experiência imersiva e divertida de xadrez:
   1. CAMADA DE FUNDO: Rastros no solo, poeira e sombras 2.5D
      devem ser desenhados ANTES da peça para parecerem estar no chão.
   2. CAMADA DE SOBREPOSIÇÃO: Auras, contornos energéticos e
      partículas estelares são desenhados SOBRE a peça para brilho.
   ───────────────────────────────────────────────────────────── */

// ── 👑 DAMA: RASTRO DOURADO CÓSMICO ──────────────────────────
// [NOVO] Desenha uma fita fluida luminosa com cauda cônica e blur

function desenharDouradoLegal() {
    if (!rastro || rastro.length < 2) return;
    for (let i = 1; i < rastro.length; i++) {
        const anterior = rastro[i - 1];
        const atual = rastro[i];

        const x1 = anterior.col * TAMANHO_CASA + TAMANHO_CASA / 2;
        const y1 = anterior.row * TAMANHO_CASA + TAMANHO_CASA / 2;

        const x2 = atual.col * TAMANHO_CASA + TAMANHO_CASA / 2;
        const y2 = atual.row * TAMANHO_CASA + TAMANHO_CASA / 2;

        const intensidade = i / (rastro.length - 1);

        ctx.save();

        ctx.globalAlpha = intensidade * 0.65;
        ctx.strokeStyle = '#ffd76a';
        ctx.lineWidth = TAMANHO_CASA * 0.10;
        ctx.lineCap = 'round';

        ctx.shadowColor = '#ffb52e';
        ctx.shadowBlur = TAMANHO_CASA * 0.25;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.restore();
    }
}
if (peca.type === 'queen' && rastro.length > 1) {
    
}