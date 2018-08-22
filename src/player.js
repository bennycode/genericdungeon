import { input } from "./input";
import { hero } from "./sprite";
import { Entity } from "./entity";

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, hero, true);
    this.isMoving = false;
    this.paddingTop = 7;
    this.paddingBottom = 1;
    this.baseVariant = 0;
  }

  update(floorMap) {
    let x = 0;
    let y = 0;

    if (input.left) {
      this.baseVariant = 1;
      x = -1;
    }
    if (input.right) {
      this.baseVariant = 2;
      x = 1;
    }
    if (input.up) {
      this.baseVariant = 3;
      y = -1;
    }
    if (input.down) {
      this.baseVariant = 0;
      y = 1;
    }

    this.move(x, y, floorMap);

    const isMoving = x || y;
    this.variant = isMoving ? this.baseVariant + 4 : this.baseVariant;
  }
}
