import { input, KEYS } from './input';
import { hero } from './sprite';
import { Entity } from './entity';

const sprite = {
  [KEYS.DOWN]: 0,
  [KEYS.LEFT]: 1,
  [KEYS.UP]: 3,
  [KEYS.RIGHT]: 2,
}

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, hero, true);
    this.direction = {
      [KEYS.DOWN]: true,
      [KEYS.LEFT]: false,
      [KEYS.UP]: false,
      [KEYS.RIGHT]: false,
    }
    this.isMoving = false;
    this.variant = 0;
  }

  update() {
    this.isMoving = false;
    Object.keys(sprite).forEach(key => {      
      if(input.isPressing(key)){
        this.isMoving = true;
        this.variant = sprite[key];
      }
    })
    this.sprite.setVariant(this.isMoving ? this.variant + 4: this.variant);
    if (input.isPressing(KEYS.LEFT)) {
      this.x--;
    }
    if (input.isPressing(KEYS.RIGHT)) {
      this.x++;
    }
    if (input.isPressing(KEYS.UP)) {
      this.y--;
    }
    if (input.isPressing(KEYS.DOWN)) {
      this.y++;
    }
  }
}