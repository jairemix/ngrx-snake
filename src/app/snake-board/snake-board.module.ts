import { PartyEffects } from './effects/snake-board-effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SnakeBoardPageComponent } from './snake-board-page/snake-board-page.component';
import { RouterModule, Route } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridComponent } from './grid/grid.component';
import { snakeBoardReducer } from './reducers/reducers';
import { PixelsPipe } from './pipes/pixels.pipe';
import { GridItemComponent } from './grid-item/grid-item.component';

const routes: Route[] = [
  {
    path: '',
    component: SnakeBoardPageComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    /**
     * StoreModule.forFeature is used for composing state
     * from feature modules. These modules can be loaded
     * eagerly or lazily and will be dynamically added to
     * the existing state.
     */
    StoreModule.forFeature('snakeBoard', snakeBoardReducer),
    EffectsModule.forFeature([PartyEffects]),
  ],
  declarations: [
    SnakeBoardPageComponent,
    GridComponent,
    PixelsPipe,
    GridItemComponent,
  ],
  providers: [
  ],
  exports: [
  ],
})
export class SnakeBoardModule {}
