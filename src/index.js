import { Layout } from './layout';
import { input, KEYS } from './input';
import { Player } from './player';
import { Scene } from './scene';
import { timer } from './timer';

// import { timer } from './timer';

setTimeout(run, 1000);

const vw = 640;
const vh = 480;
const scale = 4;

const floor = document.getElementById('floor');
const floorCtx = floor.getContext('2d');
floor.width = vw / scale;
floor.height = vh / scale;
floor.style.width = vw;
floor.style.height = vh;

function run () {
  const scene = new Scene(floorCtx, 30);
  timer.on(()=>{
    scene.update();
    scene.draw()
  })
}

