class Timer {
  constructor() {
    this.tick = this.tick.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);

    this.tickHooks = {};
    this.frame = 0;
    this.tick();
  }

  tick() {
    requestAnimationFrame(this.tick);
    Object.entries(this.tickHooks).forEach(([id, hook]) => {
      if (!(this.frame % hook.skip)) {
        hook.callback();
        if (hook.once) {
          this.off(id);
        }
      }
    });
    this.frame += 1;
  }

  on(callback, skip = 1, once = false) {
    const id = Math.random()
      .toString(36)
      .substr(2, 8);
    this.tickHooks[id] = { callback, skip, once };
    return id;
  }

  off(id) {
    if (this.tickHooks.hasOwnProperty(id)) {
      delete this.tickHooks[id];
    }
  }

  once(callback, wait = 1) {
    return this.on(callback, wait, true);
  }
}

export const timer = new Timer();
