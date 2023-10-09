'use strict';

window.sketchClass = class extends Sketch {
  desc = 'Refuse to excuse the views of those whose muse eschews blue\'s clues.';

  constructor() {
    super();
    this.size = 4;
    this.potWidthPx = 300;
    this.potHeightPx = 250;
    this.potWidth = Math.floor(this.potWidthPx / this.size);
    this.potHeight = Math.floor(this.potHeightPx / this.size);
    this.potX = this.canvas.width / 2 - this.potWidthPx / 2;
    this.potY = 250;
    this.cells = [];
    this.cellMap = {};
    //init cells
    for (let y = 0; y < this.potHeight; y++) {  
      for (let x = 0; x < this.potWidth; x++) {
        if (y > 20) {
          if ((Math.abs(x - this.potWidth / 2) - (y - 15)) > 5) {continue;}
        } else {
          if (Math.abs(Math.abs(x - this.potWidth / 2) - 0) > 10) {continue;}
        }
        const cell = {v: 0, neighbors: [], x, y};
        this.cellMap[`${x},${y}`] = cell;
        this.cells.push(cell);
      }
    }
   
    //precalculate neighbors
    this.cells.forEach( cell => {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) {continue;}
          const nx = cell.x + dx;
          const ny = cell.y + dy;
          const nc = this.cellMap[`${nx},${ny}`];
          if (nc) {
            cell.neighbors.push(nc);
          }
        }
      }
    });

    this.plist = [];
    this.nextDrip = 0;
  }

  update() {

    //create drip
    if (this.t >= this.nextDrip) {
      this.plist.push({
        x: this.lmap(Math.random(), 0, 1, this.canvas.width / 2 - 30, this.canvas.width / 2 + 30),
        y: 0,
        vy: 5,
        r: Math.floor(10 * Math.random() + 3),
        alive: true
      });
      this.nextDrip = this.t + this.lmap(Math.random(), 0, 1, 0.25, 0.75);
    }

    //update drips
    this.plist.forEach( p => {
      p.vy += 1;
      p.y += p.vy;

      p.alive = p.y + p.r < this.potY;
      if (!p.alive) {
        for (let r = -p.r; r <= p.r; r++) {
          const dripX = Math.floor((p.x + r - this.potX) / this.size);
          const dripCell = this.cellMap[`${dripX},0`];
          if (dripCell) {
            dripCell.v += 10;
          }
        }
      }
    });

    //remove dead drips
    this.plist = this.plist.filter(p => p.alive);

    //update cells to diffuse value
    for (let x = 0; x < this.potWidth; x++) {
      for (let y = 0; y < this.potHeight; y++) {
        const ci = x + y * this.potWidth;
        const c = this.cellMap[`${x},${y}`];
        if (!c) {continue;}
        c.nextv = c.v / (c.neighbors.length + 1);
        c.neighbors.forEach( nc => {
          c.nextv += nc.v / (nc.neighbors.length + 1);
        });
      }
    }

    this.cells.forEach( c => {
      c.v = c.nextv % 100;
    });


  }

  draw(ctx, width, height, t) {
    
    //draw wall
    const wgrad = ctx.createLinearGradient(width / 2, 0, width / 2, height);
    wgrad.addColorStop(0, 'hsl(287, 80%, 20%)');
    wgrad.addColorStop(1, 'hsl(287, 80%, 5%)');
    ctx.fillStyle = wgrad;
    ctx.fillRect(0, 0, width, height);

    //draw table
    const tgrad = ctx.createLinearGradient(width / 2, height, width / 2, height - 100);
    tgrad.addColorStop(0, 'hsl(36, 53%, 26%)');
    tgrad.addColorStop(1, 'hsl(36, 53%, 15%)');
    ctx.fillStyle = tgrad;
    ctx.beginPath();
    ctx.moveTo(20, height);
    ctx.lineTo(100, height - 100);
    ctx.lineTo(width - 100, height - 100);
    ctx.lineTo(width - 10, height);
    ctx.closePath();
    ctx.fill();

    //draw drips
    this.plist.forEach( p => {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 1.5);
      grad.addColorStop(0, 'hsl(205, 13%, 63%)');
      grad.addColorStop(1.0, 'hsla(205, 13%, 63%, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.r * 0.75, p.r, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    //draw cells
    this.cells.forEach( cell => {
      const h = this.lmap(cell.v, 0, 100, 0, 360);
      const ax = this.potX + cell.x * this.size;
      const ay = this.potY + cell.y * this.size; 
      const gx = ax + this.size / 2;
      const gy = ay + this.size / 2;
      const gridGrad = ctx.createRadialGradient(gx, gy, this.size, gx, gy, this.size * 2);
      gridGrad.addColorStop(0, `hsl(${h}, 50%, 50%)`);
      gridGrad.addColorStop(1, `hsla(${h}, 50%, 50%, 0)`);
      ctx.fillStyle = gridGrad;
      ctx.beginPath();
      ctx.arc(ax, ay, this.size , 0, 2 * Math.PI);
      ctx.fill();
    });

    //draw bottle
    ctx.strokeStyle = 'hsl(148, 13%, 40%)';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(width / 2 - 40, this.potY);
    ctx.lineTo(width / 2 - 40, this.potY + 80);
    ctx.lineTo(this.potX, this.potY + this.potHeightPx - 60);
    ctx.lineTo(this.potX, this.potY + this.potHeightPx - 4);
    ctx.lineTo(this.potX + this.potWidthPx, this.potY + this.potHeightPx - 4);
    ctx.lineTo(this.potX + this.potWidthPx, this.potY + this.potHeightPx - 60);
    ctx.lineTo(width / 2 + 40, this.potHeightPx + 80);
    ctx.lineTo(width / 2 + 40, this.potY);
    ctx.stroke();

    //draw spout
    ctx.beginPath();
    ctx.moveTo(width / 2 - 30, 5);
    ctx.lineTo(width / 2 + 30, 5);
    ctx.stroke();
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
