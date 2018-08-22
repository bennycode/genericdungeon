import { spriteHandler } from './spritehandler';

const TYPES = {
  WALL: 'Tile.TYPE.WALL',
  FLOOR: 'Tile.TYPE.FLOOR',
  DOOR: 'Tile.TYPE.DOOR',
  UPSTAIRS: 'Tile.TYPE.UPSTAIRS',
  DOWNSTAIRS: 'Tile.TYPE.DOWNSTAIRS',
};

const SPRITE_POSITIONS = {
  [TYPES.WALL]: [0, 3],
  [TYPES.FLOOR]: [1, 2],
  [TYPES.DOOR]: [0, 7],
  [TYPES.UPSTAIRS]: [0, 7],
  [TYPES.DOWNSTAIRS]: [1, 7],
};

const FLOOR_BG =  [
  TYPES.DOOR,
  TYPES.UPSTAIRS,
  TYPES.DOWNSTAIRS,
];

const DONT_DRAW = [
  TYPES.WALL,
];

const WALLS = {
  0b1000: [3, 1],
  0b0100: [4, 2],
  0b0010: [5, 1],
  0b0001: [4, 0],
  0b1100: [3, 2],
  0b0110: [5, 2],
  0b0011: [5, 0],
  0b1001: [3, 0],
};

export class Tile {
  static get TYPE() {
    return TYPES;
  }

  constructor(type, wallType = 0) {
    this.type = type;
    this.wallType = wallType;
  }

  draw(ctx, x, y) {
    if (FLOOR_BG.includes(this.type)) {
      const [floorY, floorX] = SPRITE_POSITIONS[Tile.TYPE.FLOOR];
      spriteHandler.draw(ctx, x, y, floorX, floorY);
    }

    if (DONT_DRAW.includes(this.type)) {
      return;
    }
    const [spriteY, spriteX] = SPRITE_POSITIONS[this.type];
    spriteHandler.draw(ctx, x, y, spriteX, spriteY);
    const wall = WALLS[this.wallType];
    if (wall) {
      const [wallY, wallX] = wall
      spriteHandler.draw(ctx, x, y, wallX, wallY);
    }
  }
}
