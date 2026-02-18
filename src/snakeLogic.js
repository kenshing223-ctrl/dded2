export const GRID_SIZE = 20;

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function isOpposite(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0;
}

export function nextDirection(currentDirection, requestedDirection) {
  if (!requestedDirection) return currentDirection;
  if (isOpposite(currentDirection, requestedDirection)) return currentDirection;
  return requestedDirection;
}


export function queueDirection(currentDirection, queuedDirection, requestedDirection) {
  if (!requestedDirection) return queuedDirection;
  const next = nextDirection(currentDirection, requestedDirection);
  const blockedAsReverse = next === currentDirection && requestedDirection !== currentDirection;
  return blockedAsReverse ? queuedDirection : next;
}

export function moveSnake(snake, direction, grow = false) {
  const [head] = snake;
  const nextHead = { x: head.x + direction.x, y: head.y + direction.y };
  const nextSnake = [nextHead, ...snake];
  if (!grow) {
    nextSnake.pop();
  }
  return nextSnake;
}

export function hitsWall(head, gridSize = GRID_SIZE) {
  return head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize;
}

export function hitsSelf(snake) {
  const [head, ...body] = snake;
  return body.some((segment) => segment.x === head.x && segment.y === head.y);
}

export function createRng(seed = Date.now()) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export function spawnFood(snake, gridSize = GRID_SIZE, random = Math.random) {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const openCells = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        openCells.push({ x, y });
      }
    }
  }

  if (openCells.length === 0) return null;
  const idx = Math.floor(random() * openCells.length);
  return openCells[idx];
}

export function createInitialState(random = Math.random) {
  const middle = Math.floor(GRID_SIZE / 2);
  const snake = [
    { x: middle, y: middle },
    { x: middle - 1, y: middle },
    { x: middle - 2, y: middle },
  ];

  return {
    snake,
    direction: DIRECTIONS.right,
    queuedDirection: DIRECTIONS.right,
    food: spawnFood(snake, GRID_SIZE, random),
    score: 0,
    gameOver: false,
    started: false,
  };
}

export function tick(state, random = Math.random) {
  if (state.gameOver) return state;

  const direction = nextDirection(state.direction, state.queuedDirection);
  const nextHead = {
    x: state.snake[0].x + direction.x,
    y: state.snake[0].y + direction.y,
  };

  const willEat = state.food && nextHead.x === state.food.x && nextHead.y === state.food.y;
  const snake = moveSnake(state.snake, direction, willEat);

  if (hitsWall(nextHead, GRID_SIZE) || hitsSelf(snake)) {
    return {
      ...state,
      direction,
      gameOver: true,
      started: true,
    };
  }

  const food = willEat ? spawnFood(snake, GRID_SIZE, random) : state.food;

  return {
    ...state,
    snake,
    direction,
    food,
    score: state.score + (willEat ? 1 : 0),
    started: true,
  };
}
