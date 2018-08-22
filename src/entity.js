export class Entity {
  constructor(x, y, sprite, isSolid, speed = 1) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.isSolid = isSolid;
    this.speed = speed;
    this.width = 16;
    this.height = 16;
    this.paddingTop = 4;
    this.paddingLeft = 4;
    this.paddingBottom = 4;
    this.paddingRight = 4;
    this.variant = 0;
  }

  get collisionBox() {
    return {
      x1: this.x + this.paddingLeft,
      x2: this.x + this.width - this.paddingRight,
      y1: this.y + this.paddingTop,
      y2: this.y + this.height - this.paddingBottom
    };
  }

  move(x, y, floorMap) {
    if (!floorMap) {
      this.x += x * this.speed;
      this.y += y * this.speed;
      return;
    }
    const lowX = (val = this.x) => ~~((val + this.paddingLeft) / this.width);
    const highX = (val = this.x) =>
      ~~((val + this.width - this.paddingRight) / this.width);
    const lowY = (val = this.y) => ~~((val + this.paddingTop) / this.height);
    const highY = (val = this.y) =>
      ~~((val + this.height - this.paddingBottom) / this.height);
    if (x) {
      const newX = this.x + x * this.speed;
      const tileX = x < 1 ? lowX(newX) : highX(newX);
      if (floorMap[tileX][lowY()] && floorMap[tileX][highY()]) {
        this.x = newX;
      }
    }
    if (y) {
      const newY = this.y + y * this.speed;
      const tileY = y < 1 ? lowY(newY) : highY(newY);
      if (floorMap[lowX()][tileY] && floorMap[highX()][tileY]) {
        this.y = newY;
      }
    }
  }

  draw(ctx) {
    this.sprite.setVariant(this.variant);
    this.sprite.draw(ctx, ~~this.x, ~~this.y);
  }
}
