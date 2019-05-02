import { initialState, SnakeBoardState } from '../state/snake-board.state';
import { SnakeBoardAction,
  PlayAction,
  PauseAction,
  TickAction,
  SnakeMoveAction,
  SnakeChangeDirectionAction,
  SnakeBeforeMoveAction,
} from '../actions/snake-board.actions';
import { omit, map } from 'lodash-es';
import { moveSnakeBlocks, getSnakeHead, checkWallCollision } from '../grid-mechanics';
import { take } from 'rxjs/operators';

/**
 * To be replaced by `createReducer` and `on(Action)` with ngrx 8. This allows us to avoid long switch blocks
 */
export function snakeBoardReducer(state = initialState, action: SnakeBoardAction): SnakeBoardState {
  switch (action.type) {

    case PlayAction.prototype.type: {
      if (state.hasLost) {
        return {
          ...initialState,
          isPlaying: true,
          tickInterval: action.tickInterval,
        };
      } else {
        return {
          ...state,
          isPlaying: true,
          tickInterval: action.tickInterval,
        };
      }
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

    case SnakeBeforeMoveAction.prototype.type: {
      const snake = state.snake;
      if (snake.newDirection !== void(0)) { // check snake direction
        return {
          ...state,
          snake: {
            ...state.snake,
            direction: snake.newDirection,
            newDirection: void(0),
          },
        };
      } else {
        return state;
      }
    }

    case SnakeMoveAction.prototype.type: {

      const snake = state.snake;
      const displacement = action.payload;
      const head = getSnakeHead(snake.blocks);

      if (checkWallCollision(head, displacement, state.grid)) {
        return omit({
          ...state,
          // isPlaying: false,
          hasLost: true,
          snake,
        }, 'tickInterval');
      } else {
        return {
          ...state,
          snake: {
            ...snake,
            blocks: moveSnakeBlocks(snake.blocks, displacement),
          },
        };
      }

    }

    case SnakeChangeDirectionAction.prototype.type: {
      const newDirection = action.payload;
      return {
        ...state,
        snake: {
          ...state.snake,
          newDirection,
        },
      };
    }

    default: { // e.g. LoadAdventurer, PersistAdventurer
      return state;
    }
  }
}
