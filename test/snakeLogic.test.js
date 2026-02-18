import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DIRECTIONS,
  moveSnake,
  nextDirection,
  queueDirection,
  hitsWall,
  hitsSelf,
  spawnFood,
  tick,
} from '../src/snakeLogic.js';

test('nextDirection prevents immediate reversal', () => {
  const current = DIRECTIONS.right;
  const blocked = nextDirection(current, DIRECTIONS.left);
  assert.equal(blocked, DIRECTIONS.right);

  const allowed = nextDirection(current, DIRECTIONS.up);
  assert.equal(allowed, DIRECTIONS.up);
});

test('moveSnake grows when requested', () => {
  const snake = [
    { x: 3, y: 3 },
    { x: 2, y: 3 },
    { x: 1, y: 3 },
  ];
  const moved = moveSnake(snake, DIRECTIONS.right, true);
  assert.equal(moved.length, 4);
  assert.deepEqual(moved[0], { x: 4, y: 3 });
});

test('wall and self collisions are detected', () => {
  assert.equal(hitsWall({ x: -1, y: 0 }, 20), true);
  assert.equal(hitsWall({ x: 0, y: 0 }, 20), false);

  const snake = [
    { x: 3, y: 3 },
    { x: 3, y: 4 },
    { x: 3, y: 3 },
  ];
  assert.equal(hitsSelf(snake), true);
});

test('spawnFood never uses occupied cell', () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ];

  const food = spawnFood(snake, 3, () => 0);
  assert.notDeepEqual(food, { x: 0, y: 0 });
  assert.notDeepEqual(food, { x: 1, y: 0 });
});

test('tick increments score and grows when food is eaten', () => {
  const initial = {
    snake: [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 2 },
    ],
    direction: DIRECTIONS.right,
    queuedDirection: DIRECTIONS.right,
    food: { x: 3, y: 2 },
    score: 0,
    gameOver: false,
    started: true,
  };

  const next = tick(initial, () => 0.5);
  assert.equal(next.score, 1);
  assert.equal(next.snake.length, 4);
  assert.deepEqual(next.snake[0], { x: 3, y: 2 });
});


test('queueDirection keeps previous valid queue when opposite key is pressed before tick', () => {
  const queued = queueDirection(DIRECTIONS.right, DIRECTIONS.down, DIRECTIONS.left);
  assert.equal(queued, DIRECTIONS.down);
});
