import { Layout } from "./layout";
import { Player } from "./player";
import { Skeleton } from "./skeleton";
import { floor, wall, start, exit, door, torch } from "./sprite";
import { rand, randFromArray } from "./util";
import { timer } from "./timer";

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
      this.layout.startPos.x,
      this.layout.startPos.y + 1
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
    this.torches = this.placeTorches();
    this.skeletons = this.placeSkeletons(30);
  }

  update() {
    this.player.update(this.layout.map);
    this.checkOpenDoors();
    this.skeletons.forEach(skeleton => skeleton.update());
  }

  fadeFrom(color = "#000", speed = 0.01) {
    this.fadeColor = color;
    this.fade = 1;
    const fadeId = timer.on(() => {
      this.fade -= speed;
      if (this.fade < 0) {
        this.fade = 0;
        timer.off(fadeId);
      }
    });
  }

  fadeTo(color = "#000", speed = 0.01) {
    this.fadeColor = color;
    this.fade = speed;
    const fadeId = timer.on(() => {
      this.fade += speed;
      if (this.fade > 1) {
        this.fade = 1;
        timer.off(fadeId);
      }
    });
  }

  placeTorches() {
    const torches = [];
    const max = Math.floor(this.layout.rooms.length / 3);
    const torchRooms = [this.layout.startRoom, this.layout.endRoom];
    while (torchRooms.length < max) {
      const rooms = this.layout.rooms.filter(
        room => !torchRooms.includes(room)
      );
      torchRooms.push(randFromArray(rooms));
    }
    torchRooms.forEach(({ x, y, x2, y2 }) => {
      torches.push(
        { x: x + 1, y: y + 1 },
        { x: x + 1, y: y2 - 1 },
        { x: x2 - 1, y: y + 1 },
        { x: x2 - 1, y: y2 - 1 }
      );
    });
    return torches;
  }

  placeSkeletons(count) {
    const skeletons = [];
    while (skeletons.length < count) {
      const { x, y, x2, y2 } = randFromArray(this.layout.rooms);
      const skeletonX = rand(x + 1, x2);
      const skeletonY = rand(y + 1, y2);
      skeletons.push(new Skeleton(skeletonX, skeletonY, this.layout.map));
    }
    return skeletons;
  }

  checkOpenDoors() {
    const { x1, x2, y1, y2 } = this.player.collisionBox;
    const doors = this.layout.doors;
    for (let i = doors.length - 1; i >= 0; i--) {
      const { x: doorX, y: doorY } = doors[i];
      if (x2 > doorX && x1 < doorX + 1 && y2 > doorY && y1 < doorY + 1) {
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
      const [x, y] = [room.x * spriteSize, room.y * spriteSize];
      const [w, h] = [(room.w + 1) * spriteSize, (room.h + 1) * spriteSize];
      fogCtx.clearRect(x, y, w, h);
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
    const x = this.player.screenX - this.halfWidth + 8;
    const y = this.player.screenY - this.halfHeight + 8;
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
    this.torches.forEach(({ x, y }) =>
      torch.draw(this.ctx, x * spriteSize, y * spriteSize)
    );
    this.skeletons.forEach(skeleton => skeleton.draw(this.ctx));
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
    if (this.fade) {
      this.ctx.fillStyle = this.fadeColor;
      this.ctx.globalAlpha = this.fade;
      this.ctx.fillRect(x, y, this.width, this.height);
      this.ctx.globalAlpha = 1;
    }
  }
}
