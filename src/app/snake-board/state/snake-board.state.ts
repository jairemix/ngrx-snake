import { range, map } from 'lodash-es';
import { Direction, directionToVector } from 'src/app/utils/cartesian-geometry';
import { getRandomCellPosition, getPositionFromCell } from '../grid-mechanics';
import { Position } from 'src/app/utils/cartesian-geometry';

export interface SnakeBoardState {
  isPlaying: boolean;
  hasLost: boolean;

  tickInterval?: number;
  tickCount: number;

  score: number;

  snake: SnakeState;
  gridSettings: GridSettingsState;

  foodItems: FoodItem[];
}

export interface GridSettingsState {
  CELL_SIZE: number;
  WIDTH: number;
  HEIGHT: number;
}

export interface Block {
  BLOCK_SIZE: number;
  x: number;
  y: number;
}

interface IGridItem {
  readonly type: string;
  cssClass?: string;
  blocks: Block[];
}

export interface SnakeState extends IGridItem {
  type: 'snake';
  blocks: Block[]; // snake head is at index 0 (it is a queue)
  newDirection?: Direction; // future direction after 1 tick
  direction: Direction;
  shouldEat?: FoodItem | void;
}

export interface FoodItem extends IGridItem {
  type: 'food';
}

export type GridItem = SnakeState | FoodItem;

// should we use class constructor instead??
const getInitialSnake = (length: number, tailX: number, tailY: number, direction: Direction, cellSize: number): SnakeState => {
  const displacement = directionToVector(direction, cellSize);
  const headX = tailX + (cellSize * length);
  const headY = tailY + (cellSize * length);
  return {
    type: 'snake',
    cssClass: 'block--snake',
    blocks: map(range(0, length), (indicesFromHead) => {
      return {
        BLOCK_SIZE: cellSize,
        x: headX - (displacement.x * indicesFromHead),
        y: headY - (displacement.y * indicesFromHead),
      };
    }),
    direction,
  };
};

export const generateFood = (position: Position, cellSize: number): FoodItem => {
  return {
    type: 'food',
    cssClass: 'block--food',
    blocks: [{
      ...position,
      BLOCK_SIZE: cellSize,
    }],
  };
};

const getInitialBoard = (CELL_SIZE: number, WIDTH: number, HEIGHT: number, INIT_SNAKE_LENGTH: number): SnakeBoardState => {

  const gridSettings = {
    CELL_SIZE,
    WIDTH,
    HEIGHT,
  };

  return {
    isPlaying: false,
    hasLost: false,
    tickCount: 0,
    score: 0,
    gridSettings,
    foodItems: [
      generateFood(getPositionFromCell(gridSettings, getRandomCellPosition(gridSettings)), CELL_SIZE),
      // we don't check for any overlap here
    ],
    snake: getInitialSnake(INIT_SNAKE_LENGTH, CELL_SIZE, CELL_SIZE, Direction.RIGHT, CELL_SIZE),
  };
};

export const initialState = getInitialBoard(10, 200, 200, 3);
