import { skeleton } from "./sprite";
import { Entity } from "./entity";
import { timer } from "./timer";
import { rand } from "./util";

export class Skeleton extends Entity {
  constructor(x, y, obstacleMap) {
    super(x, y, skeleton(), true, 1 / rand(24, 32));
    this.paddingTop = 7 / 16;
    this.paddingBottom = 1 / 16;
    this.baseVariant = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.findNewTarget(obstacleMap);
  }

  findNewTarget(obstacleMap) {
    let newX = 0;
    let newY = 0;
    do {
      newX = Math.round(this.x) + rand(-4, 4);
      newY = Math.round(this.y) + rand(-4, 4);
    } while (!obstacleMap[newX] || !obstacleMap[newX][newY]);
    this.targetX = newX;
    this.targetY = newY;
    timer.off(this.targetId);
    this.targetId = timer.on(this.findNewTarget.bind(this), rand(30, 60));
  }

  update(playerX, playerY, obstacleMap) {
    let x = 0;
    let y = 0;
    const roundedX = Math.round(this.x * 16) >> 4;
    const roundedY = Math.round(this.y * 16) >> 4;

    const dX = Math.abs(roundedX - playerX);
    const dY = Math.abs(roundedY - playerY);

    if (dX < 4 && dY < 4) {
      this.targetX = playerX;
      this.targetY = playerY;
    }

    if (roundedX > this.targetX) {
      this.baseVariant = 1;
      x = -1;
    }
    if (roundedX < this.targetX) {
      this.baseVariant = 2;
      x = 1;
    }
    if (roundedY > this.targetY) {
      this.baseVariant = 3;
      y = -1;
    }
    if (roundedY < this.targetY) {
      this.baseVariant = 0;
      y = 1;
    }

    const isMoving = x || y;

    if (isMoving) {
      this.move(x, y, obstacleMap);
    } else {
      this.findNewTarget(obstacleMap);
    }

    this.variant = isMoving ? this.baseVariant + 4 : this.baseVariant;
  }
}
