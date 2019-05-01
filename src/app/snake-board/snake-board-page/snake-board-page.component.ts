import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, HostListener } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PlayAction, PauseAction } from '../actions/snake-board.actions';
import { isPlaying, getSnake, SnakeState } from '../state/snake-board.state';
import { takeUntil } from 'rxjs/operators';

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

  constructor(private store: Store<any>) {
    this.isPlaying$ = this.store.pipe(select(isPlaying));
    this.isPlaying$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe((p) => this.isPlaying = p);

    this.snake$ = this.store.pipe(select(getSnake));
  }

  @HostListener('document:keydown.space', ['$event'])
  onSpaceDown() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  ngOnInit() {
    // this.play();
  }

  play() {
    this.store.dispatch(new PlayAction(100));
  }

  pause() {
    this.store.dispatch(new PauseAction());
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
