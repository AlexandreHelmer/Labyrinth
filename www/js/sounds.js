const SOUNDS = {
  home:     new Audio("sounds/casper.mp3"),     // page d’accueil
  bgm:      new Audio("sounds/casper.mp3"), // musique de jeu
  win:      new Audio("sounds/win2.mp3"),
};

// options utiles
SOUNDS.bgm.loop = true;
SOUNDS.home.loop = true;


function playSound(name) {
  if (SOUNDS[name]) {
    SOUNDS[name].currentTime = 0;
    SOUNDS[name].play();
  }
}

function playMusic(name) {
  stopAllMusic();
  if (SOUNDS[name]) {
    SOUNDS[name].play();
  }
}

function stopAllMusic() {
  for (let key in SOUNDS) {
    SOUNDS[key].pause();
    SOUNDS[key].currentTime = 0;
  }
}