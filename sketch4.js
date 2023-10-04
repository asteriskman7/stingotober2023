'use strict';

window.sketchClass = class extends Sketch {
  desc = 'Laying on a bed of nails works because you distrubute your weight amongst all of the pins.<br>Doing the same thing, one nail at a time, is not recommended.';

  constructor() {
    super();

    //create skin nodes
    const nodes = [];

    nodes.push({x: -256, y: 0, vx: 0, vy: 0, fixed: true});
    
    const nodeCount = 40;
    const nodeDist = this.canvas.width / (nodeCount + 1);
    for (let i = -Math.floor(nodeCount / 2); i <= Math.floor(nodeCount / 2); i++) {
      nodes.push({x: nodeDist * i, y: 0, vx: 0, vy: 0});
    }
    nodes.push({x: 256, y: 0, vx: 0, vy: 0, fixed: true});

    //create skin springs between each node pair
    const springs = [];

    for (let i = 0; i < nodes.length-1; i++) {
      springs.push({l: nodeDist * 0.5, k: 100, n0: i, n1: i + 1});
    }

    this.pins = [];
    this.blood = [];
    this.nextPin = 0;

    this.nodes = nodes;
    this.springs = springs;
  }


  update() {
    const dt = 1/30;

    //spawn pins
    if (this.t >= this.nextPin) {
      this.pins.push(
        {
          x: this.lmap(Math.random(), 0, 1, -this.canvas.width / 2 + 30, this.canvas.width / 2 - 30),
          y: -this.canvas.width / 2
        }
      );
      this.nextPin = this.t + 1 + 1 * Math.random();
    }

    //pin movement
    this.pins.forEach( pin => {
      pin.y += 2;
    });

    this.pins = this.pins.filter( pin => pin.y < this.canvas.height);

    //blood movement + gravity
    this.blood.forEach( b => {
      b.vy += 1;
      b.x += b.vx;
      b.y += b.vy;
    });

    this.blood = this.blood.filter( b => b.y < this.canvas.height);

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
    const friction = 0.1;
    const pinForce = 500;
    this.nodes.forEach( node => {
      if (node.fixed) {return;}

      this.pins.forEach( pin => {
        if (pin.y > -30) {
          const pdx = pin.x - node.x;
          const pdy = pin.y - node.y;
          const pinDist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pinDist < 20) {
            const angle = -Math.atan2(pdy, pdx);
            node.ax += pinForce* Math.cos(angle);
            node.ay += pinForce * Math.sin(angle);
            //generate blood while pin force is being applied
            this.blood.push(
              {
                x: pin.x + this.lmap(Math.random(), 0, 1, -10, 10),
                y: pin.y + this.lmap(Math.random(), 0, 1, -10, 10),
                vx: this.lmap(Math.random(), 0, 1, -5, 5),
                vy: this.lmap(Math.random(), 0, 1, -10, -10),
                r: this.lmap(Math.random(), 0, 1, 3, 8),
                l: this.lmap(Math.random(), 0, 1, 30, 50)
              }
            );
          }
        }
      });

      node.vx += node.ax * dt - node.vx * friction;
      node.vy += node.ay * dt - node.vy * friction;
      node.x += node.vx * dt;
      node.y += node.vy * dt;
    });
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsl(203, 100%, 65%)';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width / 2, height / 2);

    ctx.fillStyle = 'black';
    const pinw = 5;
    this.pins.forEach( pin => {
      ctx.beginPath();
      ctx.moveTo(pin.x, pin.y + 20);
      ctx.lineTo(pin.x - pinw, pin.y - 10);
      ctx.lineTo(pin.x + pinw, pin.y - 10);
      ctx.lineTo(pin.x, pin.y + 20);
      ctx.fill();
    });

    ctx.fillStyle = 'hsl(45, 100%, 31%)';
    this.nodes.forEach( (node, i) => {
      if (i === this.nodes.length - 1) {return;}
      ctx.beginPath();
      ctx.moveTo(node.x - 1, node.y);
      ctx.lineTo(this.nodes[i+1].x, this.nodes[i+1].y);
      ctx.lineTo(this.nodes[i+1].x, width/2);
      ctx.lineTo(node.x - 1, width/2);
      ctx.lineTo(node.x - 1, node.y);
      ctx.fill();
    });

    //ctx.fillStyle = 'red';
    this.blood.forEach( b => {
      ctx.fillStyle = `hsl(0, 80%, ${b.l}%)`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
      ctx.fill();
    });

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
