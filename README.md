# ♟ Xadrez — Projeto de Aprendizado

Projeto educacional de xadrez desenvolvido com HTML5 Canvas, CSS e JavaScript puro (ES Modules).
Criado como exercício progressivo para ensinar lógica de programação, orientação a objetos e boas práticas de organização de código.

---

## Tecnologias

- HTML5 Canvas — renderização do tabuleiro e animações
- CSS3 — layout, variáveis, transições e animações
- JavaScript ES Modules — organização modular sem frameworks

---

## Estrutura do Projeto

```
xadrez/
│
├── index.html                 ← estrutura da página, nav lateral, modal
├── style.css                  ← toda a estilização e animações CSS
├── main.js                    ← entrada principal, orquestra os módulos
│
├── core/                      ← lógica do jogo
│   ├── board.js               ← estado do tabuleiro, posições
│   ├── game.js                ← turno, xeque, condições de fim de jogo
│   └── pieces/                ← cada peça em seu próprio arquivo
│       ├── piece.js           ← classe base (herança)
│       ├── pawn.js            ← regras do peão
│       ├── rook.js            ← regras da torre
│       ├── knight.js          ← regras do cavalo
│       ├── bishop.js          ← regras do bispo
│       ├── queen.js           ← regras da rainha
│       └── king.js            ← regras do rei
│
├── render/                    ← tudo que aparece na tela
│   ├── drawBoard.js           ← desenha o tabuleiro no canvas
│   ├── drawPieces.js          ← desenha as peças
│   └── animations.js          ← animações de movimento e captura
│
├── ai/                        ← inteligência artificial
│   ├── random.js              ← nível fácil — jogada aleatória válida
│   └── minimax.js             ← nível difícil — algoritmo minimax
│
└── ui/                        ← interface e interação
    ├── nav.js                 ← abertura/fechamento das seções da nav
    ├── modal.js               ← modal de configuração de partida
    └── sidebar.js             ← placar, histórico, turno, capturadas
```

---

## Conceitos ensinados por módulo

| Módulo | Conceito principal |
|---|---|
| `piece.js` + peças | Herança e polimorfismo (OOP) |
| `board.js` | Estado da aplicação, arrays 2D |
| `main.js` | Orquestração, imports/exports |
| `style.css` | CSS Variables, Flexbox, animações |
| `nav.js` | Tag semântica `<nav>`, menus laterais |
| `modal.js` | Eventos, classList, transições |
| `animations.js` | requestAnimationFrame, Canvas API |
| `ai/random.js` | Aleatoriedade, estruturas de dados |
| `ai/minimax.js` | Recursão, algoritmos de busca |

---

## Como rodar localmente

O projeto usa ES Modules, por isso **não abre direto no navegador** clicando no arquivo.
É preciso um servidor local:

**Opção 1 — VS Code com Live Server** (recomendado para o aluno)
- Instale a extensão Live Server
- Clique com botão direito em `index.html` → "Open with Live Server"

**Opção 2 — Python**
```bash
python -m http.server 8000
# acesse http://localhost:8000
```

**Opção 3 — Node.js**
```bash
npx serve .
```

---

## Deploy

O projeto é publicado via **GitHub Pages**.
Qualquer `git push` na branch `main` atualiza o site automaticamente.

```bash
git add .
git commit -m "descrição da mudança"
git push
```

URL do projeto: `https://seu-usuario.github.io/xadrez`

---

## Previsão de aulas

> Esta é uma previsão. O ritmo pode variar conforme o andamento e as descobertas durante o desenvolvimento — e isso faz parte do aprendizado!

| Aula | Tema |
|---|---|
| 1 | Estrutura de pastas, ES Modules, `piece.js` base, herança com `Pawn` |
| 2 | `Rook`, `Bishop`, `Queen` — movimento deslizante, lógica compartilhada |
| 3 | `Knight`, `King` — movimentos fixos, limites do tabuleiro |
| 4 | `<nav>` semântica, CSS transitions, configurações de partida |
| 5 | `ai/random.js` — primeira IA funcionando |
| 6 | `animations.js` — peças se movendo, captura animada estilo Battle Chess |
| 7 | `ai/minimax.js` — IA difícil com algoritmo de busca (desafio!) |

---

## Funcionalidades previstas

- [x] Modal de início com escolha de modo e cor
- [x] Nav lateral com placar, turno e histórico
- [x] Tabuleiro no Canvas com coordenadas
- [x] Destaque de casas válidas ao selecionar peça
- [x] Registro de peças capturadas
- [ ] Animação de movimento suave
- [ ] Animação de captura (estilo Battle Chess)
- [ ] Liga/desliga animações
- [ ] Escolha de dificuldade da IA
- [ ] Xeque e xeque-mate
- [ ] Movimentos especiais: roque, en passant, promoção
- [ ] Desfazer jogada

---

*Projeto desenvolvido em aula — boas capturas!* ♟