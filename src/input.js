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
    return this.isPressing(KEYS.LEFT);
  }
  get right() {
    return this.isPressing(KEYS.RIGHT);
  }
  get up() {
    return this.isPressing(KEYS.UP);
  }
  get down() {
    return this.isPressing(KEYS.DOWN);
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
  LEFT: 37
};
