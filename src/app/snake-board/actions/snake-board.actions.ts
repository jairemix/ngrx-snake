import { Direction, Vector } from './../../utils/cartesian-geometry';
import { setProto } from 'src/app/utils/set-proto.decorator';

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

export class SnakeMoveAction {
  @setProto('[Snake Board] Snake Move')
  readonly type: '[Snake Board] Snake Move';
  constructor(readonly payload: Vector) {}
}

export class SnakeChangeDirectionAction {
  @setProto('[Snake Board] Snake Change Direction')
  readonly type: '[Snake Board] Snake Change Direction';
  constructor(readonly payload: Direction) {}
}

export class SnakeCollisionAction {
  @setProto('[Snake Board] Snake Collision')
  readonly type: '[Snake Board] Snake Collision';
}

export type SnakeBoardAction = PlayAction | PauseAction | TickAction |
  SnakeMoveAction | SnakeChangeDirectionAction | SnakeCollisionAction;
