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

// Cores do tabuleiro — tom madeira claro e escuro
const COR_CASA_CLARA = '#e2cba6';
const COR_CASA_ESCURA = '#6f3d14';

// Cores dos destaques de jogada
const COR_SELECIONADO = 'rgba(255, 185, 30,  0.72)'; // amarelo
const COR_MOVIMENTO = 'rgba(90,  170,  90,  0.45)'; // verde
const COR_PONTO_CENTRO = 'rgba(0,   0,    0,   0.18)'; // ponto escuro
const COR_RISK =  'rgba(255, 59, 48, 0.4)';
const COR_RISK_POINT = 'rgba(150, 0, 0, 0.5)';


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
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {

      ctx.fillStyle = (row + col) % 2 === 0
        ? COR_CASA_CLARA
        : COR_CASA_ESCURA;

      ctx.fillRect(
        col * TAMANHO_CASA,   // posição X em pixels
        row * TAMANHO_CASA,   // posição Y em pixels
        TAMANHO_CASA,         // largura
        TAMANHO_CASA          // altura
      );
    }
  }
}

// ── desenharDestaques ─────────────────────────────────────
// Desenha os destaques visuais:
//   - Casa selecionada (amarela)
//   - Movimentos válidos (verde + ponto no centro)
//
// Recebe 'selecionado' como { row, col } ou null,
// e 'movimentosValidos' como array de { row, col }.
export function desenharDestaques(ctx, selecionado, movimentosValidos, mostrarMovimentos, mostrarRisco) {

  // Se nenhuma peça está selecionada, não há nada para destacar
  if (!selecionado) return;

  // ── Destaque da casa selecionada ────────────────────
  ctx.fillStyle = COR_SELECIONADO;
  ctx.fillRect(
    selecionado.col * TAMANHO_CASA,
    selecionado.row * TAMANHO_CASA,
    TAMANHO_CASA,
    TAMANHO_CASA
  );

  // ── Destaque dos movimentos válidos ─────────────────
// Dentro do drawBoard.js, no loop de movimentosValidos:

 movimentosValidos.forEach((m) => {
    const estiloCores = getComputedStyle(document.documentElement);
    
    // Pegamos as cores do CSS
    const corVerdeNormal = estiloCores.getPropertyValue('--highlight-move');
    const corSuaCaptura  = estiloCores.getPropertyValue('--highlight-capture');
    const corRisco       = estiloCores.getPropertyValue('--highlight-risk');  // Vermelho
    const corAlerta      = estiloCores.getPropertyValue('--highlight-alert'); // Laranja

    let deveDesenhar = false;
    let corParaPintar = "";

    // LÓGICA DE DECISÃO:
    if (m.isRisk) {
      // Se a casa for de RISCO, só pintamos se o switch de Risco estiver ON
      if (mostrarRisco) {
        deveDesenhar = true;
        corParaPintar = m.isCapture ? corAlerta : corRisco; // Laranja se for comer/sacrificar, Vermelho se for só morte
      }
    } else {
      // Se a casa for SEGURA, só pintamos se o switch de Movimentos estiver ON
      if (mostrarMovimentos) {
        deveDesenhar = true;
        corParaPintar = m.isCapture ? corSuaCaptura : corVerdeNormal; // Verde claro ou Verde padrão
      }
    }

    // Se a lógica acima decidiu que deve desenhar, pintamos o quadrado e o ícone
    if (deveDesenhar) {
      ctx.fillStyle = corParaPintar;
      ctx.fillRect(m.col * TAMANHO_CASA, m.row * TAMANHO_CASA, TAMANHO_CASA, TAMANHO_CASA);

      // Desenho do ícone (Círculo ou Ponto)
      ctx.save();
      if (m.isCapture) {
        // Alvo para capturas
        ctx.strokeStyle = m.isRisk ? 'rgba(100, 0, 0, 0.5)' : 'rgba(0, 100, 0, 0.5)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(m.col * TAMANHO_CASA + 30, m.row * TAMANHO_CASA + 30, 22, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Pontinho para casas vazias
        ctx.fillStyle = m.isRisk ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.arc(m.col * TAMANHO_CASA + 30, m.row * TAMANHO_CASA + 30, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
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
      if (!peca) continue;  // casa vazia — pula

      const x = col * TAMANHO_CASA + TAMANHO_CASA / 2;
      const y = row * TAMANHO_CASA + TAMANHO_CASA / 2;

      // Sombra sutil para dar profundidade às peças
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 3;

      ctx.font = `${TAMANHO_CASA * 0.72}px serif`;
      ctx.fillStyle = peca.color === 'white' ? '#ffffff' : '#1a0d00';
      ctx.fillText(peca.symbol, x, y + 1);

      // Contorno leve só para peças brancas — aumenta contraste
      // em casas claras onde o símbolo poderia se perder
      if (peca.color === 'white') {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(52, 36, 7, 0.5)';
        ctx.lineWidth = 0.5;
        ctx.strokeText(peca.symbol, x, y + 1);
      }

      // Limpa a sombra para não afetar os próximos desenhos
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
export function renderizar(ctx, grid, selecionado, movimentosValidos, mostrarMovimentos, mostrarRisco) {
  desenharTabuleiro(ctx);
  // Chamamos sempre o desenharDestaques, pois ele mesmo vai decidir 
  // o que pintar com base nos dois switches (mostrarMovimentos e mostrarRisco)
  desenharDestaques(ctx, selecionado, movimentosValidos, mostrarMovimentos, mostrarRisco);
  desenharPecas(ctx, grid);
}

export function desenharAvisoXeque(ctx, emXeque) {
  if (!emXeque) return;
  //Animacao simples de piscar baseada no tempo do sistema
  const blink = Math.floor(Date.now() / 300) % 2 === 0;
  if (!blink) return;

  ctx.save();
  ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText("XEQUE!!!", 240, 250);
  ctx.restore();
}