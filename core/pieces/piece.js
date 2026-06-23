// ═══════════════════════════════════════════════════════
// core/pieces/piece.js
//
// O QUE É ESTE ARQUIVO?
// Define a classe BASE de todas as peças do xadrez.
//
// O QUE É UMA CLASSE BASE?
// É uma "planta" com tudo que todas as peças têm em comum.
// Cada peça específica (Pawn, Rook, Knight...) vai HERDAR
// essa classe e adicionar apenas o que é único dela.
//
// POR QUE HERANÇA AQUI?
// Sem herança, teríamos que repetir em cada peça:
//   this.color, this.type, toString()...
//
// Com herança:
//   Piece    → cor, tipo, símbolo (tudo em comum)
//   Pawn     → estende Piece, adiciona só a lógica do peão
//   Rook     → estende Piece, adiciona só a lógica da torre
//
// Isso se chama princípio DRY: Don't Repeat Yourself.
// ═══════════════════════════════════════════════════════

export class Piece {
    // ── constructor ────────────────────────────────────────
    // Chamado quando criamos uma peça: new Pawn('white')
    // Recebe a cor e armazena as propriedades básicas.
    //
    // 'type' e 'symbol' ficam vazios aqui — cada subclasse
    // define os seus no próprio constructor antes de chamar
    // super(), ou logo depois.
    constructor(color) {

        // 'white' ou 'black' - define de qual lado a peca pertence
        this.color = color;

        //Sera sobrestcrito pela subclasse: 'pawn', 'rook', etc.
        this.type = '';

        // Símbolo Unicode exibido no canvas: ♙ ♟ ♖ ♜ etc.
        this.symbol = '';

        //Indica se a peca ja se moveu (util para roque e peao)
        this.moveu = false;
    }
    
    // ── getValidMoves ──────────────────────────────────────
  // Método que TODA peça deve ter — retorna array de casas
  // para onde essa peça pode se mover.
  //
  // Por que retornar array vazio aqui?
  // A classe base não sabe como cada peça se move.
  // Ela define o "contrato": toda peça TEM esse método.
  // Cada subclasse vai SOBRESCREVER com sua lógica própria.
  //
  // Isso se chama POLIMORFISMO — o board.js pode chamar
  // peca.getValidMoves() sem precisar saber se é peão,
  // torre ou rainha. Cada uma responde do seu jeito.
  //
  // TODO: o que acontece se uma subclasse esquecer de
  //       sobrescrever esse método? Teste com um console.log.
  getValidMoves(row, col, grid) {
    // Subclasses devem sobrescrever este método.
    // Retornar array vazio garante que o jogo não quebre
    // se chamarmos em uma peça sem implementação.
    return [];
  }

  // ── toString ───────────────────────────────────────────
  // Representação em texto da peça — útil para debug.
  // console.log(peca) vai mostrar algo legível.
  toString() {
    return `${this.color} ${this.type} (${this.symbol})`;
  }
}