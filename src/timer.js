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
    Object.values(this.tickHooks).forEach(hook => {
      if (!(this.frame % hook.skip)) {
        hook.callback();
      }
    })
    this.frame += 1;
  }

  on(callback, skip = 1) {
    const id = Math.random().toString(36).substr(2, 8);
    this.tickHooks[id] = { callback, skip };
    return id;
  }

  off(id) {
    if (this.tickHooks.hasOwnProperty(id)) {
      delete this.tickHooks[id];
    }
  }
}

export const timer = new Timer();