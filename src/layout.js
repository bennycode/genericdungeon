import { rand, randFromArray } from './util';
import { Room } from './room';
import { Tile } from './tile';
import { Rect } from './rect';

export class Layout {
  constructor(roomCount) {
    this.tileSize = 16;
    this.roomShouldMove = this.roomShouldMove.bind(this);

    this.rooms = this.makeRooms(roomCount);
    this.fixLayout();

    this.setValidNeighbors();

    const center = this.getMostCenterRoom()
    center.setStart();

    this.rooms = this.getConnectedRooms(center);
    this.normalizeCoords();
    this.tileMap = this.makeTileMap();
    this.makeDoors();
    this.makeWalls();
    this.startPos = center.getCenter(true);
    const endPos = this.rooms[this.rooms.length - 1].getCenter(true);
    this.tileMap[this.startPos.x][this.startPos.y].type = Tile.TYPE.UPSTAIRS;
    this.tileMap[endPos.x][endPos.y].type = Tile.TYPE.DOWNSTAIRS;
    this.updateCanvas();
  }

  makeRooms(count) {
    const makeRoom = () => new Room(rand(20, 30), rand(20, 30), rand(4, 9), rand(4, 9))
    return Array.from(Array(count), makeRoom);
  }

  getConnectedRooms(startRoom) {
    const connectedRooms = [startRoom];
    const addConnected = room => !connectedRooms.includes(room) && connectedRooms.push(room);
    let roomsToCheck = startRoom.neighbors.slice();
    while (roomsToCheck.length) {
      const newRoomsToCheck = []
      roomsToCheck.forEach(room => {
        addConnected(room);
        room.neighbors.forEach(neighbor => !connectedRooms.includes(neighbor) && newRoomsToCheck.push(neighbor))
      });
      roomsToCheck = newRoomsToCheck;
    }
    return connectedRooms;
  }

  createDists(startRoom) {
    const unvisited = this.rooms.slice();
    while (unvisited.length) {
      const room = unvisited.reduce((shortest, curr) => curr.dist < shortest.dist ? curr : shortest, unvisited[0]);
      unvisited.splice(unvisited.indexOf(room), 1);
      room.neighbors.forEach(neighbor => {
        const dist = room.dist + room.getCenterDist(neighbor);
        if (dist < neighbor.dist) {
          neighbor.dist = dist;
        }
      });
    }
  }

  normalizeCoords() {
    const { x, y } = Rect.fromRects(this.rooms);
    this.rooms.forEach(room => {
      room.x -= x;
      room.y -= y;
    })
  }

  getMostCenterRoom() {
    const allBounds = Rect.fromRects(this.rooms);
    return this.rooms.reduce((closest, room) => {
      const dist = room.getCenterDist(allBounds);
      return dist < closest.dist ? { room, dist } : closest;
    }, { room: this.rooms[0], dist: Infinity }).room;
  }

  getOtherRooms(room) {
    return this.rooms.filter(oRoom => room !== oRoom);
  }

  roomShouldMove(room) {
    return this.getOtherRooms(room).some(oRoom => room.isOverlapping(oRoom));
  }

  setValidNeighbors() {
    this.rooms.forEach(room => room.findAndSetNeighbors(this.getOtherRooms(room)));
  }

  fixLayout(maxSteps = 100000) {
    let steps = 0;
    while (steps++ < maxSteps && this.rooms.some(this.roomShouldMove)) {
      this.fixLayoutStep();
    }
  }

  fixLayoutStep() {
    const movableRooms = this.rooms.filter(this.roomShouldMove);
    const randomRoom = randFromArray(movableRooms);

    const otherRooms = movableRooms.filter(room => room !== randomRoom && randomRoom.isOverlapping(room));
    const otherRoom = randFromArray(otherRooms);

    const otherCenter = otherRoom.getCenter();
    const roomCenter = randomRoom.getCenter();

    const diffX = roomCenter.x - otherCenter.x;
    const diffY = roomCenter.y - otherCenter.y;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);

    const moveAlongX = absDiffX > absDiffY ? true : absDiffX < absDiffY ? false : Math.random() > .5;

    const moveX = Math.sign(diffX)
    const moveY = Math.sign(diffY)

    randomRoom.x += moveAlongX ? moveX : 0;
    randomRoom.y += moveAlongX ? 0 : moveY;
  }

  makeDoors() {
    this.rooms.forEach(room => room.neighbors.forEach(neighbor => {
      const doorPos = room.findDoorPosition(neighbor);
      this.tileMap[doorPos.x][doorPos.y].type = Tile.TYPE.DOOR;
    }))
  }

  makeWalls() {
    this.tileMap.forEach((col, x) => col.forEach((tile, y) => {
      if (tile.type !== Tile.TYPE.WALL) {
        const walls = [
          this.tileMap[x][y - 1].type === Tile.TYPE.WALL,
          this.tileMap[x + 1][y].type === Tile.TYPE.WALL,
          this.tileMap[x][y + 1].type === Tile.TYPE.WALL,
          this.tileMap[x - 1][y].type === Tile.TYPE.WALL,
        ]
        const wallType = (walls[0] && 8) | (walls[1] && 4) | (walls[2] && 2) | (walls[3] && 1) || 0;
        tile.wallType = wallType;
      }
    }));
  }

  makeTileMap() {
    const allRoomBounds = Rect.fromRects(this.rooms);
    const mapWidth = allRoomBounds.x2 + 1;
    const mapHeight = allRoomBounds.y2 + 1;
    const map = Array.from(Array(mapWidth), () => Array.from(Array(mapHeight), () => new Tile(Tile.TYPE.WALL)));
    this.rooms.forEach(room => {
      for (let x = room.x + 1; x < room.x2; x++) {
        for (let y = room.y + 1; y < room.y2; y++) {
          map[x][y].type = Tile.TYPE.FLOOR;
        }
      }
    })
    return map;
  }

  getMapSize() {
    const allRoomBounds = Rect.fromRects(this.rooms);
    return {
      width: (allRoomBounds.w + 1) * this.tileSize,
      height: (allRoomBounds.h + 1) * this.tileSize,
    }
  }

  drawTileMap(ctx) {
    ctx.putImageData(this.baseData, 0, 0);
  }

  debugDraw(root) {
    this.rooms.forEach(room => room.debugDraw(root));
  }

  updateCanvas() {
    this.baseCanvas = document.createElement('canvas');
    const { width, height } = this.getMapSize();
    const ctx = this.baseCanvas.getContext('2d');
    this.baseCanvas.width = width;
    this.baseCanvas.height = height;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    this.tileMap.forEach((col, x) => col.forEach((tile, y) => tile.draw(ctx, x * this.tileSize, y * this.tileSize)));
    this.baseData = ctx.getImageData(0, 0, width, height);
  }

  debugDrawGraph(ctx) {
    this.rooms.forEach(room => {
      const center = room.getCenter();
      room.neighbors.forEach(neighbor => {
        const nCenter = neighbor.getCenter();
        ctx.beginPath();
        ctx.moveTo(center.x * this.tileSize, center.y * this.tileSize);
        ctx.lineTo(nCenter.x * this.tileSize, nCenter.y * this.tileSize);
        ctx.stroke();
      })

    })
  }
}