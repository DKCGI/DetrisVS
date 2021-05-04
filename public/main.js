const tetrisManager = new TetrisManager(document);
const localTetris = tetrisManager.createPlayer();
localTetris.element.classList.add('local');
localTetris.run();
const connectionManager = new ConnectionManager(tetrisManager);
// const url = location.origin.replace(/^https/, 'ws');
connectionManager.connect('wss://detrisbvsackend.herokuapp.com/');
// connectionManager.connect(url);
const keyListener = (event) => {
  [
    [65, 68, 81, 69, 83],
    [72, 75, 89, 73, 74],
  ].forEach((key, index) => {
    const player = localTetris.player;
    if (event.type === 'keydown') {
      if (event.keyCode === key[0]) {
        player.move(-1);
      } else if (event.keyCode === key[1]) {
        player.move(1);
      } else if (event.keyCode === key[2]) {
        player.rotate(-1);
      } else if (event.keyCode === key[3]) {
        player.rotate(1);
      }
    }
    if (event.keyCode === key[4]) {
      if (event.type === 'keydown') {
        if (player.dropInterval !== player.DROP_FAST) {
          player.drop();
          player.dropInterval = player.DROP_FAST;
        }
      } else {
        player.dropInterval = player.DROP_SLOW; //!drop fast/slow seems unnecessary
      }
    }
  });
};
document.addEventListener('keydown', keyListener);
document.addEventListener('keyup', keyListener);
document.addEventListener('touchend', (e) => {
  e.preventDefault();
  const player = localTetris.player;
  player.move1 = false;
  player.move2 = false;
  player.rotate1 = false;
  player.rotate2 = false;
  player.drop1 = false;
});
document.addEventListener('touchstart', (e) => {
  const player = localTetris.player;
  const localArena = document.querySelector('.player.local');
  if (
    e.touches[0].clientX >
      localArena.getBoundingClientRect().left + localArena.clientWidth * 0.7 &&
    e.touches[0].clientY < window.innerHeight * 0.85 &&
    e.touches[0].clientY > window.innerHeight * 0.15
  ) {
    // player.move(1);
    player.move1 = true;
  } else if (
    e.touches[0].clientX >
      localArena.getBoundingClientRect().left + localArena.clientWidth * 0.7 &&
    e.touches[0].clientY >= window.innerHeight * 0.85
  ) {
    // player.rotate(1);
    player.rotate1 = true;
  } else if (
    e.touches[0].clientX <
      localArena.getBoundingClientRect().left + localArena.clientWidth * 0.3 &&
    e.touches[0].clientY < window.innerHeight * 0.85 &&
    e.touches[0].clientY > window.innerHeight * 0.15
  ) {
    // player.move(-1);
    player.move2 = true;
  } else if (
    e.touches[0].clientX < window.innerWidth * 0.3 &&
    e.touches[0].clientY >= window.innerHeight * 0.85
  ) {
    // player.rotate(-1);
    player.rotate2 = true;
  } else if (e.touches[0].clientY > window.innerHeight * 0.85) {
    // player.drop();
    player.drop1 = true;
  }
});

const pauseButton = document.querySelector('.pause');
const playButton = document.querySelector('.unpause');
pauseButton.addEventListener('click', pauseUnpause);
pauseButton.addEventListener('touchstart', pauseUnpause);
playButton.addEventListener('click', pauseUnpause);
playButton.addEventListener('touchstart', pauseUnpause);

function pauseUnpause(e) {
  e.preventDefault();
  if (localTetris.paused) {
    localTetris._update();
    localTetris.paused = false;
    pauseButton.style.display = 'block';
    playButton.style.display = 'none';
  } else {
    localTetris.pause();
    pauseButton.style.display = 'none';
    playButton.style.display = 'block';
  }
}
function isMobile() {
  // credit to Timothy Huang for this regex test:
  // https://dev.to/timhuang/a-simple-way-to-detect-if-browser-is-on-a-mobile-device-with-javascript-44j3
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    return true;
  } else {
    return false;
  }
}

if (!isMobile()) {
  document.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const localArena = document.querySelector('.player.local');
    console.log(
      localArena.getBoundingClientRect().left,
      localArena.clientWidth
    );
    const player = localTetris.player;
    if (
      e.clientX >
        localArena.getBoundingClientRect().left +
          localArena.clientWidth * 0.7 &&
      e.clientY < window.innerHeight * 0.85 &&
      e.clientY > window.innerHeight * 0.15
    ) {
      player.move(1);
    } else if (
      e.clientX > window.innerWidth * 0.7 &&
      e.clientY >= window.innerHeight * 0.85
    ) {
      player.rotate(1);
    } else if (
      e.clientX <
        localArena.getBoundingClientRect().left +
          localArena.clientWidth * 0.3 &&
      e.clientY < window.innerHeight * 0.85 &&
      e.clientY > window.innerHeight * 0.15
    ) {
      player.move(-1);
    } else if (
      e.clientX < window.innerWidth * 0.3 &&
      e.clientY >= window.innerHeight * 0.85
    ) {
      player.rotate(-1);
    } else if (e.clientY > window.innerHeight * 0.85) {
      player.drop();
    }
  });
}

//mouse Controls- able to jump over pieces

// let mousePos = { x: 0, y: 0 };
// localTetris.canvas.addEventListener("mousemove", (e) => {
//   mousePos.x = Math.round(e.offsetX / 40) - 1;
//   if (mousePos.x > -2 && mousePos.x <= localTetris.arena.matrix.length - 10) {
//     if (!localTetris.arena.collide(localTetris.player)) {
//       let lastPos = localTetris.player.pos.x;
//       localTetris.player.pos.x = mousePos.x;
//       if (localTetris.arena.collide(localTetris.player)) {
//         localTetris.player.pos.x = lastPos;
//       }
//     }
//   }
// });
// localTetris.canvas.addEventListener("mousedown", function (e) {
//   e.preventDefault();
//   if (e.button === 0) {
//     localTetris.player.rotate(1);
//   } else {
//     localTetris.player.drop();
//   }
// });
