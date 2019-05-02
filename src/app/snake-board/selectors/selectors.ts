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

export const getGridSettings = createSelector(getSnakeBoardState, (state) => state.gridSettings);

export const getSnakeDirection = createSelector(getSnake, (snake) => snake.direction);

export const getSnakeVelocity = createSelector(getSnakeDirection, getGridSettings, (direction, gridSettings) => {
  return directionToVector(direction, gridSettings.CELL_SIZE);
});

export const getFoodItems = createSelector(getSnakeBoardState, (state) => state.foodItems);
