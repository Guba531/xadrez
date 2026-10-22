export function animarMovimento(
    peca,
    deRow,
    deCol,
    paraRow,
    paraCol,
    desenhar,
    aoTerminar
) {

    const duracao = 600;
    const inicio = performance.now();

    function animar(agora) {

        // Quanto da animacao ja passou: 0 - 1
        const progresso = Math.min((agora - inicio) / duracao, 1);

        // Calcula a posicao intermediaria da peca
        const row = deRow + (paraRow - deRow) * progresso;
        const col = deCol + (paraCol - deCol) * progresso;

        // Pede para o sistema desenhar essa posicao
        desenhar(peca, row, col);

        // Ainda nao terminou?
        if (progresso < 1) {
            requestAnimationFrame(animar);
        } else {
            aoTerminar?.();
        }
    }

    requestAnimationFrame(animar);
}