import { createFeatureSelector, createSelector, Action } from '@ngrx/store';
import { TickAction, PlayAction, PauseAction, SnakeMoveAction, SnakeBoardAction } from '../actions/snake-board.actions';
import { range, map, omit } from 'lodash-es';

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
  direction: SnakeDirection;
}

export interface Block {
  x: number;
  y: number;
}

export enum SnakeDirection {
  UP,
  RIGHT,
  BOTTOM,
  LEFT
}

const getDisplacementVector = (direction: SnakeDirection, magnitude: number): { x: number, y: number } => {
  switch (direction) {
    case SnakeDirection.UP: return { x: 0, y: -magnitude };
    case SnakeDirection.RIGHT: return { x: magnitude, y: 0 };
    case SnakeDirection.BOTTOM: return { x: 0, y: magnitude };
    case SnakeDirection.LEFT: return { x: -magnitude, y: 0 };
  }
};

const getInitialSnake = (length: number, tailX: number, tailY: number, direction: SnakeDirection, cellSize: number): SnakeState => {
  const displacement = getDisplacementVector(direction, cellSize);
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
    snake: getInitialSnake(INIT_SNAKE_LENGTH, CELL_SIZE, CELL_SIZE, SnakeDirection.RIGHT, CELL_SIZE),
  };
};

const initialState = getInitialBoard(10, 500, 500, 3);

/**
 * The createFeatureSelector function selects a piece of state from the root of the state object.
 * This is used for selecting feature states that are loaded eagerly or lazily.
 */
export const getSnakeBoardState = createFeatureSelector<any, SnakeBoardState>('snakeBoard');

export const isPlaying = createSelector(getSnakeBoardState, (state) => state.isPlaying);

export const getSnake = createSelector(getSnakeBoardState, (state) => state.snake);

/**
 * To be replaced by createReducer and on(Action) with ngrx 8. This allows us to avoid long switch blocks
 */
export function snakeBoardReducer(state = initialState, action: SnakeBoardAction): SnakeBoardState {
  switch (action.type) {

    case PlayAction.prototype.type: {
      return {
        ...state,
        isPlaying: true,
        tickInterval: action.tickInterval,
      };
    }

    case PauseAction.prototype.type: {
      return omit({
        ...state,
        isPlaying: false,
      }, 'tickInterval');
    }

    case TickAction.prototype.type: {
      return {
        ...state,
        tickCount: state.tickCount + 1,
      };
    }

    case SnakeMoveAction.prototype.type: {
      const snake = state.snake;
      const displacementVector = action.payload;
      const oldBlocks = snake.blocks;
      const newBlocks = map(oldBlocks, (currentBlock, index) => {
        const nextBlock = oldBlocks[index + 1];
        if (nextBlock) { // currentBlock is not head -> follow next block
          return {
            ...currentBlock, // do not directly copy nextBlock since we might have some other block properties (e.g. color) in the future!
            x: nextBlock.x,
            y: nextBlock.y,
          };
        } else { // head -> follow displacementVector
          return {
            ...currentBlock,
            x: currentBlock.x + displacementVector.x,
            y: currentBlock.y + displacementVector.y,
          };
        }
      });

      return {
        ...state,
        snake: {
          ...snake,
          blocks: newBlocks,
        },
      };
    }

    default: { // e.g. LoadAdventurer, PersistAdventurer
      return state;
    }
  }
}
