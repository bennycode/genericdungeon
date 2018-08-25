import { characters, things, tileset } from "./images";
import { timer } from "./timer";

const loadImage = src => Object.assign(new Image(), { src });

const sheets = {
  characters: loadImage(characters),
  things: loadImage(things),
  tiles: loadImage(tileset)
};

export const onload = callback => {
  const loadCount = Object.keys(sheets).length;
  let loaded = 0;
  const loadSheet = () => {
    if (++loaded >= loadCount) {
      callback();
    }
  };
  Object.values(sheets).forEach(sheet => {
    if (sheet.complete) {
      loadSheet();
    }
    sheet.onload = loadSheet;
  });
};

const size = 16;

export class Sprite {
  constructor(sheet, variants) {
    this.sheet = sheet;
    this.variants = variants;
    this.timerId = "";
    this.setVariant(0);
  }
  setVariant(num) {
    if (num === this.variant) return;
    timer.off(this.timerId);
    this.variant = num;
    const { tile, speed } = this.variants[num];
    this.isAnimated = !!speed;
    if (this.isAnimated) {
      let index = 0;
      this.timerId = timer.on(() => {
        index = ++index % tile.length;
        this.frame = tile[index];
      }, speed);
      this.frame = tile[index];
    } else {
      this.frame = tile;
    }
  }
  draw(ctx, x, y) {
    const sheet = sheets[this.sheet];
    const [px, py] = this.frame;
    ctx.drawImage(
      sheet,
      px * size,
      py * size,
      size,
      size,
      ~~(x * size),
      ~~(y * size),
      size,
      size
    );
  }
}

export const hero = new Sprite("characters", [
  { tile: [7, 0] },
  { tile: [7, 1] },
  { tile: [7, 2] },
  { tile: [7, 3] },
  {
    speed: 6,
    tile: [[6, 0], [7, 0], [8, 0], [7, 0]]
  },
  {
    speed: 6,
    tile: [[6, 1], [7, 1], [8, 1], [7, 1]]
  },
  {
    speed: 6,
    tile: [[6, 2], [7, 2], [8, 2], [7, 2]]
  },
  {
    speed: 6,
    tile: [[6, 3], [7, 3], [8, 3], [7, 3]]
  }
]);

export const skeleton = () =>
  new Sprite("characters", [
    { tile: [10, 0] },
    { tile: [10, 1] },
    { tile: [10, 2] },
    { tile: [10, 3] },
    {
      speed: 6,
      tile: [[9, 0], [10, 0], [11, 0], [10, 0]]
    },
    {
      speed: 6,
      tile: [[9, 1], [10, 1], [11, 1], [10, 1]]
    },
    {
      speed: 6,
      tile: [[9, 2], [10, 2], [11, 2], [10, 2]]
    },
    {
      speed: 6,
      tile: [[9, 3], [10, 3], [11, 3], [10, 3]]
    }
  ]);

export const floor = new Sprite("tiles", [{ tile: [2, 1] }]);

export const wall = new Sprite("tiles", [
  { tile: [1, 3] },
  { tile: [2, 4] },
  { tile: [1, 5] },
  { tile: [0, 4] }
]);

export const door = new Sprite("tiles", [{ tile: [0, 6] }]);
export const start = new Sprite("tiles", [{ tile: [0, 7] }]);
export const exit = new Sprite("tiles", [{ tile: [1, 7] }]);
export const torch = new Sprite("things", [
  {
    speed: 6,
    tile: [[0, 4], [1, 4], [2, 4], [1, 4]]
  }
]);

export const electric = new Sprite("tiles", [
  {
    speed: 6,
    tile: [[5, 3], [5, 4]]
  }
]);
