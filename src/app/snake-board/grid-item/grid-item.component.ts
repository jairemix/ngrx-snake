import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { GridItem, Block } from '../state/snake-board.state';

@Component({
  selector: 'app-grid-item',
  templateUrl: './grid-item.component.html',
  styleUrls: ['./grid-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridItemComponent {

  @Input() item: GridItem;

  cssClass: string;

  trackByIndex(index, _: Block) {
    return index;
  }

}
