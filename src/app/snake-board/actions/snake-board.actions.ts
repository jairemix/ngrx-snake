import { Direction, Vector } from './../../utils/cartesian-geometry';
import { setProto } from 'src/app/utils/set-proto.decorator';
import { GridItem, FoodItem } from '../state/snake-board.state';

export class PlayAction {
  @setProto('[Snake Board] Play')
  readonly type: '[Snake Board] Play';
  constructor(readonly tickInterval: number) {}
}

export class PauseAction {
  @setProto('[Snake Board] Pause')
  readonly type: '[Snake Board] Pause';
}

export class TickAction {
  @setProto('[Snake Board] Tick')
  readonly type: '[Snake Board] Tick';
}

export class SnakeBeforeMoveAction {
  @setProto('[Snake Board] Snake Before Move')
  readonly type: '[Snake Board] Snake Before Move';
}

export class SnakeMoveAction {
  @setProto('[Snake Board] Snake Move')
  readonly type: '[Snake Board] Snake Move';
  // NOTE: antipattern to pass state data as parameter (use effects???)
  constructor(readonly payload: Vector, readonly gridMatrix: GridItem[][]) {}
}

export class SnakeChangeDirectionAction {
  @setProto('[Snake Board] Snake Change Direction')
  readonly type: '[Snake Board] Snake Change Direction';
  constructor(readonly payload: Direction) {}
}

export class SnakeEatAction {
  @setProto('[Snake Board] Snake Ate')
  readonly type: '[Snake Board] Snake Ate';
  constructor(readonly payload: FoodItem) {}
}

export class SnakeGrowAction {
  @setProto('[Snake Board] Snake Grow')
  readonly type: '[Snake Board] Snake Grow';
}

export class FoodCreateAction {
  @setProto('[Snake Board] Food Create')
  readonly type: '[Snake Board] Food Create';
}

export type SnakeBoardAction = PlayAction | PauseAction | TickAction |
  SnakeMoveAction | SnakeChangeDirectionAction | SnakeBeforeMoveAction | SnakeEatAction | SnakeGrowAction |
  FoodCreateAction;
