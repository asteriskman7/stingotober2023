'use strict';

window.sketchClass = class extends Sketch {
  desc = "If you connect all the mitochondria in a human body end to end, you would<br>create a battery with about the same electrical potential as a lightning bolt.";

  constructor() {
    super();

    this.emoji = {};
    this.emoji.skull = '\ud83d\udc80';
    this.emoji.face = '\ud83d\udc68\ud83c\udffb';
    this.emoji.hand = '\ud83d\udd90\ud83c\udffb';
    this.emoji.bolt = '\u26a1';

    this.nodeDist = 30;
    this.nodes = [];
    this.nodes.push({x: 0, y: 20, vx: 0, vy: 0, fixed: true});
    this.nodes.push({x: 0, y: -1 * this.nodeDist, vx: 0, vy: 0});
    this.nodes.push({x: 0, y: -2 * this.nodeDist, vx: 0, vy: 0});
    this.nodes.push({x: 0, y: -3 * this.nodeDist, vx: 0, vy: 0});
    this.boltTime = 0;
    this.nextBolt = 2;
  }

  update() {

    this.nodes.forEach( (n, i) => {
      if (n.fixed) {return;}


      if (this.boltTime > 0) {
        n.vx = 10 * this.lmap(Math.random(), 0, 1, -1, 1);
      } else {
        n.vx = 0.1 * this.lmap(Math.random(), 0, 1, -1, 1);
      }
      n.vy += 0;

      n.x += n.vx;
      n.y += n.vy;


      const np = this.nodes[i - 1];
      //apply constraints
      const dx = n.x - np.x;
      const dy = n.y - np.y;
      let angle = Math.atan2(dy, dx);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angleMin = -Math.PI / 2 - 0.2;
      const angleMax = -Math.PI / 2 + 0.2;
      if (angle < angleMin) {
        angle = angleMin;
      } else if (angle > angleMax) {
        angle = angleMax;
      }
      n.x = np.x + this.nodeDist * Math.cos(angle);
      n.y = np.y + this.nodeDist * Math.sin(angle);


    });

  }

  draw(ctx, width, height, t) {
    const skygrad = ctx.createLinearGradient(0, 0, 0, 400);
    skygrad.addColorStop(0, 'hsl(237,14%,11%)');
    skygrad.addColorStop(1, 'hsl(237,14%,40%)');
    ctx.fillStyle = skygrad;
    ctx.fillRect(0, 0, width, height);

    const grassgrad = ctx.createLinearGradient(0, 400, 0, height);
    grassgrad.addColorStop(1, 'hsl(100, 33%, 31%)');
    grassgrad.addColorStop(0, 'hsl(100, 33%, 10%)');
    ctx.fillStyle = grassgrad;
    ctx.fillRect(0, 400, width, 300);
    ctx.font = '320px Arial';
    ctx.fillStyle = 'white';
    ctx.translate(width / 2, height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.strokeStyle = 'hsl(29, 100%, 87%)';
    ctx.lineWidth = 150;
    ctx.beginPath();
    let lastNode;
    ctx.moveTo(this.nodes[0].x, this.nodes[0].y);
    this.nodes.forEach( (n, i) => {
      if (i === 0) {lastNode = n; return;}
      ctx.lineTo(n.x, n.y);
      lastNode = n;
    });
    ctx.stroke();


    if (this.boltTime <= 0) {
      if (Math.random() > 0.95) {
        this.boltTime = 1;
      }
    }
    this.boltTime -= 1/30;

    const bolt = this.boltTime > 0;
    const nNode = this.nodes[this.nodes.length - 1];
    const nm1Node = this.nodes[this.nodes.length - 2];
    const dx = nNode.x - nm1Node.x;
    const dy = nNode.y - nm1Node.y;
    const angle = Math.atan2(dy, dx);
    const hd = 110;

    const headx = nNode.x + hd * Math.cos(angle);
    const heady = nNode.y + hd * Math.sin(angle);
    ctx.fillText(bolt ? this.emoji.skull : this.emoji.face, headx, heady);
    let boltx;
    let bolty;
    if (bolt) {
      ctx.save();
      ctx.font = '200px Arial';
      const boltr = 250;
      const bolta = -Math.PI / 2 + this.lmap(Math.random(), 0, 1, -0.8, 0.8);
      boltx = headx + boltr * Math.cos(bolta);
      bolty = heady + boltr * Math.sin(bolta);
      ctx.translate(boltx, bolty);
      ctx.rotate(bolta + Math.PI / 2);
      ctx.fillText(this.emoji.bolt, 0, 0);
      ctx.restore();
    }

    ctx.font = '200px Arial';
    const handr = bolt ? hd * 1.2 : hd * 0.7;
    ctx.fillText(this.emoji.hand, nNode.x + 1.3 * handr * Math.cos(angle - Math.PI / 2), nNode.y + handr * Math.sin(angle - Math.PI / 2));
    ctx.save();
    ctx.scale(-1,1);
    ctx.fillText(this.emoji.hand, nNode.x + 1.3 * handr * Math.cos(angle - Math.PI / 2), nNode.y + handr * Math.sin(angle - Math.PI / 2));
    ctx.restore();

    if (!bolt) {
      ctx.fillStyle = 'hsla(0, 0%, 0%, 0.5)';
      ctx.fillRect(-width/2, -height, width, height);
    } else {
      const lg = ctx.createRadialGradient(boltx, bolty, 0, boltx, bolty, 600);
      lg.addColorStop(0, 'hsla(60, 100%, 50%, 0.3)');
      lg.addColorStop(1, 'hsla(60, 100%, 50%, 0.05)');
      ctx.fillStyle = lg;
      ctx.fillRect(-width/2, -height, width, height);
    }

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
