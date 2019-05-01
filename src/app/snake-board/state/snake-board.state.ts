import { range, map } from 'lodash-es';
import { Direction, directionToVector } from 'src/app/utils/cartesian-geometry';

export interface SnakeBoardState {
  isPlaying: boolean;
  tickInterval?: number;
  tickCount: number;
  snake: SnakeState;
  grid: GridState;
}

export interface GridState {
  CELL_SIZE: number;
  WIDTH: number;
  HEIGHT: number;
}

export interface SnakeState {
  blocks: Block[]; // snake head is at last index
  direction: Direction;
}

export interface Block {
  x: number;
  y: number;
}

const getInitialSnake = (length: number, tailX: number, tailY: number, direction: Direction, cellSize: number): SnakeState => {
  const displacement = directionToVector(direction, cellSize);
  return {
    blocks: map(range(0, length), (indicesFromTail) => {
      return {
        x: tailX + (displacement.x * indicesFromTail),
        y: tailY + (displacement.y * indicesFromTail),
      };
    }),
    direction,
  };
};

const getInitialBoard = (CELL_SIZE: number, WIDTH: number, HEIGHT: number, INIT_SNAKE_LENGTH: number): SnakeBoardState => {
  return {
    isPlaying: false,
    tickCount: 0,
    grid: {
      CELL_SIZE,
      WIDTH,
      HEIGHT,
    },
    snake: getInitialSnake(INIT_SNAKE_LENGTH, CELL_SIZE, CELL_SIZE, Direction.RIGHT, CELL_SIZE),
  };
};

export const initialState = getInitialBoard(10, 500, 500, 3);
