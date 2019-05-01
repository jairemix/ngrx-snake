import { PartyEffects } from './effects/snake-board-effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SnakeBoardPageComponent } from './snake-board-page/snake-board-page.component';
import { RouterModule, Route } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { snakeBoardReducer } from './state/snake-board.state';
import { EffectsModule } from '@ngrx/effects';
import { SnakeComponent } from './snake/snake.component';

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
    SnakeComponent,
  ],
  providers: [
  ],
  exports: [
  ],
})
export class SnakeBoardModule {}
