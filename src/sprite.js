import { characters } from './images';
import { timer } from './timer';

const characterSheet = new Image();
characterSheet.src = characters;
const size = 16;

const char1 = {
  sheet: characterSheet,
  variants: [
    {
      tile: [7, 0],
    },
    {
      tile: [7, 1],
    },
    {
      tile: [7, 2],
    },
    {
      tile: [7, 3],
    },

    {
      speed: 2,
      tile: [[6, 0], [7, 0], [8, 0], [7, 0]],
    },
    {
      speed: 2,
      tile: [[6, 1], [7, 1], [8, 1], [7, 1]],
    },
    {
      speed: 2,
      tile: [[6, 2], [7, 2], [8, 2], [7, 2]],
    },
    {
      speed: 2,
      tile: [[6, 3], [7, 3], [8, 3], [7, 3]],
    },

  ]
};



export class Sprite {
  constructor (sheet, variants) {
    this.sheet = sheet;
    this.variants = {};
  }
  addVariant(){

  }
  setVariant(){
    
  }
  draw(ctx, x, y) {
    ctx.drawImage(characterSheet, char1[0] * size, char1[1] * size, size, size, x, y, size, size);
  }
}