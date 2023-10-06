'use strict';

window.sketchClass = class extends Sketch {
  desc = 'Be careful that you don\'t put up such a strong shield<br>that it keeps even the good things out.';

  draw(ctx, width, height, t) {
    //draw sky
    const skyGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 60);
    skyGrad.addColorStop(0, 'hsl(0, 0%, 70%)');
    skyGrad.addColorStop(1, 'hsl(217, 50%, 16%)');
 
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    //draw grass
    const grassGrad = ctx.createLinearGradient(0, 400, 0, height);
    grassGrad.addColorStop(0, 'hsl(120, 50%, 16%)');
    grassGrad.addColorStop(1, 'hsl(120, 50%, 4%)');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, 400, width, height - 400);

    //draw character (dancer/caster)
    ctx.translate(width / 2, 400);
    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('\ud83d\udd7a', 0, 0);

    const shieldR = 100;
    const segCount = 100;
    const angleSize = Math.PI / segCount;

    const ghostChar = '\ud83d\udc7b';
    const bfChar = '\ud83e\udd8b';
    ctx.font = '40px Arial';
    ctx.textBaseline = 'middle';

    //draw ghosts
    const ghostCount = 6;
    const ghostAngleSize = Math.PI / ghostCount;
    const ghostPos = [];
    for (let i = 0; i < ghostCount; i++) {
      const r = 2 * shieldR + (shieldR * 0.8) * Math.sin(t * (this.lmap(this.rnd(i * 423), 0, 1, 0.9, 1.3)) + i * 435);
      const angle = this.lmap(i, 0, ghostCount - 1, Math.PI + ghostAngleSize / 2 , 2 * Math.PI - ghostAngleSize / 2);
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle) - 80;

      ctx.fillText(i === 0 ? bfChar : ghostChar, x, y);
      //save position for distance calc
      ghostPos.push({x, y});
    }

    //draw shield segments
    for (let i = 0; i < segCount; i++) {
      //segment start and end angle
      const a0 = Math.PI + i * angleSize - angleSize * 0.4;
      const a1 = a0 + angleSize + angleSize * 0.4;

      //get segment position before deformation
      const xbase = shieldR * Math.cos(a0);
      const ybase = shieldR * Math.sin(a0) - 80;
      
      //get closest ghost distance
      let minGhostD = Infinity;
      ghostPos.forEach( g => {
        const dx = xbase - g.x;
        const dy = ybase - g.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        minGhostD = Math.min(minGhostD, d);
      });

      //set effective shield radius and shake amount
      let esr = shieldR;
      let shake = 0;
      if (minGhostD < 50) {
        esr = this.lmap(minGhostD, 50, 0, shieldR,  shieldR * 0.8); 
        shake = this.lmap(minGhostD, 0, 50, 20, 0);
      }

      //get segment start/end coords
      const x0 = esr * Math.cos(a0);
      const y0 = esr * Math.sin(a0) - 80;
      const x1 = esr * Math.cos(a1);
      const y1 = esr * Math.sin(a1) - 80;

      //draw segment and blur/glow
      const blurCount = 3;
      ctx.shadowColor = 'red';
      ctx.shadowBlur = 15;
      for (let j = 0; j < blurCount; j++) {
        const a = j < (blurCount - 1) ? 0.1 : 1.0;
        const wf = this.lmap(j, 0, blurCount - 1, 3, 1);
        ctx.strokeStyle = `hsla(289, 67%, ${this.lmap(minGhostD, 0, 2.0 * shieldR, 9, 100)}%, ${a})`;
        ctx.lineWidth = this.lmap(minGhostD, 0, 2.8 * shieldR, 1, 30) * wf;
        ctx.beginPath();
        ctx.moveTo(x0 + shake * Math.random(), y0 + shake * Math.random());
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
    }
  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
