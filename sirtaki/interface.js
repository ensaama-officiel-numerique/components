var b = document.querySelector('#bouton');
var son = document.querySelector('#zorba');

var AudioContext = window.AudioContext || window.webkitAudioContext;
var contexteAudio = new AudioContext;
unlockAudioIOS(contexteAudio); // ok pour context = AudioContext;

function resumeAudio() {
    console.log(contexteAudio.state);

    if(contexteAudio.state == "suspended")
    {
          contexteAudio.resume();
          console.log('Playback resumed successfully');
          son.play();
          b.innerHTML = "SON OFF";
          console.log("SON OFF");
    }
    else {
          contexteAudio.suspend();
          console.log('Playback paused successfully');
          son.pause();
          b.innerHTML = "SON ON";
          console.log("SON ON");
    }
    //document.removeEventListener("click", resumeAudio);
}
b.onclick = resumeAudio;
// infos audio
var info = document.querySelector('#info');
var current = document.querySelector('#current');

son.ontimeupdate = function() {tps_ecoule()};
function tps_ecoule() {
  var courant = son.currentTime.toFixed(2);
  current.innerHTML = "temps écoulé : "+courant+"s";
  info.innerHTML = "durée totale : "+son.duration.toFixed(2)+"s";
  periode = getPeriode(courant);
}

function getPeriode(ref) {
    var periode = 0;
    for (i = 1 ; i < danse.length ; i++) {
          if(ref >= danse[i].debut) periode++;
    }
    return periode;
}
