import { Scene } from "./scene";
import { timer } from "./timer";
import { onload } from "./sprite";

const vw = 640;
const vh = 480;
const scale = 4;

const floor = document.getElementById("floor");
const floorCtx = floor.getContext("2d");
floor.width = vw / scale;
floor.height = vh / scale;
floor.style.width = vw;
floor.style.height = vh;

onload(run);

function run() {
  const scene = new Scene(floorCtx, 30);
  scene.fadeFrom();
  timer.on(() => {
    scene.update();
    scene.draw();
  });
}
