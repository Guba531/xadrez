export function animarMovimento(
    peca,
    deRow,
    deCol,
    paraRow,
    paraCol,
    desenhar
) {

    const duracao = 300;
    const inicio = performance.now();

    function animar(agora) {

        // Quanto da animacao ja passou: 0 - 1
        const progresso = Math.min((agora - inicio) / duracao, 1);

        // Calcula a posicao intermediaria da peca
        const row = deRow + (paraRow) * progresso;
        const col = deCol + (paraCol) * progresso;

        // Pede para o sistema desenhar essa posicao
        desenhar(peca, row, col);

        // Ainda nao terminou?
        if (progresso < 1) {
            requestAnimationFrame(animar);
        }
    }

    requestAnimationFrame(animar);
}