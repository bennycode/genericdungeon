export class Entity {
  constructor(x, y, sprite, isSolid) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.isSolid = isSolid;
  }
  update() {

  }
  draw(ctx) {
    this.sprite.draw(ctx, this.x, this.y);
  }
}
