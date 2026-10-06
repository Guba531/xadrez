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
    const som1 = document.getElementById('somXequeMate1');
    const som2 = document.getElementById('somXequeMate2');
    const som3 = document.getElementById('somXequeMate3');

    if (!som1 || !som2 || !som3) return;

    som1.currentTime = 0;
    som2.currentTime = 0;
    som3.currentTime = 0;

    som1.play()
    .then(() => {
        som1.onended = () => {
            som2.play()
            .then(() => {
                som2.onended = () => {
                    som3.play()
                    .then(() => {
                        setTimeout(() => {
                            som3.pause();
                            som3.currentTime = 0;
                        }, 3000);
                    })
                    .catch(() => {});
                }
            })
            .catch(() => {});
        }
    })
    .catch(() => {});
}

window.testarXequeMate = mostrarXequeMate;