import { input } from './input';
import { hero, attack } from './sprite';
import { Entity } from './entity';
import { controlUI } from './controlui';
import { timer } from './timer';

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, hero, true);
    this.paddingTop = 7 / 16;
    this.paddingBottom = 1 / 16;
    this.direction = 0;
    this.isAttacking = false;
    this.attackSprite = attack;
  }

  update(floorMap, enemies) {
    const screenInput = controlUI.poll();
    let x = 0;
    let y = 0;

    if (screenInput.isTouching) {
      x = screenInput.x;
      y = screenInput.y;
      this.direction = screenInput.direction;
    }

    if (input.up) {
      this.direction = 0;
      y = -1;
    }
    if (input.right) {
      this.direction = 1;
      x = 1;
    }
    if (input.down) {
      this.direction = 2;
      y = 1;
    }
    if (input.left) {
      this.direction = 3;
      x = -1;
    }

    if (input.attack || screenInput.isAttacking) {
      this.attack(enemies);
    }

    const isMoving = x || y;
    if (isMoving) this.move(x, y, floorMap);

    this.variant = isMoving ? this.direction + 4 : this.direction;
  }

  draw(ctx) {
    super.draw(ctx);
    if (this.isAttacking) {
      this.attackSprite.setVariant(this.direction);
      switch (this.direction) {
        case 0:
          this.attackSprite.draw(ctx, this.x - 0.5, this.y - 0.5);
          break;
        case 1:
          this.attackSprite.draw(ctx, this.x + 0.5, this.y - 0.5);
          break;
        case 2:
          this.attackSprite.draw(ctx, this.x - 0.5, this.y + 0.5);
          break;
        case 3:
          this.attackSprite.draw(ctx, this.x - 0.5, this.y - 0.5);
      }
    }
  }

  attack(enemies) {
    timer.off(this.attackTimer);
    this.isAttacking = true;
    this.attackSprite.setVariant(0);
    this.attackSprite.onLoopEnd = () => (this.isAttacking = false);

    let attackBox;
    switch (this.direction) {
      case 0:
        attackBox = {
          x1: this.x - 0.5,
          y1: this.y - 0.5,
          x2: this.x + 1.5,
          y2: this.y + 0.5,
        };
        break;
      case 1:
        attackBox = {
          x1: this.x + 0.5,
          y1: this.y - 0.5,
          x2: this.x + 1.5,
          y2: this.y + 1.5,
        };
        break;
      case 2:
        attackBox = {
          x1: this.x - 0.5,
          y1: this.y + 0.5,
          x2: this.x + 1.5,
          y2: this.y + 1.5,
        };
        break;
      case 3:
        attackBox = {
          x1: this.x - 0.5,
          y1: this.y - 0.5,
          x2: this.x + 0.5,
          y2: this.y + 1.5,
        };
    }
    enemies.forEach(enemy => {
      if (enemy.isIn(attackBox)) {
        enemy.hit(10);
      }
    });
  }
}
