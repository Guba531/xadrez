export function mostrarXequeMate() {
    const overlay = document.getElementById('xequeMateOverlay');

    if (!overlay) return;

    overlay.classList.add('ativo');
    overlay.setAttribute('aria-hidden', 'false');

    tocarSomXequeMate();
}

export function esconderXequeMate() {
    const overlay = document.getElementById('xequeMateOverlay');

    if (!overlay) return;

    overlay.classList.remove('ativo');
    overlay.setAttribute('aria-hidden', 'true');
}

function tocarSomXequeMate() {
    const audio = document.getElementById('somXequeMate');

    if (!audio) return;

    audio.currentTime = 0;
    audio.onplay().catch(() => {});
}