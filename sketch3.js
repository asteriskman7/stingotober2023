'use strict';

window.sketchClass = class extends Sketch {
  desc = "All the delicate things in the universe are built with rules that are ultimately<br>simple even if we don't understand them fully yet.";

  constructor() {
    super();
    const initialVal = 'x'.split``;
    const iterations = 6;
    //rule translated from https://paulbourke.net/fractals/lsys/
    const rules = {
      f: 'ff',
      x: 'f->>x<+x<+f>+fx<-x'
    };
    
    this.lastWind = [];
    //generate the expanded instructions once since it is relatively expensive
    this.L = this.expandLSystem(initialVal, rules, iterations);
  }

  draw(ctx, width, height, t) {
    //draw sky with sun
    const skyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 750);
    skyGrad.addColorStop(0, 'hsl(208, 49%, 90%)');
    skyGrad.addColorStop(0.2, 'hsl(208, 49%, 63%)');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    //draw water
    ctx.fillStyle = 'hsl(226, 94%, 62%)';
    ctx.fillRect(0, 440, width, 20);
    
    //draw boat
    ctx.font = '30px Arial';
    const boatx = this.lmap(((t + 120) / 60) % 10, 0, 10, -50, 550);
    const boaty = 455 + 2 *  Math.sin(t / 5);
    ctx.fillText('\u26f5', boatx, boaty);

    //draw plants
    const angle = 22.5;
    const unit = 2;
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.translate(width / 2 - 200 + i * 120, 200 + height / 2);
      this.drawLSystem(ctx, this.L, angle * Math.PI / 180, unit, t, i);
      ctx.restore();
    }


    //draw sand 'hill'
    const sandGrad = ctx.createLinearGradient(0, 455, 0, 512);
    sandGrad.addColorStop(0, 'hsl(65, 25%, 83%)');
    sandGrad.addColorStop(1, 'hsl(65, 25%, 43%)');
    ctx.fillStyle = sandGrad;
    ctx.fillRect(0, 455, width, 100);
  }

  expandLSystem(initialVal, rules, iterations) {
    let lastVal = [...initialVal];
    let nextVal = [];
    //apply the replacement rules once per iteration
    for (let i = 0; i < iterations; i++) {

      lastVal.forEach( token => {
        const replacement = rules[token];
        if (replacement) {
          nextVal = nextVal.concat(replacement.split``);
        } else {
          nextVal.push(token);
        }
      });

      lastVal = nextVal;
      nextVal = [];
    }
    return lastVal;
  }

  drawLSystem(ctx, L, deltaAngle, unit, t, ii) {
    //set initial angle pointing up
    let angle = -Math.PI/2;
    let x = 0;
    let y = 0;
    const stack = [];

    //create a low frequency wind that is the same for all plants and a high
    //frequency wind that is lower amplitude and unique for each plant
    let wind = 0.4 * this.fnoise(t + 143, [
      {a: 1, s: 1},
      {a: 0.01, s: 10} 
    ]) + 0.01 * this.fnoise(t + ii * 464, [
      {a: 0.01, s: 1},
      {a: 1, s: 10} 
    ]);
    //use a running average to smooth out the wind a little
    if (this.lastWind[ii]) {
      wind = (wind + this.lastWind[ii]) / 2;
    }
    this.lastWind[ii] = wind;

    //make the angle match the wind
    deltaAngle = this.lmap(wind, 0, 0.2, deltaAngle * 2 / 3, deltaAngle * 4 / 3);
    const baseda = deltaAngle;
    L.forEach( (instr, i) => {
      //use the stack size as a proxy for how far down the branch we are...not
      //perfect but good
      //implement the l system instructions
      switch (instr) {
        case 'f': {
          //only set stroke style if necessary because it is expensive
          ctx.strokeStyle = `hsl(56, 56%, ${this.lmap(stack.length, 0, 12, 80, 0)}%)`;
          ctx.beginPath();
          ctx.moveTo(x, y);
          //apply the wind to horizontal position and scaled by height
          x += unit * Math.cos(angle) + wind * (-y / 50);
          y += unit * Math.sin(angle);
          ctx.lineTo(x, y);
          ctx.stroke();
          break;
        }
        case 'b': {
          ctx.strokeStyle = `hsl(56, 56%, ${this.lmap(stack.length, 0, 12, 80, 0)}%)`;
          ctx.beginPath();
          ctx.moveTo(x, y);
          //apply the wind to horizontal position and scaled by height
          x -= unit * Math.cos(angle) + wind * (-y / 50);
          y -= unit * Math.sin(angle);
          ctx.lineTo(x, y);
          ctx.stroke();
          break;
        }
        case '+': {
          angle += deltaAngle;
          break;
        }
        case '-': {
          deltaAngle = baseda + Math.sin(t * 10 + i * 2452 + ii * 656) * wind * 0.1;
          angle -= deltaAngle;
          break;
        }
        case '>': {
          deltaAngle = baseda + Math.sin(t * 10 + i * 2452 + ii * 656) * wind * 0.1; 
          stack.push([angle, x, y]);
          break;
        }
        case '<': {
          [angle, x, y] = stack.pop();
          break;
        }
      }
    });
  }

}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
