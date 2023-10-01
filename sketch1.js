'use strict';

window.sketchClass = class extends Sketch {
  desc = 'Not all paths should be explored.';

  draw(ctx, width, height, t) {
    //draw background color
    const bgc = 'hsl(270, 43%, 21%)';
    ctx.fillStyle = bgc;
    ctx.fillRect(0, 0, width, height);

    const rooty = height * 2 / 3;
    const rows = 100;
    const rowHeight = (height - rooty) / (rows - 5);
    for (let i = 0; i < rows; i++) {
      const basey = rooty + i * rowHeight;
      ctx.save();
      const xoffset = 10 * Math.sin(i / 10);
      ctx.translate(width / 2 + xoffset, basey);


      //draw ground
      ctx.fillStyle = 'hsl(54, 43%, 64%)';
      ctx.fillRect(-width, 0, width * 2, height);

      //draw path
      ctx.fillStyle = 'yellow';
      const pathWidth = 20 + i*3;
      ctx.fillRect(-pathWidth / 2, 0, pathWidth, rowHeight);


      for (let side = -1; side <= 1; side += 2) {
        //draw trees
        const treeSpace = pathWidth / 4;
        const treeCount = (width/2 - pathWidth / 2) / treeSpace;
        const treeDelta = treeSpace;

        for (let ti = 0; ti < treeCount; ti++) {
          const trunkh = 65 + 20 * Math.sin(i * 34534 + ti * 2345 + side * 2342);
          const trunks = 43 + 20 * Math.sin(i * 23452 + ti * 8754 + side * 6543);
          const trunkl = 25 + 10 * Math.sin(i * 54334 + ti * 4533 + side * 5423);
          const trunkc = `hsl(${trunkh}, ${trunks}%, ${trunkl}%)`;

          const treeBasex = pathWidth / 2 + ti * treeDelta + 
            Math.sin(i * 2452 + ti * 2345 + side * 23452) * treeDelta * 0.3 + treeDelta * 0.3;
          const treeHeight = pathWidth * 5;

          ctx.strokeStyle = trunkc;
          ctx.lineWidth = pathWidth / 30;
          ctx.beginPath();
          ctx.moveTo(side * treeBasex, 0);
          ctx.lineTo(side * treeBasex, -treeHeight);
          ctx.stroke();

          //branches
          const branchCount = 10;
          ctx.lineWidth = pathWidth / 40;
          for (let bi = 0; bi < branchCount; bi++) {
            const branchy0 = -treeHeight * 0.1 - (treeHeight * 0.8) *
              bi / branchCount;
            const branchy1 = branchy0 - Math.abs(Math.sin(i * 234 + ti * 56453 + bi * 5423 + side * 5348) * 
              treeHeight * 0.1);
            const branchx = ((bi % 2 === 0) ? 1 : -1) * treeHeight * 0.1;
            ctx.beginPath();
            ctx.moveTo(side * treeBasex, branchy0);
            ctx.lineTo(side * (treeBasex + branchx), branchy1);
            ctx.stroke();
          }
        }
      }

      ctx.restore();
      ctx.save();
      //draw glow
      ctx.translate(width / 2, rooty);
      ctx.globalCompositeOperation = 'lighter';
      const glowc = 'hsla(274, 28%, 25%, 0.09)';
      const centerx = 0.2 * pathWidth * Math.sin(t * 3 + i * 7541);
      const centery = 0.2 * pathWidth * Math.sin(t * 7 + i * 2490); 
      ctx.fillStyle = glowc;
      ctx.beginPath();
      ctx.arc(centerx, centery, pathWidth * 0.2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = 'hsla(0, 0%, 0%, 0.02)';
      ctx.fillRect(0, 0, width, height);
    }

  }
}

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
