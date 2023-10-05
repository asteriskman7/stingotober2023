'use strict';

window.sketchClass = class extends Sketch {
  desc = 'Babies born with a true tail have been reported fewer than 40 times in modern history.<br>Of course, this does not include cases where the tail grew later in life due to strange occult practices.';

  constructor() {
    super();

    //create skin nodes
    const nodes = [];

    nodes.push({x: -256, y: 0, vx: 0, vy: 0, fixed: true});
    
    const nodeCount = 10;
    const nodeDist = 1 / (nodeCount + 1);
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({x: 0, y: i * 5, vx: 0, vy: 0});
    }

    //create skin springs between each node pair
    const springs = [];

    for (let i = 0; i < nodes.length-1; i++) {
      springs.push({l: nodeDist * 0.0125, k: 100, n0: i, n1: i + 1});
    }

    this.pins = [];

    this.nodes = nodes;
    this.springs = springs;
  }


  update() {
    const dt = 1/30;


    //move head around
    const r = 200 + 20 * Math.sin(this.t * 9 + 666);
    this.nodes[0].x = r * Math.cos(this.t * 0.63);
    this.nodes[0].y = r * Math.sin(this.t * 1.5);

    //reset all the accelerations
    this.nodes.forEach( node => {
      node.ax = 0;
      node.ay = 0;
    });

    //for every spring, apply a force to the connected nodes
    this.springs.forEach( spring => {
      const n0 = this.nodes[spring.n0];
      const n1 = this.nodes[spring.n1];
      const dx = n0.x - n1.x;
      const dy = n0.y - n1.y;
      const l = Math.sqrt(dx * dx + dy * dy);
      const f = spring.k * (spring.l - l);
      const angle = Math.atan2(dy, dx);
      const fx = f * Math.cos(angle);
      const fy = f * Math.sin(angle);
      n0.ax += fx;
      n0.ay += fy;
      n1.ax -= fx;
      n1.ay -= fy;

    });

    //for every node, apply the acceleration & velocity
    const friction = 1;
    const gravity = 10;
    this.nodes.forEach( (node, i) => {
      if (node.fixed) {return;}

      node.vx += node.ax * dt - node.vx * friction;
      node.vy += node.ay * dt - node.vy * friction * dt + gravity * dt;
      node.x += node.vx * dt;
      node.y += node.vy * dt;

      //add some position limits since tails aren't really so springy
      const pn = this.nodes[i - 1];
      const dpnx = node.x - pn.x;
      const dpny = node.y - pn.y;
      const dp = Math.sqrt(dpnx * dpnx + dpny * dpny);
      const maxDist = 20;
      const minDist = 0.01;
      if (dp > maxDist) {
        const angle = Math.atan2(dpny, dpnx);
        node.x = pn.x + maxDist * Math.cos(angle);
        node.y = pn.y + maxDist * Math.sin(angle);
      }
      if (dp < minDist) {
        const angle = Math.atan2(dpny, dpnx);
        node.x = pn.x + minDist * Math.cos(angle);
        node.y = pn.y + minDist * Math.sin(angle);
      }
    });
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsl(0, 100%, 20%)';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width / 2, height / 2);

    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.nodes[0].x, this.nodes[0].y);
    this.nodes.forEach( (node, i) => {
      if (i === 0) {return;}
      ctx.strokeStyle = `hsl(0, 80%, ${this.lmap(i, 0, this.nodes.length-1, 50, 30)}%)`;
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(this.nodes[i-1].x, this.nodes[i-1].y);
      ctx.stroke();
    });

    const tailNode0 = this.nodes[this.nodes.length - 2];
    const tailNode1 = this.nodes[this.nodes.length - 1];
    const taildx = tailNode0.x - tailNode1.x;
    const taildy = tailNode0.y - tailNode1.y;
    const tailAngle = Math.atan2(taildy, taildx);
    ctx.save();
    ctx.translate(tailNode1.x, tailNode1.y);
    ctx.rotate(tailAngle);
    const tailGrad = ctx.createRadialGradient(-30, 0, 2, -30, 0, 40);
    tailGrad.addColorStop(0, 'hsl(0, 50%, 0%)');
    tailGrad.addColorStop(0.8, 'hsl(0, 100%, 50%)');
    ctx.fillStyle = tailGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 20);
    ctx.lineTo(-30, 0);
    ctx.lineTo(0, -20);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.restore();

    const headNode0 = this.nodes[0];
    const headNode1 = this.nodes[1];
    const headdx = headNode0.x - headNode1.x;
    const headdy = headNode0.y - headNode1.y;
    const headAngle = Math.atan2(headdy, headdx);


    ctx.translate(this.nodes[0].x, this.nodes[0].y);
    ctx.rotate(headAngle - Math.PI / 2);
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    //ctx.fillText('\ud83d\ude08', this.nodes[0].x, this.nodes[0].y);
    ctx.fillText('\ud83d\ude08', 0, 0);

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
