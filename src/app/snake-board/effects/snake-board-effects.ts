import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { PlayAction, TickAction, PauseAction, SnakeMoveAction } from '../actions/snake-board.actions';
import { switchMap, filter, mergeMap } from 'rxjs/operators';
import { interval, of, empty } from 'rxjs';

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
    mergeMap(() => {
      return of(new SnakeMoveAction({
        x: 10,
        y: 0, // grab from store
      }));
    }),
  );

  // @Effect()
  // persistParty$ = this.actions$.pipe(
  //   ofType(PartyActionsEnum.PersistParty),
  //   withLatestFrom(this.store.select(getPartyState)),
  //   switchMap(([_, partyStateModel]: [PersistPartyAction, PartyStateModel]) => {
  //     // switchMap because we want to persist only the latest state
  //     const toPersist = omit(partyStateModel, 'loaded', 'loadError', 'persistError');
  //     return this.partyService.setParty(toPersist).pipe(
  //       mapRx(__ => new PersistPartySuccessAction()),
  //       catchError((e) => of(new PersistPartyErrorAction(e))),
  //     );
  //   }),
  // );

  // @Effect()
  // createAdventurer$ = this.actions$.pipe(
  //   ofType(PartyActionsEnum.CreateAdventurer),
  //   mapRx(() => new PersistPartyAction()),
  // );

  // @Effect()
  // updateAdventurer$ = this.actions$.pipe(
  //   ofType(PartyActionsEnum.UpdateAdventurer),
  //   mapRx(() => new PersistPartyAction()),
  // );

  // @Effect()
  // deleteAdventurer$ = this.actions$.pipe(
  //   ofType(PartyActionsEnum.DeleteAdventurer),
  //   mapRx(() => new PersistPartyAction()),
  // );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
  ) {}
}
