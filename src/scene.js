import { Layout } from "./layout";
import { Player } from "./player";
import { floor, wall, start, exit, door } from "./sprite";

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
    this.fogCanvas = document.createElement("canvas");
    this.fogCanvas.width = this.bgCanvas.width;
    this.fogCanvas.height = this.bgCanvas.height;
    const fogCtx = this.fogCanvas.getContext("2d");
    fogCtx.fillStyle = "#000";
    fogCtx.fillRect(0, 0, this.fogCanvas.width, this.fogCanvas.height);
    this.unveilFog(this.layout.startPos.x, this.layout.startPos.y);
  }

  update() {
    this.player.update(this.layout.map);
    this.checkOpenDoors();
  }

  checkOpenDoors() {
    const { x1, x2, y1, y2 } = this.player.collisionBox;
    const doors = this.layout.doors;
    for (let i = doors.length - 1; i >= 0; i--) {
      const { x: doorX, y: doorY } = doors[i];
      const [doorX1, doorY1] = [doorX * spriteSize, doorY * spriteSize];
      const [doorX2, doorY2] = [doorX1 + spriteSize, doorY1 + spriteSize];
      if (x2 > doorX1 && x1 < doorX2 && y2 > doorY1 && y1 < doorY2) {
        this.layout.doors.splice(i, 1);
        this.unveilFog(doorX - 1, doorY);
        this.unveilFog(doorX + 1, doorY);
        this.unveilFog(doorX, doorY - 1);
        this.unveilFog(doorX, doorY + 1);
      }
    }
  }

  unveilFog(x, y) {
    const room = this.layout.getRoomAtPosition(x, y);
    if (room) {
      const fogCtx = this.fogCanvas.getContext("2d");
      fogCtx.clearRect(
        room.x * spriteSize,
        room.y * spriteSize,
        (room.w + 1) * spriteSize,
        (room.h + 1) * spriteSize
      );
    }
  }

  updateBgCanvas() {
    const { width, height } = this.layout.mapSize;
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
    this.layout.doors.forEach(({ x, y }) =>
      door.draw(this.ctx, x * spriteSize, y * spriteSize)
    );
    start.draw(
      this.ctx,
      this.layout.startPos.x * spriteSize,
      this.layout.startPos.y * spriteSize
    );
    exit.draw(
      this.ctx,
      this.layout.endPos.x * spriteSize,
      this.layout.endPos.y * spriteSize
    );
    this.ctx.drawImage(
      this.fogCanvas,
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
