import { Layout } from "./layout";
import { Player } from "./player";
import { floor, wall } from "./sprite";

const spriteSize = 16;

export class Scene {
  constructor(ctx, roomCount) {
    this.ctx = ctx;
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
    this.halfWidth = Math.floor(this.width / 2);
    this.halfHeight = Math.floor(this.height / 2);
    this.layout = new Layout(roomCount);
    this.player = new Player(
      this.layout.startPos.x * spriteSize,
      this.layout.startPos.y * spriteSize
    );
    this.bgCanvas = document.createElement("canvas");
    this.updateBgCanvas();
  }

  update() {
    this.player.update(this.layout.map);
  }

  updateBgCanvas() {
    const { width, height } = this.layout.getMapSize();
    this.bgCanvas.width = width;
    this.bgCanvas.height = height;
    const ctx = this.bgCanvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    const map = this.layout.map;
    map.forEach((col, x) =>
      col.forEach((isFloor, y) => {
        if (isFloor) {
          floor.draw(ctx, x * spriteSize, y * spriteSize);
          [[x, y - 1], [x + 1, y], [x, y + 1], [x - 1, y]].forEach(
            ([xx, yy], variant) => {
              if (!map[xx][yy]) {
                wall.setVariant(variant);
                wall.draw(ctx, x * spriteSize, y * spriteSize);
              }
            }
          );
        }
      })
    );
  }

  draw() {
    const x = this.player.x - this.halfWidth;
    const y = this.player.y - this.halfHeight;
    this.ctx.setTransform(1, 0, 0, 1, -x, -y);
    this.ctx.drawImage(
      this.bgCanvas,
      x,
      y,
      this.width,
      this.height,
      x,
      y,
      this.width,
      this.height
    );
    this.player.draw(this.ctx);
  }
}
