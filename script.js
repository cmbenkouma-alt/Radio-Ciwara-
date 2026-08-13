const audio = document.getElementById("radioPlayer");
const status = document.getElementById("status");
const playIcon = document.getElementById("playIcon");
const playText = document.getElementById("playText");
const barPlay = document.getElementById("barPlay");

const buttons = document.querySelectorAll("[data-play]");

const MOBILE_RADIO_URL = "https://ciwarafm.radio12345.com/";
const RADIO_STREAM_URL = "https://uk5freenew.listen2myradio.com/live.mp3?typeportmount=s1_35628_stream_416941156";

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
}

function updatePlayer(playing) {

    if (playIcon) {
        playIcon.textContent = playing ? "Ⅱ" : "▶";
    }

    if (playText) {
        playText.textContent = playing
            ? "METTRE EN PAUSE"
            : "ÉCOUTER EN DIRECT";
    }

    if (barPlay) {
        barPlay.textContent = playing ? "Ⅱ" : "▶";
    }

    if (status) {
        status.textContent = playing
            ? "🔴 Radio Ciwara 105.5 FM — EN DIRECT"
            : "Prêt à écouter la radio";
    }

    document.body.classList.toggle("playing", playing);
}


/*
====================================================
ÉCOUTE DE LA RADIO
====================================================
*/

async function listenToRadio() {

    /*
    Sur téléphone :
    on utilise le lecteur officiel Radio Ciwara.
    Cela évite les problèmes de compatibilité
    des flux radio directs sur iPhone / Android.
    */

    if (isMobileDevice()) {

        window.location.href = MOBILE_RADIO_URL;

        return;
    }


    /*
    Sur ordinateur :
    tentative de lecture directe du flux.
    */

    if (!audio) {
        return;
    }

    audio.src = RADIO_STREAM_URL;

    if (audio.paused) {

        try {

            if (status) {
                status.textContent = "Connexion au direct…";
            }

            await audio.play();

            updatePlayer(true);

        } catch (error) {

            console.error("Erreur du lecteur :", error);

            if (status) {
                status.textContent =
                    "Impossible de démarrer le direct.";
            }

            /*
            Solution de secours :
            ouverture de la page officielle.
            */

            setTimeout(() => {
                window.open(MOBILE_RADIO_URL, "_blank");
            }, 300);

        }

    } else {

        audio.pause();

        updatePlayer(false);
    }
}


/*
====================================================
BOUTONS ÉCOUTER EN DIRECT
====================================================
*/

buttons.forEach(button => {

    button.addEventListener("click", function(event) {

        event.preventDefault();

        listenToRadio();

    });

});


/*
====================================================
ÉVÉNEMENTS DU LECTEUR
====================================================
*/

if (audio) {

    audio.addEventListener("playing", function() {

        updatePlayer(true);

    });


    audio.addEventListener("pause", function() {

        updatePlayer(false);

    });


    audio.addEventListener("waiting", function() {

        if (status) {
            status.textContent = "Connexion au direct…";
        }

    });


    audio.addEventListener("error", function() {

        console.error("Le flux Radio Ciwara est indisponible.");

        updatePlayer(false);

        if (status) {

            status.textContent =
                "Le direct est momentanément indisponible.";

        }

    });

}


/*
====================================================
MENU MOBILE
====================================================
*/

const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");

if (hamburger && nav) {

    hamburger.addEventListener("click", function() {

        nav.classList.toggle("open");

    });

}


document.querySelectorAll("#nav a").forEach(link => {

    link.addEventListener("click", function() {

        if (nav) {
            nav.classList.remove("open");
        }

    });

});


/*
====================================================
HORLOGE
====================================================
*/

function updateClock() {

    const clock = document.getElementById("clock");

    if (!clock) {
        return;
    }

    const now = new Date();

    clock.textContent = now.toLocaleTimeString(
        "fr-FR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

updateClock();

setInterval(updateClock, 30000);


/*
====================================================
ANNÉE
====================================================
*/

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}
