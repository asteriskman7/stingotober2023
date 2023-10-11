'use strict';

window.sketchClass = class extends Sketch {
  desc = "-"; // jshint ignore:line

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '20px Grandstander';
    ctx.fillStyle = 'white';
    ctx.fillText('Please select a sketch from the list above', 10, 30);

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
