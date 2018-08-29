export class ControlUI {
  constructor() {
    this.isTouching = false;
    this.isMobile = /android|ip(hone|od|ad)/gi.test(navigator.userAgent);
    this.x = 0;
    this.y = 0;
    if (this.isMobile) {
      this.pad = document.createElement('div');
      this.attack = document.createElement('div');
      this.pad.className = 'controlPad';
      this.attack.className = 'attackPad';

      this.pad.addEventListener('touchstart', this.handleTouch.bind(this));
      this.pad.addEventListener('touchmove', this.handleTouch.bind(this));
      this.pad.addEventListener('touchend', this.endTouch.bind(this));
      this.pad.addEventListener('touchcancel', this.endTouch.bind(this));

      this.attack.addEventListener('touchstart', this.handleAttack.bind(this));
      this.attack.addEventListener('touchend', this.endAttack.bind(this));
      this.attack.addEventListener('touchcancel', this.endAttack.bind(this));

      document.body.appendChild(this.pad);
      document.body.appendChild(this.attack);
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
    const isAttacking = this.isAttacking;
    this.isAttacking = false;
    return {
      isTouching: this.isTouching,
      x: this.x,
      y: this.y,
      direction,
      isAttacking,
    };
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

  handleAttack() {
    this.isAttacking = true;
  }

  endAttack() {
    this.isAttacking = false;
  }
}

export const controlUI = new ControlUI();
