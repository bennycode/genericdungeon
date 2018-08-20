export class Rect {

  static fromRects(rects) {
    const { x, y, x2, y2 } = rects.reduce((curr, rect) => ({
      x: rect.x < curr.x ? rect.x : curr.x,
      y: rect.y < curr.y ? rect.y : curr.y,
      x2: rect.x2 > curr.x2 ? rect.x2 : curr.x2,
      y2: rect.y2 > curr.y2 ? rect.y2 : curr.y2,
    }), { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity });
    return new Rect(x, y, x2 - x, y2 - y)
  }

  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  get x2() {
    return this.x + this.w;
  }

  get y2() {
    return this.y + this.h;
  }

  set x2(x2) {
    this.w = x2 - this.x;
  }

  set y2(y2) {
    this.h = y2 - this.y;
  }

  getCenter(isFloored = false) {
    const x = this.x + this.w / 2;
    const y = this.y + this.h / 2;
    return isFloored ? {
      x: Math.floor(x),
      y: Math.floor(y)
    } : { x, y }
  }

  getCenterDist(rect) {
    const center = this.getCenter();
    const oCenter = rect.getCenter();
    const distX = center.x - oCenter.x;
    const distY = center.y - oCenter.y;
    return Math.sqrt(distX ** 2 + distY ** 2);
  }

  getOverlap(rect) {
    const x1 = Math.max(this.x, rect.x);
    const x2 = Math.min(this.x2, rect.x2);
    const w = x2 - x1;
    const y1 = Math.max(this.y, rect.y);
    const y2 = Math.min(this.y2, rect.y2);
    const h = y2 - y1;
    if (w < 0 || h < 0) {
      return null;
    }
    return new Rect(x1, y1, w, h);
  }
}