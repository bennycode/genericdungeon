class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  isEmpty() {
    return !this.queue.length;
  }

  put(item, priority) {
    if (!this.queue.length) {
      this.queue.push({ item, priority });
      return;
    }
    let i = 0;
    for (; i < this.queue.length; i++) {
      if (this.queue[i].priority > priority) {
        break;
      }
    }
    this.queue.splice(i, 0, { item, priority });
  }

  get() {
    return this.queue.shift().item;
  }
}

const getX = value => value >> 16;
const getY = value => value & 0xffff;
const formatXY = (x, y) => (x << 16) | y;

const getNeighbors = (pos, map) => {
  const neighbors = [];
  const x = getX(pos);
  const y = getY(pos);
  const addNeighbor = (nx, ny, cost) =>
    map[nx] && map[nx][ny] && neighbors.push(formatXY(nx, ny), cost);
  addNeighbor(x - 1, y - 1, Math.SQRT2);
  addNeighbor(x, y - 1, 1);
  addNeighbor(x + 1, y - 1, Math.SQRT2);
  addNeighbor(x - 1, y, 1);
  addNeighbor(x + 1, y, 1);
  addNeighbor(x - 1, y + 1, Math.SQRT2);
  addNeighbor(x, y + 1, 1);
  addNeighbor(x + 1, y + 1, Math.SQRT2);
  return neighbors;
};

const getBackPath = (from, cameFrom) => {
  let current = from;
  const path = [];
  while (cameFrom[current]) {
    path.push({ x: getX(current), y: getY(current) });
    current = cameFrom[current];
  }
  return path;
};

const diagonalCorrection = Math.SQRT2 - 2;
const heuristic = (from, to) => {
  const dx = Math.abs(getX(from) - getX(to));
  const dy = Math.abs(getY(from) - getY(to));
  return dx + dy + diagonalCorrection * Math.min(dx, dy);
};

const aStar = (startCoords, goalCoords, map) => {
  const frontier = new PriorityQueue();
  const start = formatXY(startCoords.x, startCoords.y);
  const goal = formatXY(goalCoords.x, goalCoords.y);
  frontier.put(start, 0);
  const cameFrom = { [start]: null };
  const costSoFar = { [start]: 0 };
  while (!frontier.isEmpty()) {
    let current = frontier.get();
    if (current === goal) {
      return getBackPath(goal, cameFrom);
    }
    const neighbors = getNeighbors(current, map);
    for (let i = 0; i < neighbors.length; i += 2) {
      const neighbor = neighbors[i];
      const cost = neighbors[i + 1];
      const newCost = costSoFar[current] + cost;
      if (costSoFar[neighbor] === undefined || newCost < costSoFar[neighbor]) {
        costSoFar[neighbor] = newCost;
        const priority = newCost + heuristic(goal, neighbor);
        frontier.put(neighbor, priority);
        cameFrom[neighbor] = current;
      }
    }
  }
};

export default aStar;
/*

from https://www.redblobgames.com/pathfinding/a-star/introduction.html#astar

frontier = PriorityQueue()
frontier.put(start, 0)
came_from = {}
cost_so_far = {}
came_from[start] = None
cost_so_far[start] = 0

while not frontier.empty():
   current = frontier.get()

   if current == goal:
      break
   
   for next in graph.neighbors(current):
      new_cost = cost_so_far[current] + graph.cost(current, next)
      if next not in cost_so_far or new_cost < cost_so_far[next]:
         cost_so_far[next] = new_cost
         priority = new_cost + heuristic(goal, next)
         frontier.put(next, priority)
         came_from[next] = current

         */
