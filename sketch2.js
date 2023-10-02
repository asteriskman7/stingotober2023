'use strict';

window.sketchClass = class extends Sketch {
  desc = 'If staring at a normal word quickly causes it to become unrecognizable,<br>are there some non-words that become recognizable upon continued viewing?';

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '120px Grandstander';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.translate(width / 2, 0);
    const blurSize = 20;
    ctx.shadowBlur = blurSize;
    
   
    ctx.fillStyle = 'red';
    const words = 'wolg,glow,ogwl,lwgo'.split`,`;
    words.forEach( (word, i) => {
      ctx.save();
      const l = Math.abs(Math.sin(t * (i - 1.5) * 1.1 + i * 53) * 100);
      ctx.shadowColor = `hsl(0, 100%, ${l}%)`;
      const angle = 0.1 * Math.sin(t * 2 + i * 23);
      ctx.translate(0, 80 + 100 * i);
      ctx.rotate(angle);
      ctx.filter = `blur(${2*l/100}px)`;
      ctx.fillText(word, 0, 0);
      ctx.restore();
    });

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
