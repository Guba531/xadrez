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
        let row = deRow + deltaRow * progresso;
        let col = deCol + deltaCol * progresso;

        let angulo = 0;

        if (peca.type === 'queen' && distancia > 0) {
            // Três oscilações completas formam os "S" emendados.
            const fase = progresso * Math.PI * 4; // o valor determina o tamanho da onda


            // A oscilação desaparece no começo e no final.
            // Assim, a dama começa e termina exatamente na casa correta.
            const envelope = Math.sin(progresso * Math.PI);

            // Intensidade do desvio lateral, medida em casas.
            // 0.22 significa uma oscilação de até 22% de uma casa,
            // antes de considerar a intensidade do envelope.
            const amplitude = 0.07;

            // Desvio perpendicular à direção do movimento.
            // Isso faz a dama serpentear mesmo em movimentos diagonais.
            const desvio = Math.sin(fase) * amplitude * envelope;

            row += (-deltaCol / distancia) * desvio;
            col += (deltaRow / distancia) * desvio;

            // Inclinação discreta para acompanhar a dança.
            // Não usamos o ângulo para produzir a trajetória:
            // ela é criada pelo desvio de row e col acima.
            angulo = Math.cos(fase) * 0.025 * envelope;
        }

        // Só a dama deixa uma faixa de energia.
        if (peca.type === 'queen') {
            rastro.push({ row, col });

            // Mantém apenas as 24 posições mais recentes.
            // Isso limita o tamanho do rastro e permite que ele desapareça.
            if (rastro.lenght > 24) {
                rastro.shift();
            }
        }

        // Pede para o sistema desenhar essa posicao
        desenhar(peca, row, col, angulo, peca.type == 'queen' ? rastro : []);

        // Ainda nao terminou?
        if (progresso < 1) {
            requestAnimationFrame(animar);
        } else {
            aoTerminar?.();
        }
    }

    requestAnimationFrame(animar);
}