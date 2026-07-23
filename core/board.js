// ═══════════════════════════════════════════════════════
// core/pieces/pawn.js
//
// O QUE É ESTE ARQUIVO?
// Define o PEÃO — a primeira peça que vamos implementar.
//
// POR QUE COMEÇAR PELO PEÃO?
// O peão parece simples mas tem as regras mais únicas:
//   - Move para frente, mas captura na diagonal
//   - Na primeira jogada pode avançar 2 casas
//   - Direção depende da cor (branco sobe, preto desce)
// Se você entender o peão, as outras peças são mais fáceis.
//
// HERANÇA:
// Pawn estende Piece. Isso significa que Pawn TEM TUDO
// que Piece tem (color, moveu, toString) e adiciona
// apenas o que é específico do peão.
// ═══════════════════════════════════════════════════════


import { Pawn } from './pieces/pawn.js';
import { clonarTabuleiro } from './utils.js';

export class Board {

    constructor() {
        // O tabuleiro é um array 2D de 8×8 posições.
        // Cada posição contém uma instância de Piece ou null.
        //
        // grid[0][0] = canto superior esquerdo (a8)
        // grid[7][7] = canto inferior direito  (h1)
        //
        // Visualizando:
        //   grid[0] = fileira 8 (peças pretas — torres, cavalos...)
        //   grid[1] = fileira 7 (peões pretos)
        //   grid[2..5] = fileiras 6 a 3 (vazias no início)
        //   grid[6] = fileira 2 (peões brancos)
        //   grid[7] = fileira 1 (peças brancas — torres, cavalos...)
        this.grid = this.#criarGridInicial();
    }

    // ── #criarGridInicial ──────────────────────────────────
    // Método PRIVADO (# no início) — só pode ser chamado
    // de dentro desta classe. Monta o tabuleiro na posição
    // inicial padrão do xadrez.
    //
    // Por que privado? O grid só deve ser montado no constructor.
    // Ninguém de fora precisa chamar esse método diretamente.
    #criarGridInicial() {

        //Cria 8 linhas, cada uma com 8 posicoes null (vazio)
        //Array.from + map e uma forma limpa de criar arrays 2D
        const grid = Array.from({ length: 8 }, () => Array(8).fill(null));

        //Peoes-----------------------------------------------------------
        //Fileira 1 (grid[1]) = peoes pretos
        //Fileira 2 (grid[6]) = peoes brancos
        for (let col = 0; col < 8; col++) {
            grid[1][col] = new Pawn('black');
            grid[6][col] = new Pawn('white');
        }

        // TODO (próximas aulas): adicionar as demais peças
        // A ordem da fileira de trás é sempre:
        // torre, cavalo, bispo, rainha, rei, bispo, cavalo, torre
        //
        // const fileiraPreta  = ['rook','knight','bishop','queen','king','bishop','knight','rook'];
        // const fileiraFabrica = { rook: Rook, knight: Knight, bishop: Bishop, queen: Queen, king: King };
        //
        // fileiraPreta.forEach((tipo, col) => {
        //   const Classe = fileiraFabrica[tipo];
        //   grid[0][col] = new Classe('black');
        //   grid[7][col] = new Classe('white');
        // });

        return grid;
    }
    // ── getValidMoves ──────────────────────────────────────
    // Pede à peça na posição informada quais movimentos ela
    // pode fazer. Delega para o método da própria peça.
    //
    // Por que o board delega para a peça?
    // Polimorfismo — o board não precisa saber as regras de
    // cada peça. Ele apenas pergunta: "para onde você pode ir?"
    // A peça responde com sua própria lógica.
    //
    // TODO: futuramente este método vai filtrar movimentos que
    //       deixariam o rei em xeque — isso exige clonarTabuleiro()
    //       e simular a jogada antes de confirmar.
    getValidMoves(row, col) {
        const peca = this.grid[row][col];
        if (!peca) return [];
        return peca.getValidMoves(row, col, this.grid);
    }

    // ── moverPeca ──────────────────────────────────────────
  // Executa um movimento no tabuleiro:
  //   1. Move a peça da origem para o destino
  //   2. Marca que a peça já se moveu (importante para peão e roque)
  //   3. Limpa a casa de origem
  //   4. Retorna a peça capturada (ou null se casa estava vazia)
  //
  // Por que retornar a peça capturada?
  // O main.js precisa saber se houve captura para atualizar
  // o placar e a lista de peças capturadas na sidebar.
  moverPeca(deRow, deCol, paraRow, paraCol) {
    const capturada = this.grid[paraRow][paraCol];
    const peca = this.grid[deRow][deCol];

    this.grid[paraRow][paraCol] = peca;
    this.grid[deRow][deCol] = null;

   //Marca que esta peca ja se moveu pelo menos uma vez
   if (peca) peca.moveu = true;

   return capturada;
  }

  // ── clonar ─────────────────────────────────────────────
  // Devolve uma cópia independente deste Board.
  // Usado pela IA e pela verificação de xeque para simular
  // jogadas sem alterar o estado real do jogo.
  //
  // TODO: por que não basta fazer const copia = this?
  //       Teste no console e veja o que acontece ao modificar.
  clonar() {
    const novo = new Board();
    novo.grid = clonarTabuleiro(this.grid);
    return novo;
  }
}