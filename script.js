// URL du flux radio : à remplacer par l'URL réelle du streaming de RADIO CIWARA.
const STREAM_URL = "STREAM_URL_A_COMPLETER";

const player = document.getElementById("radioPlayer");
const listenBtn = document.getElementById("listenBtn");
const status = document.getElementById("playerStatus");

listenBtn.addEventListener("click", async () => {
  if (STREAM_URL === "STREAM_URL_A_COMPLETER") {
    status.textContent = "Le flux radio n'est pas encore configuré. Envoie-moi l'URL du streaming.";
    return;
  }

  player.src = STREAM_URL;

  try {
    await player.play();
    listenBtn.textContent = "⏸ Mettre en pause";
    status.textContent = "Vous écoutez RADIO CIWARA 105.5 FM en direct.";
  } catch (error) {
    status.textContent = "Impossible de démarrer automatiquement le flux. Utilise le lecteur ci-dessous.";
  }
});

player.addEventListener("pause", () => {
  if (STREAM_URL !== "STREAM_URL_A_COMPLETER") {
    listenBtn.textContent = "▶ Écouter en direct";
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
