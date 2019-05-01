import { initialState, SnakeBoardState } from '../state/snake-board.state';
import { SnakeBoardAction,
  PlayAction,
  PauseAction,
  TickAction,
  SnakeMoveAction,
  SnakeChangeDirectionAction,
  SnakeCollisionAction,
} from '../actions/snake-board.actions';
import { omit, map } from 'lodash-es';

/**
 * To be replaced by `createReducer` and `on(Action)` with ngrx 8. This allows us to avoid long switch blocks
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

    case SnakeChangeDirectionAction.prototype.type: {
      const direction = action.payload;
      return {
        ...state,
        snake: {
          ...state.snake,
          direction,
        },
      };
    }

    case SnakeCollisionAction.prototype.type: {
      return {
        ...state,
        hasLost: true,
      };
    }

    default: { // e.g. LoadAdventurer, PersistAdventurer
      return state;
    }
  }
}
