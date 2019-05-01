import { createFeatureSelector, createSelector, Action } from '@ngrx/store';
import { TickAction, PlayAction, PauseAction, SnakeMoveAction, SnakeBoardAction } from '../actions/snake-board.actions';
import { range, map, omit } from 'lodash-es';

export interface SnakeBoardState {
  isPlaying: boolean;
  tickInterval?: number;
  tickCount: number;
  snake: SnakeState;

  readonly cellSize: number;
  // readonly width: number;
  // readonly height: number;
}

// TODO: think of how to encode state
export interface SnakeState {
  length: number;
  headX: number;
  headY: number;
  // segments??
}

const initialState: SnakeBoardState = {
  isPlaying: false,
  tickCount: 0,
  cellSize: 10, // NOTE: unused
  snake: {
    length: 3,
    headX: 30,
    headY: 10,
    // snake direction
  }
};

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
      const payload = action.payload;
      return {
        ...state,
        snake: {
          ...snake,
          headX: snake.headX + payload.x,
          headY: snake.headY + payload.y,
        },
      };
    }

    default: { // e.g. LoadAdventurer, PersistAdventurer
      return state;
    }
  }
}
