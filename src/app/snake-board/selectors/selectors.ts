import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SnakeBoardState } from '../state/snake-board.state';
import { directionToVector } from 'src/app/utils/cartesian-geometry';

/**
 * The createFeatureSelector function selects a piece of state from the root of the state object.
 * This is used for selecting feature states that are loaded eagerly or lazily.
 */
export const getSnakeBoardState = createFeatureSelector<any, SnakeBoardState>('snakeBoard');

export const isPlaying = createSelector(getSnakeBoardState, (state) => state.isPlaying);

export const getSnake = createSelector(getSnakeBoardState, (state) => state.snake);

export const getGrid = createSelector(getSnakeBoardState, (state) => state.grid);

export const getSnakeDirection = createSelector(getSnake, (snake) => snake.direction);

export const getSnakeVelocity = createSelector(getSnakeDirection, getGrid, (direction, grid) => {
  return directionToVector(direction, grid.CELL_SIZE);
});
