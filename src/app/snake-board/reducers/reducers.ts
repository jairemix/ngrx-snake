import { initialState, SnakeBoardState, generateFood } from '../state/snake-board.state';
import { SnakeBoardAction,
  PlayAction,
  PauseAction,
  TickAction,
  SnakeMoveAction,
  SnakeChangeDirectionAction,
  SnakeBeforeMoveAction,
  SnakeEatAction,
  FoodCreateAction,
  SnakeGrowAction,
} from '../actions/snake-board.actions';
import { omit, filter } from 'lodash-es';
import {
  moveSnakeBlocks,
  getSnakeHead,
  checkWallCollision,
  checkItemsCollision,
  appendSnakeBlock,
  getPositionFromCell,
  getRandomCellPosition,
  checkSelfCollision
} from '../grid-mechanics';

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

      // TODO: move more logic to snakeBeforeMove effect since it is more powerful

      const snake = state.snake;
      const displacement = action.payload;
      const head = getSnakeHead(snake.blocks);

      if (checkWallCollision(head, displacement, state.gridSettings)) {
        return omit({
          ...state,
          // isPlaying: false,
          hasLost: true,
          snake,
        }, 'tickInterval');
      }

      if (checkSelfCollision(snake, displacement)) {
        return omit({
          ...state,
          // isPlaying: false,
          hasLost: true,
          snake,
        }, 'tickInterval');
      }

      // TODO: checkSelfCollision??

      const itemCollided = checkItemsCollision(state.gridSettings, action.gridMatrix, head, displacement);
      return {
        ...state,
        snake: {
          ...snake,
          blocks: moveSnakeBlocks(snake.blocks, displacement),
          shouldEat: itemCollided && itemCollided.type === 'food' ? itemCollided : void(0),
        },
      };

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

    case SnakeEatAction.prototype.type: {
      const food = action.payload;
      return {
        ...state,
        snake: omit(state.snake, 'shouldEat'),
        foodItems: filter(state.foodItems, f => f !== food),
        score: state.score + 1,
      };
    }

    case SnakeGrowAction.prototype.type: {
      return {
        ...state,
        snake: appendSnakeBlock(state.gridSettings, state.snake),
      };
    }

    case FoodCreateAction.prototype.type: {
      return {
        ...state,
        foodItems: [
          ...state.foodItems,
          generateFood(
            getPositionFromCell(state.gridSettings, getRandomCellPosition(state.gridSettings)),
            state.gridSettings.CELL_SIZE
          ),
        ],
      };
    }

    default: { // e.g. LoadAdventurer, PersistAdventurer
      return state;
    }
  }
}
