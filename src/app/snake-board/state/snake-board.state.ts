import { range, map } from 'lodash-es';
import { Direction, directionToVector } from 'src/app/utils/cartesian-geometry';
import { getRandomCellPosition, getPositionFromCell } from '../grid-mechanics';
import { Position } from 'src/app/utils/cartesian-geometry';

export interface SnakeBoardState {
  isPlaying: boolean;
  hasLost: boolean;

  tickInterval?: number;
  tickCount: number;

  snake: SnakeState;
  gridSettings: GridSettingsState;

  foodItems: FoodItem[];
}

export interface GridSettingsState {
  CELL_SIZE: number;
  WIDTH: number;
  HEIGHT: number;
}

export interface SnakeState extends GridItem {
  type: 'snake';
  blocks: Block[]; // snake head is at index 0 (it is a queue)
  newDirection?: Direction; // future direction after 1 tick
  direction: Direction;
}

export interface GridItem {
  readonly type: string;
  cssClass?: string;
  blocks: Block[];
}

export interface Block {
  BLOCK_SIZE: number;
  x: number;
  y: number;
}

export interface FoodItem extends GridItem {
  type: 'food';
}

// should we use class constructor instead??
const getInitialSnake = (length: number, tailX: number, tailY: number, direction: Direction, cellSize: number): SnakeState => {
  const displacement = directionToVector(direction, cellSize);
  const headX = tailX + (cellSize * length);
  const headY = tailY + (cellSize * length);
  return {
    type: 'snake',
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

const generateFood = (position: Position, cellSize: number): FoodItem => {
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

  // const COLS = WIDTH / CELL_SIZE;
  // const ROWS = HEIGHT / CELL_SIZE;
  // const gridContent = map(range(0, COLS), _ => new Array(ROWS));
  // gridContent[foodCellPos.row][foodCellPos.col] = new FoodContent();

  return {
    isPlaying: false,
    hasLost: false,
    tickCount: 0,
    gridSettings,
    // gridContent,
    foodItems: [
      generateFood(getPositionFromCell(gridSettings, getRandomCellPosition(gridSettings)), CELL_SIZE),
    ],
    snake: getInitialSnake(INIT_SNAKE_LENGTH, CELL_SIZE, CELL_SIZE, Direction.RIGHT, CELL_SIZE),
  };
};

export const initialState = getInitialBoard(10, 500, 500, 3);
