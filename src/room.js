import { Rect } from './rect';

export class Room extends Rect {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.dist = Infinity;
    this.isStart = false;
    this.neighbors = [];
    this.doors = [];
  }

  isOverlapping(room) {
    const overlap = this.getOverlap(room);
    return overlap && overlap.w && overlap.h;
  }

  move(x, y) {
    this.x += x;
    this.y += y;
    this.doors = this.doors.map(door => ({ x: door.x + x, y: door.y + y }));
  }

  getDoor(neighbor) {
    const roomIndex = this.neighbors.indexOf(neighbor);
    return roomIndex >= 0 ? this.doors[roomIndex] : null;
  }

  findAndSetNeighbors(rooms) {
    this.neighbors = rooms.filter(room => this.isValidNeighbor(room));
    this.doors = this.neighbors.map(room => this.findDoorPosition(room));
  }

  isValidNeighbor(room) {
    const overlap = this.getOverlap(room);
    if (!overlap) {
      return false;
    }
    const isNeighborX = overlap.w === 0 && overlap.h > 1;
    const isNeighborY = overlap.h === 0 && overlap.w > 1;
    return isNeighborX || isNeighborY;
  }

  findDoorPosition(room) {
    const neighborWall = this.getOverlap(room);
    return neighborWall.getCenter(true);
  }

  setStart() {
    this.isStart = true;
    this.dist = 0;
  }
}
