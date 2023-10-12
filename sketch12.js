'use strict';

window.sketchClass = class extends Sketch {
  desc = "Maybe demons are really just misunderstood slugs."; // jshint ignore:line

  constructor() {
    super();

    this.particles = [];

    this.paths = [];
    const deltaAngle = 2 * Math.PI / 5;
    const pathR = 150;
    for (let i = 0; i < 5; i++) {
      const path = {type: 'line'};
      const angle0 = - Math.PI / 2 + deltaAngle * i * 2;
      const angle1 = angle0 + 2 * deltaAngle;
      path.x0 = pathR * Math.cos(angle0);
      path.y0 = pathR * Math.sin(angle0);
      path.x1 = pathR * Math.cos(angle1);
      path.y1 = pathR * Math.sin(angle1);
      path.dx = path.x1 - path.x0;
      path.dy = path.y1 - path.y0;
      this.paths.push(path);
    }
    this.paths.push({
      type: 'circle',
      x: 0,
      y: 0,
      a0: -Math.PI / 2,
      a1: Math.PI / 2,
      r: pathR
    });
    this.paths.push({
      type: 'circle',
      x: 0,
      y: 0,
      a0: Math.PI / 2,
      a1: 3 * Math.PI / 2,
      r: pathR
    });
  }

  update() {

    const pathTime = 10;
    const totalPathTime = pathTime * this.paths.length;
    const blowTime = 5;
    const showTime = totalPathTime + blowTime;
    this.blow = false;

    if (this.t < totalPathTime) {
      //add particles to path
      const pathNum = Math.floor(this.t / pathTime);
      const pathF = (this.t % pathTime) / pathTime;

      const workingPath = this.paths[pathNum];
      const l = this.lmap(Math.random(), 0, 1, 80, 100);
      const rsize = 3;
      const ppp = 10;
      switch (workingPath.type) {
        case 'line': {
          for (let i = 0; i < ppp; i++) {
            const px = workingPath.x0 + workingPath.dx * pathF + this.gaussianRandom(0, rsize);
            const py = workingPath.y0 + workingPath.dy * pathF + this.gaussianRandom(0, rsize);
            this.particles.push({x: px, y: py, c: `hsl(0, 0%, ${l}%)`, vx: 0, vy: 0});
          }
          break;
        }
        case 'circle': {
          const pangle = workingPath.a0 + (workingPath.a1 - workingPath.a0) * pathF;
          for (let i = 0; i < ppp; i++) {
            const px = workingPath.r * Math.cos(pangle) + this.gaussianRandom(0, rsize);
            const py = workingPath.r * Math.sin(pangle) + this.gaussianRandom(0, rsize);
            this.particles.push({x: px, y: py, c: `hsl(0, 0%, ${l}%)`, vx: 0, vy: 0});
          }
          break;
        }
      }
    } else if (this.t < showTime) {
      //blow particles
      this.blow = true;
      this.particles.forEach( p => {
        p.vx -= (this.t - totalPathTime) * (0.2 + 0.01 * this.lmap(Math.random(), 0, 1, -1, 1));
        p.vy += (this.t - totalPathTime) * 0.1 * this.lmap(Math.random(), 0, 1, -1, 1);

        p.x += p.vx;
        p.y += p.vy;
      });
    } else {
      //reset
      this.t = 0;
      this.particles = [];
    }
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsl(36, 36%, 28%)';
    ctx.fillRect(0, 0, width, height);

    const boardWidth = 40;
    const boardCountX = Math.ceil(width / boardWidth);
    const lineCount = 5;
    const blc = 'hsl(36, 36%, 28%)';
    const bdc = 'hsl(36, 36%, 16%)';
    ctx.strokeStyle = bdc;
    for (let bix = 0; bix < boardCountX; bix++) {
      let nextY = this.rnd(bix * 353) * -40;
      let boardHeight = this.rnd(bix * 6632 + nextY) * 30 + 100;
      while (nextY < height) {
        const g = ctx.createLinearGradient(bix * boardWidth, 0, (bix + 1) * boardWidth, 0);
        const lineCount = 4 + Math.floor(this.rnd(bix * 922 + nextY * 661) * 3);
        for (let l = 0; l < lineCount; l++) {
          g.addColorStop(Math.max(0, l / lineCount + 0.1 * this.rnd(l * 534 + bix + nextY * 622)), blc);
          g.addColorStop(Math.min(1, (l + 0.5) / lineCount + 0.1 * this.rnd(l * 424 + bix + nextY * 452)), bdc);
        }
        ctx.fillStyle = g;
        ctx.fillRect(bix * boardWidth, nextY, boardWidth, boardHeight);
        ctx.strokeRect(bix * boardWidth, nextY, boardWidth, boardHeight);
        nextY += boardHeight;
      }
    }

    ctx.translate(width / 2, height / 2);

    this.particles.forEach( p => {
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, 1, 1);
    });

    if (this.blow) {
      if (Math.random() > 0.8) {
        ctx.fillStyle = `hsla(0, 0%, 80%, 0.2)`;
      } else {
        ctx.fillStyle = `hsla(0, 0%, 0%, 0.2)`;
      }
    } else {
      ctx.fillStyle = 'hsla(0, 0%, 0%, 0.2)';
    }
    ctx.fillRect(-width / 2, -height / 2, width, height);
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
