import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SnakeBoardState, GridItem } from '../state/snake-board.state';
import { directionToVector } from 'src/app/utils/cartesian-geometry';
import { map, range } from 'lodash-es';
import { getCellFromPosition } from '../grid-mechanics';

/**
 * The createFeatureSelector function selects a piece of state from the root of the state object.
 * This is used for selecting feature states that are loaded eagerly or lazily.
 */
export const getSnakeBoardState = createFeatureSelector<any, SnakeBoardState>('snakeBoard');

export const isPlaying = createSelector(getSnakeBoardState, (state) => state.isPlaying);

export const getSnake = createSelector(getSnakeBoardState, (state) => state.snake);

export const getGridSettings = createSelector(getSnakeBoardState, (state) => state.gridSettings);

export const getSnakeDirection = createSelector(getSnake, (snake) => snake.direction);

export const getSnakeVelocity = createSelector(getSnakeDirection, getGridSettings, (direction, gridSettings) => {
  return directionToVector(direction, gridSettings.CELL_SIZE);
});

export const getFoodItems = createSelector(getSnakeBoardState, (state) => state.foodItems);

export const getScore = createSelector(getSnakeBoardState, (state) => state.score);

// inefficient selector?
// grid matrix is used for checking for collisions
// not checking for overlaps between items here - bug
export const getGridMatrix = createSelector(getGridSettings, getFoodItems, (gridSettings, foodItems): GridItem[][] => {
  const COLS = gridSettings.WIDTH / gridSettings.CELL_SIZE;
  const ROWS = gridSettings.HEIGHT / gridSettings.CELL_SIZE;
  const matrix = map(range(0, COLS), _ => new Array<GridItem>(ROWS));

  foodItems.forEach((food) => {
    food.blocks.forEach((block) => {
      const { col, row } = getCellFromPosition(gridSettings, block);
      matrix[col][row] = food; // point to food not block.
    });
  });

  return matrix;
});
