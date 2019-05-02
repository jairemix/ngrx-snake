import { Store, select } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { PlayAction,
  TickAction,
  PauseAction,
  SnakeMoveAction,
  SnakeBeforeMoveAction,
  SnakeEatAction,
  FoodCreateAction,
  SnakeGrowAction,
} from '../actions/snake-board.actions';
import { switchMap, filter, mergeMap, withLatestFrom, distinctUntilChanged, map as mapRx } from 'rxjs/operators';
import { interval, of, empty } from 'rxjs';
import { getSnakeVelocity, getSnakeBoardState, getGridMatrix, getSnake } from '../selectors/selectors';

// new syntax -> createEffect

@Injectable()
export class PartyEffects {

  @Effect()
  ticker$ = this.actions$.pipe(
    filter((action) => action.type === PlayAction.prototype.type || action.type === PauseAction.prototype.type),
    switchMap((action: PlayAction | PauseAction) => { // switchMap important since we want to cancel
      if (action.type === PlayAction.prototype.type) {
        return interval(action.tickInterval);
      } else {
        return empty();
      }
    }),
    switchMap(() => of(new TickAction())),
  );

  @Effect()
  snakeBeforeMove$ = this.actions$.pipe(
    ofType(TickAction.prototype.type),
    mergeMap((_) => of(new SnakeBeforeMoveAction())),
  );

  @Effect()
  snakeMove$ = this.actions$.pipe(
    ofType(SnakeBeforeMoveAction.prototype.type),
    withLatestFrom(this.store.select(getSnakeVelocity), this.store.select(getGridMatrix)),
    mergeMap(([_, velocity, gridMatrix]) => {
      return of(new SnakeMoveAction(velocity, gridMatrix)); // displacement = velocity * 1 tick
    }),
  );

  @Effect()
  hasLost$ = this.store.pipe(
    select(getSnakeBoardState),
    mapRx(state => state.hasLost),
    distinctUntilChanged(),
    switchMap((hasLost) => {
      return hasLost ? of(new PauseAction()) : empty();
    }),
  );

  @Effect()
  hasEaten$ = this.store.pipe(
    select(getSnake),
    mapRx(snake => snake.shouldEat),
    distinctUntilChanged(),
    switchMap((hasEaten) => {
      return hasEaten ? [
        new SnakeEatAction(hasEaten),
        new SnakeGrowAction(),
        new FoodCreateAction(),
      ] : [];
    }),
  );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
  ) {}
}
