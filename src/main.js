import {
  GRID_SIZE,
  DIRECTIONS,
  createInitialState,
  queueDirection,
  tick,
  createRng,
} from './snakeLogic.js';

const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');
const boardEl = document.getElementById('board');
const restartButton = document.getElementById('restart');
const touchButtons = document.querySelectorAll('[data-dir]');

const rng = createRng();
let state = createInitialState(rng);
let paused = false;

const TICK_MS = 140;
const cells = [];

for (let i = 0; i < GRID_SIZE * GRID_SIZE; i += 1) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  boardEl.appendChild(cell);
  cells.push(cell);
}

function toIndex(position) {
  return position.y * GRID_SIZE + position.x;
}

function requestDirection(directionKey) {
  const requested = DIRECTIONS[directionKey];
  if (!requested || state.gameOver) return;
  state = {
    ...state,
    queuedDirection: queueDirection(state.direction, state.queuedDirection, requested),
    started: true,
  };
}

function restart() {
  state = createInitialState(rng);
  paused = false;
  render();
}

function updateStatus() {
  if (state.gameOver) {
    statusEl.textContent = 'Game over. Press Restart to play again.';
    return;
  }

  if (!state.started) {
    statusEl.textContent = 'Use arrow keys or WASD to start.';
    return;
  }

  statusEl.textContent = paused ? 'Paused (press Space to resume).' : 'Running';
}

function render() {
  cells.forEach((cell) => {
    cell.className = 'cell';
  });

  state.snake.forEach((segment) => {
    const index = toIndex(segment);
    if (cells[index]) cells[index].classList.add('snake');
  });

  if (state.food) {
    const foodIndex = toIndex(state.food);
    if (cells[foodIndex]) cells[foodIndex].classList.add('food');
  }

  scoreEl.textContent = String(state.score);
  updateStatus();
}

function gameLoop() {
  if (!paused && !state.gameOver && state.started) {
    state = tick(state, rng);
    render();
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key.startsWith('Arrow')) event.preventDefault();
  const key = event.key.toLowerCase();

  if (key === ' ' || event.code === 'Space') {
    event.preventDefault();
    if (!state.gameOver) {
      paused = !paused;
      render();
    }
    return;
  }

  const map = {
    arrowup: 'up',
    w: 'up',
    arrowdown: 'down',
    s: 'down',
    arrowleft: 'left',
    a: 'left',
    arrowright: 'right',
    d: 'right',
  };

  requestDirection(map[key]);
});

touchButtons.forEach((button) => {
  button.addEventListener('click', () => {
    requestDirection(button.dataset.dir);
  });
});

restartButton.addEventListener('click', restart);

setInterval(gameLoop, TICK_MS);
render();
