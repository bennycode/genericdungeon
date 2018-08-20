import { Layout } from './layout';
import { input, KEYS } from './input';
import { Entity } from './entity';
import { Sprite } from './sprite';

// import { timer } from './timer';

setTimeout(run, 100);

const vw = 640;
const vh = 480;
const scale = 4;

function run() {
  const floor = document.getElementById('floor');
  const floorCtx = floor.getContext('2d');
  const roomCount = 30;
  console.time('creation');
  const layout = new Layout(30);
  console.timeEnd('creation');
  const layoutSize = layout.getMapSize();
  floor.width = vw / scale;
  floor.height = vh / scale;
  floor.style.width = vw;
  floor.style.height = vh;
  floor.style.backgroundImage = `url(${layout.baseCanvas.toDataURL()})`;
  floor.style.backgroundSize = `${layoutSize.width * scale}px ${layoutSize.height * scale}px `;
  const player = new Sprite();

  let cx = layout.startPos.x * 16;
  let cy = layout.startPos.y * 16;
  function drawLoop(time) {
    requestAnimationFrame(drawLoop);
    if (input.isPressing(KEYS.LEFT)) cx--;
    if (input.isPressing(KEYS.RIGHT)) cx++;
    if (input.isPressing(KEYS.UP)) cy--;
    if (input.isPressing(KEYS.DOWN)) cy++;

    const x = -(cx * scale) + vw / 2;
    const y = -(cy * scale) + vh / 2;
    floor.style.backgroundPositionX = `${x}px`;
    floor.style.backgroundPositionY = `${y}px`;
    player.draw(floorCtx, vw / scale / 2 - 8, vh / scale / 2 - 8);
  }
  drawLoop();
}

