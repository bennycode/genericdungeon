export class Entity {
  constructor(x, y, sprite, isSolid, speed = 1 / 16) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.isSolid = isSolid;
    this.speed = speed;
    this.width = 16;
    this.height = 16;
    this.paddingTop = 1 / 4;
    this.paddingLeft = 1 / 4;
    this.paddingBottom = 1 / 4;
    this.paddingRight = 1 / 4;
    this.variant = 0;
  }

  get screenX() {
    return ~~(this.x * 16);
  }

  get screenY() {
    return ~~(this.y * 16);
  }

  get collisionBox() {
    return {
      x1: this.x + this.paddingLeft,
      x2: this.x + 1 - this.paddingRight,
      y1: this.y + this.paddingTop,
      y2: this.y + 1 - this.paddingBottom,
    };
  }

  isIn(box) {
    const { x1, x2, y1, y2 } = this.collisionBox;
    return x1 < box.x2 && x2 > box.x1 && y1 < box.y2 && y2 > box.y1;
  }

  move(x, y, floorMap) {
    const c = Math.sqrt(x * x + y * y);
    const unitX = x / c;
    const unitY = y / c;

    if (!floorMap) {
      this.x += unitX * this.speed;
      this.y += unitY * this.speed;
      return;
    }
    const lowX = (val = this.x) => ~~(val + this.paddingLeft);
    const highX = (val = this.x) => ~~(val + 1 - this.paddingRight);
    const lowY = (val = this.y) => ~~(val + this.paddingTop);
    const highY = (val = this.y) => ~~(val + 1 - this.paddingBottom);

    if (unitX) {
      const newX = this.x + unitX * this.speed;
      const tileX = unitX < 0 ? lowX(newX) : highX(newX);
      if (floorMap[tileX][lowY()] && floorMap[tileX][highY()]) {
        this.x = newX;
      }
    }
    if (unitY) {
      const newY = this.y + unitY * this.speed;
      const tileY = unitY < 0 ? lowY(newY) : highY(newY);
      if (floorMap[lowX()][tileY] && floorMap[highX()][tileY]) {
        this.y = newY;
      }
    }
  }

  draw(ctx) {
    this.sprite.setVariant(this.variant);
    this.sprite.draw(ctx, this.x, this.y);
  }
}
