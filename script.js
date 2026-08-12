// URL du flux radio : à remplacer par l'URL réelle du streaming de RADIO CIWARA.
const radioPlayer = document.getElementById("radioPlayer");
const listenBtn = document.getElementById("listenBtn");
const playerStatus = document.getElementById("playerStatus");

listenBtn.addEventListener("click", function () {

    if (radioPlayer.paused) {

        radioPlayer.play()
            .then(() => {
                listenBtn.textContent = "⏸ Pause";
                playerStatus.textContent = "🔴 RADIO CIWARA 105.5 FM — EN DIRECT";
            })
            .catch((error) => {
                console.error(error);
                playerStatus.textContent =
                    "❌ Impossible de démarrer la radio.";
            });

    } else {

        radioPlayer.pause();

        listenBtn.textContent = "▶ Écouter en direct";
        playerStatus.textContent = "Radio en pause.";
    }
});

radioPlayer.addEventListener("playing", function () {
    playerStatus.textContent =
        "🔴 RADIO CIWARA 105.5 FM — EN DIRECT";
});

radioPlayer.addEventListener("pause", function () {
    listenBtn.textContent = "▶ Écouter en direct";
});

radioPlayer.addEventListener("error", function () {
    playerStatus.textContent =
        "❌ Le flux radio est momentanément indisponible.";
});
