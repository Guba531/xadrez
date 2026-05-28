// ═══════════════════════════════════════════════════════
// main.js
//
// O QUE É ESTE ARQUIVO?
// O MAESTRO do jogo — não executa nada diretamente,
// mas orquestra todos os módulos para funcionarem juntos.
//
// ANALOGIA:
// Pense num restaurante:
//   core/    → a cozinha (regras, lógica, dados)
//   render/  → o prato (como as coisas aparecem)
//   ui/      → o garçom (interação com o usuário)
//   main.js  → o gerente (coordena tudo)
//
// O gerente não cozinha nem serve — ele garante que
// cada parte faz seu trabalho na hora certa.
//
// POR QUE type="module" NO HTML?
// ES Modules permite dividir o código em arquivos usando
// import/export. Sem ele, o browser não entende 'import'.
// Por isso não funciona abrindo o HTML diretamente —
// precisa de um servidor (Live Server, Python, etc).
//
// FLUXO DO JOGO:
//   1. Página carrega → modal aparece
//   2. Usuário configura → startGame() é chamada
//   3. Board é criado → tabuleiro é desenhado
//   4. Usuário clica → selecionaPeca() ou movePeca()
//   5. Após cada jogada → renderiza + atualiza sidebar
// ═══════════════════════════════════════════════════════

// ── IMPORTS ───────────────────────────────────────────────
// Cada import traz apenas o que precisamos de cada módulo.
// O browser carrega os arquivos automaticamente quando
// encontra estes imports.

import { Board }      from './core/board.js';
import { renderizar } from './render/drawBoard.js';
import {abrirModal, fecharModal, lerConfiguracoes } from './ui/modal.js';
import {
    mostrarNav,
    atualizarTurno,
    atualizarPlacar,
    animarPlacar,
    atualizarCapturadas,
    atualizarHistorico,
    setStatus
} from './ui/nav.js';
import { posicaoParaNotacao } from './core/utils.js';
