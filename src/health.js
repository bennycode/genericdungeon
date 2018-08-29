export class Health {
  constructor(health = 0) {
    this.health = health;
  }

  get isAlive() {
    return this.health > 0;
  }

  onDeath() {}

  add(health) {
    this.setHealth(this.health + health);
  }

  sub(health) {
    this.setHealth(this.health - health);
  }

  setHealth(health) {
    this.health = health;
    if (this.health <= 0) {
      this.onDeath(this.health);
    }
  }
}
