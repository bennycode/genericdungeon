import { Layout } from './layout';
import { Player } from './player';
import { Slime } from './slime';
import { Skeleton } from './skeleton';
import { floor, wall, start, exit, door, torch, electric } from './sprite';
import { rand, randFromArray } from './util';
import { timer } from './timer';

const spriteSize = 16;

export class Scene {
  constructor(ctx, roomCount) {
    this.ctx = ctx;
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
    this.offsetX = 0;
    this.offsetY = 0;
    this.halfWidth = Math.floor(this.width / 2);
    this.halfHeight = Math.floor(this.height / 2);
    this.layout = new Layout(roomCount);
    this.player = new Player(
      this.layout.startPos.x,
      this.layout.startPos.y + 1,
    );
    this.bgCanvas = document.createElement('canvas');
    this.updateBgCanvas();
    this.fogCanvas = document.createElement('canvas');
    this.fogCanvas.width = this.bgCanvas.width;
    this.fogCanvas.height = this.bgCanvas.height;
    const fogCtx = this.fogCanvas.getContext('2d');
    fogCtx.fillStyle = '#000';
    fogCtx.fillRect(0, 0, this.fogCanvas.width, this.fogCanvas.height);
    this.unveilFog(this.layout.startPos.x, this.layout.startPos.y);
    this.obstacleMap = this.updateObstacleMap(this.layout.doors);
    this.torches = this.placeTorches();
    this.enemies = this.placeEnemies(Slime, this.layout.rooms.length);
    this.enemies = this.enemies.concat(
      this.placeEnemies(Skeleton, this.layout.rooms.length),
    );
  }

  update() {
    this.player.update(this.layout.map, this.enemies);
    const x = Math.round(this.player.x);
    const y = Math.round(this.player.y);
    this.checkOpenDoors();
    this.enemies.forEach(enemy => enemy.update(x, y, this.obstacleMap));
    //this.layout.makeGoalPath({ x, y });
  }

  fadeFrom(color = '#000', speed = 0.01) {
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

  fadeTo(color = '#000', speed = 0.01) {
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
        room => !torchRooms.includes(room),
      );
      torchRooms.push(randFromArray(rooms));
    }
    torchRooms.forEach(({ x, y, x2, y2 }) => {
      torches.push(
        { x: x + 1, y: y + 1 },
        { x: x + 1, y: y2 - 1 },
        { x: x2 - 1, y: y + 1 },
        { x: x2 - 1, y: y2 - 1 },
      );
    });
    return torches;
  }

  placeEnemies(enemy, count) {
    const enemies = [];
    const rooms = this.layout.getOtherRooms(this.layout.startRoom);
    while (enemies.length < count) {
      const { x, y, x2, y2 } = randFromArray(rooms);
      const enemyX = rand(x + 1, x2);
      const enemyY = rand(y + 1, y2);
      enemies.push(new enemy(enemyX, enemyY, this.obstacleMap));
    }
    return enemies;
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
        this.obstacleMap = this.updateObstacleMap(this.layout.doors);
      }
    }
  }

  updateObstacleMap(obstacles) {
    const isObstacle = (mapX, mapY) =>
      obstacles.some(({ x, y }) => x === mapX && y === mapY);
    const obstacleMap = this.layout.map.map((col, x) =>
      col.map((isFloor, y) => isFloor && !isObstacle(x, y)),
    );
    return obstacleMap;
  }

  unveilFog(x, y) {
    const room = this.layout.getRoomAtPosition(x, y);
    if (room) {
      const fogCtx = this.fogCanvas.getContext('2d');
      const [x, y] = [room.x * spriteSize, room.y * spriteSize];
      const [w, h] = [(room.w + 1) * spriteSize, (room.h + 1) * spriteSize];
      fogCtx.clearRect(x, y, w, h);
    }
  }

  updateBgCanvas() {
    const { width, height } = this.layout.mapSize;
    this.bgCanvas.width = width;
    this.bgCanvas.height = height;
    const ctx = this.bgCanvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    const map = this.layout.map;
    map.forEach((col, x) =>
      col.forEach((isFloor, y) => {
        if (isFloor) {
          floor.draw(ctx, x, y);
          [[x, y - 1], [x + 1, y], [x, y + 1], [x - 1, y]].forEach(
            ([xx, yy], variant) => {
              if (!map[xx][yy]) {
                wall.setVariant(variant);
                wall.draw(ctx, x, y);
              }
            },
          );
        }
      }),
    );
  }

  drawMap() {
    this.ctx.drawImage(
      this.bgCanvas,
      this.offsetX,
      this.offsetY,
      this.width,
      this.height,
      this.offsetX,
      this.offsetY,
      this.width,
      this.height,
    );
    this.layout.doors.forEach(({ x, y }) => door.draw(this.ctx, x, y));
    start.draw(this.ctx, this.layout.startPos.x, this.layout.startPos.y);
    exit.draw(this.ctx, this.layout.endPos.x, this.layout.endPos.y);
    this.torches.forEach(({ x, y }) => torch.draw(this.ctx, x, y));
  }

  isInViewport(entity) {
    const lowX = this.offsetX;
    const highX = this.offsetX + this.width;
    const lowY = this.offsetY;
    const highY = this.offsetY + this.height;
    const eX1 = entity.screenX;
    const eY1 = entity.screenY;
    const eX2 = eX1 + entity.width;
    const eY2 = eY1 + entity.height;

    return eX2 > lowX && eY2 > lowY && eX1 < highX && eY1 < highY;
  }

  draw() {
    this.offsetX = this.player.screenX - this.halfWidth + 8;
    this.offsetY = this.player.screenY - this.halfHeight + 8;
    this.ctx.setTransform(1, 0, 0, 1, -this.offsetX, -this.offsetY);
    this.drawMap();
    //this.layout.goalPath.forEach(({ x, y }) => electric.draw(this.ctx, x, y));
    const visibleEnemies = this.enemies
      .filter(this.isInViewport.bind(this))
      .sort((a, b) => a.y - b.y);
    const firstEnemyinFront = visibleEnemies.find(({ y }) => y > this.player.y);
    const frontIndex = visibleEnemies.indexOf(firstEnemyinFront);
    visibleEnemies.slice(0, frontIndex).forEach(enemy => enemy.draw(this.ctx));
    this.player.draw(this.ctx);
    visibleEnemies.slice(frontIndex).forEach(enemy => enemy.draw(this.ctx));

    this.ctx.drawImage(
      this.fogCanvas,
      this.offsetX,
      this.offsetY,
      this.width,
      this.height,
      this.offsetX,
      this.offsetY,
      this.width,
      this.height,
    );
    if (this.fade) {
      this.ctx.fillStyle = this.fadeColor;
      this.ctx.globalAlpha = this.fade;
      this.ctx.fillRect(this.offsetX, this.offsetY, this.width, this.height);
      this.ctx.globalAlpha = 1;
    }
  }
}
