import { skeleton } from "./sprite";
import { Entity } from "./entity";
import { timer } from "./timer";
import { rand } from "./util";

export class Skeleton extends Entity {
  constructor(x, y, floorMap) {
    super(x, y, skeleton(), true);
    this.floorMap = floorMap;
    this.paddingTop = 7 / 16;
    this.paddingBottom = 1 / 16;
    this.baseVariant = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.findNewTarget();
  }

  findNewTarget() {
    let newX = 0;
    let newY = 0;
    do {
      newX = Math.round(this.x) + rand(-4, 4);
      newY = Math.round(this.y) + rand(-4, 4);
    } while (!this.floorMap[newX] || !this.floorMap[newX][newY]);
    this.targetX = newX;
    this.targetY = newY;
    timer.off(this.targetId);
    this.targetId = timer.on(this.findNewTarget.bind(this), rand(30, 60));
  }

  update() {
    let x = 0;
    let y = 0;
    const roundedX = Math.round(this.x * 16) >> 4;
    const roundedY = Math.round(this.y * 16) >> 4;

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
      this.move(x, y, this.floorMap);
    } else {
      this.findNewTarget();
    }

    this.variant = isMoving ? this.baseVariant + 4 : this.baseVariant;
  }
}
