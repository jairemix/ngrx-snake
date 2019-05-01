import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { PlayAction, TickAction, PauseAction, SnakeMoveAction, SnakeCollisionAction } from '../actions/snake-board.actions';
import { switchMap, filter, mergeMap, withLatestFrom } from 'rxjs/operators';
import { interval, of, empty } from 'rxjs';
import { getSnakeVelocity, getSnake, getGrid } from '../selectors/selectors';

// new syntax -> createEffect

@Injectable()
export class PartyEffects {

  @Effect()
  ticker$ = this.actions$.pipe(
    filter((action) => action.type === PlayAction.prototype.type || action.type === PauseAction.prototype.type),
    switchMap((action: PlayAction | PauseAction) => {
      if (action.type === PlayAction.prototype.type) {
        return interval(action.tickInterval);
      } else {
        return empty();
      }
    }),
    switchMap(() => of(new TickAction())),
  );

  @Effect()
  snakeMove$ = this.actions$.pipe(
    ofType(TickAction.prototype.type),
    withLatestFrom(this.store.select(getSnakeVelocity)),
    mergeMap(([_, velocity]) => {
      return of(new SnakeMoveAction(velocity)); // displacement = velocity * 1 tick
    }),
  );

  @Effect()
  collide$ = this.actions$.pipe(
    ofType(SnakeMoveAction.prototype.type),
    withLatestFrom(this.store.select(getSnake), this.store.select(getSnakeVelocity), this.store.select(getGrid)),
    mergeMap(([_, snake, velocity, grid]) => {
      const head = snake.blocks[0];

      const minX = 0;
      const maxX = grid.WIDTH - grid.CELL_SIZE;
      const minY = 0;
      const maxY = grid.HEIGHT - grid.CELL_SIZE;

      // BUG: collision will happen one tick too soon!
      /* needs to wait for next tick by using
      * switchMap(() => {
      *   return this.actions$.pipe(
      *     ofType(TickAction.prototype.type)),
      *     skip(1), // ???
      *     take(1),
      *   );
      * ),
      */
      // NOTE: can also do a switch using snake.direction to find which wall we'll collide with
      const isCollision = head.x - (velocity.x) < minX ||
        head.x + (velocity.x) > maxX ||
        head.y - (velocity.y) < minY ||
        head.y - (velocity.y) > maxY;

      if (isCollision) {
        return [
          // do not wrap in observable when returning multiple actions
          new SnakeCollisionAction(),
          new PauseAction(),
        ];
      } else {
        return empty();
      }

    }),
  );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
  ) {}
}
