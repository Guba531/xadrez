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