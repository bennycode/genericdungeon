export const rand = (min, max) =>
  Math.floor(
    max !== undefined ? Math.random() * (max - min) + min : Math.random() * min
  );
export const randFromArray = array => array[rand(array.length)];
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  get length() {
    return this.queue.length;
  }

  put(item, priority) {
    if (!this.queue.length) {
      this.queue.push({ item, priority });
      return;
    }
    let start = 0;
    let end = this.queue.length;
    const getPivot = () => Math.ceil((start + end) / 2);
    let pivot = getPivot();
    while (start < end) {
      if (this.queue[pivot] && priority < this.queue[pivot].priority) {
        end = pivot;
      } else {
        start = pivot;
      }
      pivot = getPivot();
    }
    this.queue.splice(pivot, 0, { item, priority });
  }
}

const p = new PriorityQueue();
p.put("100", 100);
p.put("10", 10);
p.put("200", 200);
console.log(p.queue);

const aStar = (start, goal, map) => {
  const frontier = new PriorityQueue();
};
/*
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
