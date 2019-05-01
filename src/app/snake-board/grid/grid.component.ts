import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { GridState } from '../state/snake-board.state';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {

  @Input() grid: GridState;

}
