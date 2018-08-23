import { skeleton } from "./sprite";
import { Entity } from "./entity";
import { timer } from "./timer";
import { rand } from "./util";

export class Skeleton extends Entity {
  constructor(x, y, floorMap) {
    super(x, y, skeleton(), true);
    this.floorMap = floorMap;
    this.isMoving = false;
    this.paddingTop = 7;
    this.paddingBottom = 1;
    this.baseVariant = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.findNewTarget();
  }

  findNewTarget() {
    let newX = 0;
    let newY = 0;
    do {
      newX = (this.x >> 4) + rand(-4, 4);
      newY = (this.y >> 4) + rand(-4, 4);
    } while (!this.floorMap[newX] || !this.floorMap[newX][newY]);
    this.targetX = newX << 4;
    this.targetY = newY << 4;
    timer.off(this.targetId);
    this.targetId = timer.on(this.findNewTarget.bind(this), rand(30, 60));
  }

  update() {
    let x = 0;
    let y = 0;

    if (this.x > this.targetX) {
      this.baseVariant = 1;
      x = -1;
    }
    if (this.x < this.targetX) {
      this.baseVariant = 2;
      x = 1;
    }
    if (this.y > this.targetY) {
      this.baseVariant = 3;
      y = -1;
    }
    if (this.y < this.targetY) {
      this.baseVariant = 0;
      y = 1;
    }

    this.move(x, y, this.floorMap);

    const isMoving = x || y;
    this.variant = isMoving ? this.baseVariant + 4 : this.baseVariant;
    
    if (!x && !y) {
      this.findNewTarget();
    }
  }
}
