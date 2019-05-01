import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SnakeState } from '../state/snake-board.state';
import { range, map } from 'lodash-es';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnakeComponent {

  @Input() snake: SnakeState;
  snakeBlocks: {
    x: number,
    y: number,
  }[];

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes.snake) {
  //     this.snakeBlocks = this.getSnakeBlocks(this.snake);
  //   }
  // }

  trackByIndex(index: number, _: any) {
    return index;
  }

}
