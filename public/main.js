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
