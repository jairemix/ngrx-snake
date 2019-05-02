import { Block, GridSettingsState, GridItem, SnakeState } from './state/snake-board.state';
import { Vector, Position } from '../utils/cartesian-geometry';
import { map, random, some } from 'lodash-es';

/**
 * checks if any imminent displacement to the block is going to cause a collision with the grid walls
 * @param block block that will be displaced
 * @param displacement displacement that the block will undergo
 * @param gridSettings game grid
 */
export function checkWallCollision(block: Block, displacement: Vector, gridSettings: GridSettingsState): boolean {

  const minX = 0;
  const maxX = gridSettings.WIDTH;
  const minY = 0;
  const maxY = gridSettings.HEIGHT;

  // if (block.x < 30) {
  //   console.log({
  //     'block.x': block.x,
  //     futureX: block.x + displacement.x,
  //     'displacement.x': displacement.x,
  //     minX,
  //   });
  // }

  if (block.x + block.BLOCK_SIZE + displacement.x > maxX) { // right collision
    return true;
  } else if (block.x + displacement.x < minX) { // left collision
    return true;
  } else if (block.y + displacement.y < minY) { // top collision
    return true;
  } else if (block.y + block.BLOCK_SIZE + displacement.y > maxY) { // bottom collision
    return true;
  } else {
    return false;
  }
}

// may also use grid matrix??
export function checkSelfCollision(snake: SnakeState, displacement: Vector) {
  const head = snake.blocks[0];
  const futureX = head.x + displacement.x;
  const futureY = head.y + displacement.y;
  return some(snake.blocks.slice(1), (block) => {
    // (does not check partial overlaps, only total overlaps)
    return futureX === block.x && futureY === block.y;
  });
}

export function moveSnakeBlocks(blocks: Block[], displacement: Vector): Block[] {
  return map(blocks, (currentBlock, index) => {
    const nextBlock = blocks[index - 1]; // previous element in the array, nextBlock for the snake (since head is at 0)
    if (nextBlock) { // currentBlock is not head -> follow next block
      return {
        ...currentBlock,
        x: nextBlock.x,
        y: nextBlock.y,
      };
    } else { // head -> follow displacementVector
      return {
        ...currentBlock,
        x: currentBlock.x + displacement.x,
        y: currentBlock.y + displacement.y,
      };
    }
  });
}

export function getSnakeHead(blocks: Block[]) {
  return blocks[0];
}

export function appendSnakeBlock(gridSettings: GridSettingsState, snake: SnakeState): SnakeState {
  const secondToLast = snake.blocks[snake.blocks.length - 2];
  const last = snake.blocks[snake.blocks.length - 1];

  const minX = 0;
  const maxX = gridSettings.WIDTH;
  const minY = 0;
  const maxY = gridSettings.HEIGHT;

  const appendedBlock = {
    BLOCK_SIZE: gridSettings.CELL_SIZE,
    x: last.x + (last.x - secondToLast.x),
    y: last.y + (last.y - secondToLast.y),
  };

  // prevent overlaps with wall
  appendedBlock.x = Math.min(Math.max(appendedBlock.x, minX), maxX);
  appendedBlock.y = Math.min(Math.max(appendedBlock.y, minY), maxY);

  return {
    ...snake,
    blocks: [
      ...snake.blocks,
      appendedBlock,
    ],
  };
}

// may use currying for gridSettings??
export function getPositionFromCell(gridSettings: GridSettingsState, cellPosition: CellPosition): Position {
  const CELL_SIZE = gridSettings.CELL_SIZE;
  return {
    x: CELL_SIZE * cellPosition.col,
    y: CELL_SIZE * cellPosition.row,
  };
}

export function getRandomCellPosition(gridSettings: GridSettingsState): CellPosition {
  const COLS = gridSettings.WIDTH / gridSettings.CELL_SIZE;
  const ROWS = gridSettings.HEIGHT / gridSettings.CELL_SIZE;
  return {
    col: random(0, COLS - 1),
    row: random(0, ROWS - 1),
  };
}

export function getCellFromPosition(gridSettings: GridSettingsState, position: Position): CellPosition {
  const col = Math.floor(position.x / gridSettings.CELL_SIZE);
  const row = Math.floor(position.y / gridSettings.CELL_SIZE);
  return { col, row };
}

export function checkItemsCollision(
  gridSettings: GridSettingsState,
  gridMatrix: GridItem[][],
  block: Block,
  displacement: Vector
): GridItem | void {
  const { col, row } = getCellFromPosition(gridSettings, {
    x: block.x + displacement.x,
    y: block.y + displacement.y,
  });
  return gridMatrix[col][row];
}

export interface CellPosition {
  col: number;
  row: number;
}
