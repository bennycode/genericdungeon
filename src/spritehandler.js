import { tileset } from './images';


class SpriteHandler {
  constructor() {
    this.tilesetImage = new Image();
    this.tilesetImage.src = tileset;
    this.tileSize = 16;
    //document.body.appendChild(this.tilesetImage);
  }
  draw(ctx, x, y, row, col) {
    ctx.drawImage(this.tilesetImage, row * this.tileSize, col * this.tileSize, this.tileSize, this.tileSize, x, y, this.tileSize, this.tileSize);
  }
}

export const spriteHandler = new SpriteHandler();