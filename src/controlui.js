export class ControlUI {
  constructor() {
    this.isTouching = false;
    this.isMobile = /android|ip(hone|od|ad)/gi.test(navigator.userAgent);
    this.x = 0;
    this.y = 0;
    if (this.isMobile) {
      this.pad = document.createElement('div');
      this.pad.className = 'controlPad';

      this.pad.addEventListener('touchstart', this.handleTouch.bind(this));
      this.pad.addEventListener('touchmove', this.handleTouch.bind(this));
      this.pad.addEventListener('touchend', this.endTouch.bind(this));
      this.pad.addEventListener('touchcancel', this.endTouch.bind(this));

      document.body.appendChild(this.pad);
    }
  }

  poll() {
    const direction =
      Math.abs(this.x) > Math.abs(this.y)
        ? this.x < 0
          ? 3
          : 1
        : this.y < 0
          ? 0
          : 2;
    return this.isTouching && { x: this.x, y: this.y, direction };
  }

  handleTouch(event) {
    const touch = event.touches[0];
    this.isTouching = true;
    const padX = this.pad.offsetLeft + this.pad.offsetWidth / 2;
    const padY = this.pad.offsetTop + this.pad.offsetHeight / 2;
    this.x = touch.pageX - padX;
    this.y = touch.pageY - padY;
    event.preventDefault();
  }

  endTouch() {
    this.isTouching = false;
  }
}

export const controlUI = new ControlUI();
