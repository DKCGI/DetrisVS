class Tetris {
  constructor(element) {
    this.element = element;
    this.canvas = element.querySelector('canvas');
    this.context = this.canvas.getContext('2d');
    this.context.scale(28, 28);
    this.arena = new Arena(12, 20);
    this.player = new Player(this);
    this.player.events.listen('score', (score) => {
      this.updateScore(score);
    });
    this.paused = false;
    this.level = 0;
    this.score = 0;
    this.animationFrame;
    this.colors = [
      null,
      '255,0,0',
      '0,0,255',
      '255,0,255',
      '0,255,0',
      '100,0,255',
      '255,200,0',
      '255,100,100',
      '50,50,50',
    ];
    let lastTime = 0;
    this._update = (time = 0) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      this.player.update(deltaTime);
      this.draw();
      this.animationFrame = requestAnimationFrame(this._update);
    };
    this.updateScore(0);
  }
  run() {
    this._update();
  }
  pause() {
    cancelAnimationFrame(this.animationFrame);
    this.paused = true;
  }
  serialize() {
    return {
      arena: {
        matrix: this.arena.matrix,
      },
      player: {
        matrix: this.player.matrix,
        pos: this.player.pos,
        score: this.player.score,
      },
    };
  }
  unserialize(state) {
    this.arena = Object.assign(state.arena);
    this.player = Object.assign(state.player);
    this.updateScore(this.player.score);
    this.draw();
  }
  updateScore(score) {
    if (score == 0) {
      this.level = 0;
      this.element.querySelector('.level').innerText = this.level;
    }
    this.element.querySelector('.score').innerText = score;
    if (score > this.score) {
      this.element.querySelector('.level').innerText = ++this.level;
    }
    this.score = score;
  }
  draw() {
    this.context.fillStyle = 'rgba(0,0,0,0.1)';
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMatrix(this.arena.matrix, { x: 0, y: 0 });
    this.drawMatrix(this.player.matrix, this.player.pos);
    if (this.player.nextMatrix) {
      this.context.scale(0.5, 0.5);
      this.drawMatrix(this.player.nextMatrix, { x: 11, y: 1 }, 0.5);
      this.context.scale(2, 2);
    }
  }
  drawMatrix(matrix, offset, alpha = 1) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.context.fillStyle = `rgba(${this.colors[value]},${alpha})`;
          this.context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  }
}
