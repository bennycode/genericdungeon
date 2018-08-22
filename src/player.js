import { input, KEYS } from "./input";
import { hero } from "./sprite";
import { Entity } from "./entity";

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, hero, true);
    this.isMoving = false;
    this.variant = 0;
  }

  update(floorMap) {
    this.isMoving = false;
    const low = val => (val + 4) >> 4;
    const high = val => (val + 12) >> 4;
    const floorY1 = low(this.y + 3);
    const floorY2 = high(this.y + 3);
    const floorX1 = low(this.x);
    const floorX2 = high(this.x);
    if (input.isPressing(KEYS.LEFT)) {
      this.variant = 1;
      const x = low(this.x - 1);
      if (floorMap[x][floorY1] && floorMap[x][floorY2]) {
        this.x--;
        this.isMoving = true;
      }
    }
    if (input.isPressing(KEYS.RIGHT)) {
      this.variant = 2;
      const x = high(this.x + 1);
      if (floorMap[x][floorY1] && floorMap[x][floorY2]) {
        this.x++;
        this.isMoving = true;
      }
    }
    if (input.isPressing(KEYS.UP)) {
      this.variant = 3;
      const y = low(this.y - 1 + 3);
      if (floorMap[floorX1][y] && floorMap[floorX2][y]) {
        this.y--;
        this.isMoving = true;
      }
    }
    if (input.isPressing(KEYS.DOWN)) {
      this.variant = 0;
      const y = high(this.y + 1 + 3);
      if (floorMap[floorX1][y] && floorMap[floorX2][y]) {
        this.y++;
        this.isMoving = true;
      }
    }
    this.sprite.setVariant(this.isMoving ? this.variant + 4 : this.variant);
  }
}
