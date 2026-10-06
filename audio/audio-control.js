var b = document.querySelector('#bouton');
var son = document.querySelector('#son');

var AudioContext = window.AudioContext || window.webkitAudioContext;
var contexteAudio = new AudioContext();

var DELAI_BOUTON_MS = 10000; // Délai de 10 secondes pour le bouton
var timerBouton = null;

function playOrPause() {
    if (contexteAudio.state === "suspended") {
        contexteAudio.resume().then(function() {
            console.log('Playback resumed successfully');
            son.play();
            b.innerHTML = "SON OFF";
            console.log("SON OFF");
        });
    } else if (son.paused) {
        son.play();
        b.innerHTML = "SON OFF";
        console.log("SON OFF");
    } else {
        son.pause();
        b.innerHTML = "SON ON";
        console.log("SON ON");
    }
}

// Clic sur le bouton : déclenchement avec délai
if (b) {
    b.onclick = function() {
        if (timerBouton) clearTimeout(timerBouton);

        if (son.paused) {
            b.innerHTML = "PATIENTEZ...";
            timerBouton = setTimeout(function() {
                playOrPause();
                timerBouton = null;
            }, DELAI_BOUTON_MS);
        } else {
            playOrPause();
        }
    };
}

// Raccourci clavier ('S' ou 's') : déclenchement instantané
window.addEventListener('keydown', function(event) {
    if (event.key.toLowerCase() === 's') {
        if (timerBouton) {
            clearTimeout(timerBouton);
            timerBouton = null;
        }
        playOrPause();
    }
});