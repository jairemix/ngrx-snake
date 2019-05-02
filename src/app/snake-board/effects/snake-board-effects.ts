import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { PlayAction, TickAction, PauseAction, SnakeMoveAction } from '../actions/snake-board.actions';
import { switchMap, filter, mergeMap, withLatestFrom } from 'rxjs/operators';
import { interval, of, empty } from 'rxjs';
import { getSnakeVelocity } from '../selectors/selectors';

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

  constructor(
    private actions$: Actions,
    private store: Store<any>,
  ) {}
}
