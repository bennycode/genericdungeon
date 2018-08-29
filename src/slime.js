import { slime, deadSlime } from './sprite';
import { Entity } from './entity';
import { timer } from './timer';
import { rand } from './util';
import { Health } from './health';

export class Slime extends Entity {
  constructor(x, y, obstacleMap) {
    super(x, y, slime(), true, 1 / rand(32, 48));
    this.paddingTop = 7 / 16;
    this.paddingBottom = 1 / 16;
    this.baseVariant = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.findNewTarget(obstacleMap);
    this.health = new Health(20);
    this.health.onDeath = this.die.bind(this);
  }

  hit(power) {
    this.health.sub(power);
  }

  die() {
    this.sprite = deadSlime;
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
    this.targetId = timer.on(
      this.findNewTarget.bind(this, obstacleMap),
      rand(30, 60),
    );
  }

  update(playerX, playerY, obstacleMap) {
    if (!this.health.isAlive) {
      return;
    }
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
