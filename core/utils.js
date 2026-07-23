// ═══════════════════════════════════════════════════════
// core/utils.js
//
// O QUE É ESTE ARQUIVO?
// Funções utilitárias puras — ferramentas genéricas que
// qualquer módulo do jogo pode importar e usar.
//
// O QUE É UMA FUNÇÃO PURA?
// Uma função que:
//   1. Recebe dados como parâmetro
//   2. Devolve um resultado
//   3. NÃO modifica nada fora dela (sem efeitos colaterais)
//   4. Dado o mesmo input, sempre devolve o mesmo output
//
// Por que isso importa?
// Funções puras são fáceis de testar, fáceis de reutilizar
// e não causam bugs misteriosos por mexer em dados globais.
//
// Por que não colocar isso no main.js?
// O main.js é o maestro — ele orquestra o jogo.
// Se colocássemos utilitários lá, qualquer módulo que
// precisasse de casaValida() teria que importar o main.js
// inteiro, criando dependências circulares e confusão.
// ═══════════════════════════════════════════════════════

// ── casaValida ───────────────────────────────────────────
// Verifica se uma posição existe dentro do tabuleiro 8×8.
// Usada por todas as peças antes de sugerir um movimento.
//
// Por que 0 e 7? O tabuleiro vai de row/col 0 até 7.
// Se uma peça está na borda e tentamos ir além, sem essa
// verificação o código tentaria acessar grid[-1][0] ou
// grid[8][0] — que não existem e causariam erro.
//
// TODO: o que aconteceria se removêssemos essa verificação?
// RESPOSTA: O JavaScript tentaria ler uma coluna de uma linha 
// que não existe. Isso causaria o erro fatal: 
// "TypeError: Cannot read properties of undefined".
export function casaValida(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8; 
}


// ── casaVazia ────────────────────────────────────────────
// Verifica se uma casa do tabuleiro não tem nenhuma peça.
//
// Por que receber o grid como parâmetro em vez de acessar
// um estado global? Porque assim a função é pura — ela não
// depende de nada externo e pode ser usada inclusive para
// analisar tabuleiros hipotéticos (ex: simular jogadas).
export function casaVazia(grid, row, col) {
    return grid[row][col] === null;
}


// ── mesmaEquipe ──────────────────────────────────────────
// Verifica se duas peças são da mesma cor (equipe).
// Usada para impedir que uma peça capture a própria equipe.
//
// Recebe duas peças (objetos) e compara a propriedade color.
// Se uma das peças for null (casa vazia), retorna false —
// casa vazia não tem equipe.
export function mesmaEquipe(pecaA, pecaB) {
    if (!pecaA || !pecaB) return false;
    return pecaA.color === pecaB.color;
} 

// ── clonarTabuleiro ──────────────────────────────────────
// Cria uma cópia independente do array 2D do tabuleiro.
//
// Por que precisamos disso?
// Em JavaScript, arrays são passados por referência.
// Se você fizer: const copia = grid, ambas apontam para
// o MESMO array na memória — modificar uma modifica a outra.
//
// Isso é crítico para:
//   - Verificar xeque: simular jogada sem alterar o jogo real
//   - IA: testar movimentos hipotéticos
//   - Desfazer: guardar estado anterior
//
// TODO: pesquise a diferença entre shallow copy e deep copy.
//       Por que um simples grid.slice() não seria suficiente
//       para um array 2D?
// RESPOSTA: Shallow copy copiaria apenas o array externo. As linhas 
// continuariam apontando para a memória original. Alterar uma peça 
// no clone alteraria a peça no tabuleiro original. A deep copy abaixo 
// garante independência total.
export function clonarTabuleiro(grid) {
     return grid.map(row =>
         row.map(peca =>
             peca ? { ...peca } : null
            )
        );
}


// ── posicaoParaNotacao ───────────────────────────────────
// Converte coordenadas internas (row, col) para notação
// algébrica do xadrez (ex: row=6, col=4 → "e2").
//
// No nosso grid: row 0 = fileira 8, row 7 = fileira 1
//                col 0 = coluna a,  col 7 = coluna h


export function posicaoParaNotacao(row, col) {
    const colunas = 'abcdefgh';
    const fileira = 8 - row;
    return `${colunas[col]}${fileira}`;
}