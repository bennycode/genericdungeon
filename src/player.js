import { input } from './input';
import { hero } from './sprite';
import { Entity } from './entity';
import { controlUI } from './controlui';

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, hero, true);
    this.paddingTop = 7 / 16;
    this.paddingBottom = 1 / 16;
    this.baseVariant = 0;
  }

  update(floorMap) {
    const screenInput = controlUI.poll();
    let x = 0;
    let y = 0;

    if (screenInput) {
      x = screenInput.x;
      y = screenInput.y;
      this.baseVariant = screenInput.direction;
    }

    if (input.up) {
      this.baseVariant = 0;
      y = -1;
    }
    if (input.right) {
      this.baseVariant = 1;
      x = 1;
    }
    if (input.down) {
      this.baseVariant = 2;
      y = 1;
    }
    if (input.left) {
      this.baseVariant = 3;
      x = -1;
    }

    const isMoving = x || y;
    if (isMoving) this.move(x, y, floorMap);

    this.variant = isMoving ? this.baseVariant + 4 : this.baseVariant;
  }
}
