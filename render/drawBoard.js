// ═══════════════════════════════════════════════════════
// render/drawBoard.js
//
// O QUE É ESTE ARQUIVO?
// Responsável por DESENHAR tudo no Canvas — tabuleiro,
// peças e destaques de movimentos válidos.
//
// POR QUE SEPARAR O DESENHO DA LÓGICA?
// Separação de responsabilidades:
//   core/  → sabe as REGRAS do jogo (o que pode acontecer)
//   render/ → sabe como MOSTRAR o jogo (como aparece na tela)
//
// Isso significa que poderíamos trocar o Canvas por SVG,
// WebGL ou qualquer outro sistema visual sem tocar nas
// regras do jogo — e vice-versa.
//
// CANVAS API — conceitos usados aqui:
//   ctx.fillStyle      → define a cor de preenchimento
//   ctx.fillRect()     → desenha um retângulo preenchido
//   ctx.font           → define fonte para texto
//   ctx.fillText()     → desenha texto
//   ctx.beginPath()    → inicia um novo caminho vetorial
//   ctx.arc()          → desenha um círculo (ou arco)
//   ctx.fill()         → preenche o caminho atual
//   ctx.save/restore() → salva e restaura o estado do ctx
// ═══════════════════════════════════════════════════════


// Tamanho de cada casa em pixels
// Constante no topo: se quisermos mudar o tamanho do
// tabuleiro, alteramos só aqui e tudo se ajusta.

const TAMANHO_CASA = 60;

const COR_CASA_CLARA = '#e2cba6';
const COR_CASA_ESCURA = '#6f3d14'

const COR_SELECIONADO = 'rgba(255, 185, 30, 0.72)';
const COR_MOVIMENTO = 'rgba(90, 170, 90, 0.45)';
const COR_PONTO_CENTRO = 'rgba(0, 0, 0, 0.18)';

// ── desenharTabuleiro ─────────────────────────────────────
// Desenha as 64 casas do tabuleiro.
//
// Como saber se uma casa é clara ou escura?
// Se (row + col) for par → clara. Se for ímpar → escura.
// Isso cria o padrão xadrez automaticamente.
//
// TODO: experimente trocar as cores e ver o resultado.
//       Como você faria para ter um tema escuro?

export function desenharTabuleiro(ctx) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? COR_CASA_CLARA : COR_CASA_ESCURA;
            ctx.fillRect(c * TAMANHO_CASA, r * TAMANHO_CASA, TAMANHO_CASA, TAMANHO_CASA);
        }
    }
}

export function desenharDestaques(ctx, selecionado, movimentosValidos) {

    if (!selecionado) return;

    ctx.fillStyle = COR_SELECIONADO;
    ctx.fillRect(selecionado.col * TAMANHO_CASA,
        selecionado.row * TAMANHO_CASA,
        TAMANHO_CASA,
        TAMANHO_CASA

    );

    movimentos.forEach(({ row, col }) => {

        ctx.fillStyle = COR_MOVIMENTO;
        ctx.fillRect(
            col * TAMANHO_CASA,
            row * TAMANHO_CASA,
            TAMANHO_CASA,
            TAMANHO_CASA
        );

        // Ponto no centro — indica visualmente onde pode ir
        // ctx.save() / ctx.restore() garante que as configurações
        // (fillStyle, globalAlpha etc) não vazem para o próximo desenho
        ctx.save();
        ctx.fillStyle = COR_PONTO_CENTRO;
        ctx.beginPath();
        ctx.arc(
            col * TAMANHO_CASA + TAMANHO_CASA / 2, //centro x 
            row * TAMANHO_CASA + TAMANHO_CASA / 2, //centro y
            8, // raio em pixels
            0, //angulo inicial (0 = direita)
            Math.PI * 2 // angulo final (2π = circulo completo)
        );
        ctx.fill();
        ctx.restore();
    });
}

// ── desenharPecas ─────────────────────────────────────────
// Percorre o grid e desenha o símbolo de cada peça
// na posição correspondente do canvas.
//
// Por que usar símbolo Unicode (♙♟♖♜) em vez de imagens?
// Para começar: não precisamos de arquivos externos,
// funciona em qualquer resolução e é simples de implementar.
// Futuramente podemos trocar por imagens (drawImage) ou
// SVGs sem alterar a lógica do jogo.
//
// TODO: quando tivermos as animações (render/animations.js),
//       esta função vai pular peças que estão sendo animadas.
export function desenharPecas(ctx, grid) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const peca = grid[row][col];
            if (!peca) continue; // casa vazia = pula

            const x = col * TAMANHO_CASA + TAMANHO_CASA / 2;
            const y = row * TAMANHO_CASA + TAMANHO_CASA / 2;

            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 3;

            ctx.font = `${TAMANHO_CASA * 0.72}px serif`;
            ctx.fillStyle = peca.color === 'white' ? '#ffffff' : '#1a0d00';
            ctx.fillText(peca.symbol, x, y + 1);

            if (peca.color === 'white') {
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.strokeStyle = 'rgba(52, 36, 7, 0.5)';
                ctx.lineWidth = 0.5;
                ctx.strokeText(peca.symbol, x, y + 1);
            }

            //Limpa a sombra para nao afetar os proximos desenhos
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }
    }
}

// ── renderizar ────────────────────────────────────────────
// Função principal que chama tudo na ordem correta.
// O main.js chama apenas esta função — não precisa saber
// a ordem em que as camadas são desenhadas.
//
// ORDEM IMPORTA no Canvas:
//   1. Tabuleiro (fundo)
//   2. Destaques (sobre o fundo, sob as peças)
//   3. Peças (camada superior)
//
// TODO: futuramente teremos uma 4ª camada para animações
//       que fica entre as peças e os destaques.
export function renderizar(ctx, grid, selecionado, movimentosValidos) {
    desenharTabuleiro(ctx);
    desenharDestaques(ctx, selecionado, movimentosValidos);
    desenharPecas(ctx, grid);
}