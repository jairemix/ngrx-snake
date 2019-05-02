import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { GridSettingsState } from '../state/snake-board.state';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {

  @Input() settings: GridSettingsState;

}
