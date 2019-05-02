import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, HostListener } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PlayAction, PauseAction, SnakeChangeDirectionAction } from '../actions/snake-board.actions';
import { SnakeState, GridState } from '../state/snake-board.state';
import { takeUntil, map as mapRx } from 'rxjs/operators';
import { Direction } from 'src/app/utils/cartesian-geometry';
import { isPlaying, getGrid, getSnake, getSnakeBoardState } from '../selectors/selectors';

@Component({
  selector: 'app-snake-board-page',
  templateUrl: './snake-board-page.component.html',
  styleUrls: ['./snake-board-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnakeBoardPageComponent implements OnInit, OnDestroy {
  isPlaying$: Observable<boolean>;
  isPlaying: boolean;

  destroyed$ = new Subject<void>();
  snake$: Observable<SnakeState>;
  snake: SnakeState;
  grid$: Observable<GridState>;
  hasLost$: Observable<boolean>;

  constructor(private store: Store<any>) {
    this.hasLost$ = this.store.pipe(select(getSnakeBoardState), mapRx((s) => s.hasLost));
    this.isPlaying$ = this.store.pipe(select(isPlaying));
    this.isPlaying$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe((p) => this.isPlaying = p);

    this.grid$ = this.store.pipe(select(getGrid));
    this.snake$ = this.store.pipe(select(getSnake));
    this.snake$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe((s) => this.snake = s);
  }

  @HostListener('document:keydown.space', ['$event'])
  onSpaceKeyDown() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  @HostListener('document:keydown.arrowleft', ['$event'])
  onLeftKeyDown() {
    if (this.isPlaying && this.snake.direction !== Direction.RIGHT) { // no U-turns!
      // BUG: check does not work if snake hasn't move yet before the last direction change
      this.store.dispatch(new SnakeChangeDirectionAction(Direction.LEFT));
    }
  }

  @HostListener('document:keydown.arrowright', ['$event'])
  onRightKeyDown() {
    if (this.isPlaying && this.snake.direction !== Direction.LEFT) {
      this.store.dispatch(new SnakeChangeDirectionAction(Direction.RIGHT));
    }
  }

  @HostListener('document:keydown.arrowup', ['$event'])
  onUpKeyDown() {
    if (this.isPlaying && this.snake.direction !== Direction.DOWN) {
      this.store.dispatch(new SnakeChangeDirectionAction(Direction.UP));
    }
  }

  @HostListener('document:keydown.arrowdown', ['$event'])
  onDownKeyDown() {
    if (this.isPlaying && this.snake.direction !== Direction.UP) {
      this.store.dispatch(new SnakeChangeDirectionAction(Direction.DOWN));
    }
  }

  ngOnInit() {
    // this.play();
  }

  play() {
    this.store.dispatch(new PlayAction(1000));
    // this.store.dispatch(new PlayAction(100));
  }

  pause() {
    this.store.dispatch(new PauseAction());
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
