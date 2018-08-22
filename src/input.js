class Input {
  static get KEY() {
    return keys;
  }

  constructor() {
    this.keys = [];
    document.addEventListener(
      "keydown",
      ({ keyCode }) => (this.keys[keyCode] = true)
    );
    document.addEventListener(
      "keyup",
      ({ keyCode }) => (this.keys[keyCode] = false)
    );
  }

  get left() {
    return this.isPressing(KEYS.LEFT) || this.isPressing(KEYS.A);
  }
  get right() {
    return this.isPressing(KEYS.RIGHT) || this.isPressing(KEYS.D);
  }
  get up() {
    return this.isPressing(KEYS.UP) || this.isPressing(KEYS.W);
  }
  get down() {
    return this.isPressing(KEYS.DOWN) || this.isPressing(KEYS.S);
  }

  isPressing(key) {
    return !!this.keys[key];
  }
}

export const input = new Input();

export const KEYS = {
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  LEFT: 37,
  W: 87,
  A: 65,
  S: 83,
  D: 68
};
