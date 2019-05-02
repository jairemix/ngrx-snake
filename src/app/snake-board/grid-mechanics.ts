import { Block, GridSettingsState } from './state/snake-board.state';
import { Vector, Position } from '../utils/cartesian-geometry';
import { map, random } from 'lodash-es';

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

// may use currying for gridSettings??
export function getPositionFromCell(gridSettings: GridSettingsState, cellPosition: { col: number, row: number }): Position {
  const CELL_SIZE = gridSettings.CELL_SIZE;
  return {
    x: CELL_SIZE * cellPosition.col,
    y: CELL_SIZE * cellPosition.row,
  };
}

export function getRandomCellPosition(gridSettings: GridSettingsState): { col: number, row: number } {
  const COLS = gridSettings.WIDTH / gridSettings.CELL_SIZE;
  const ROWS = gridSettings.HEIGHT / gridSettings.CELL_SIZE;
  return {
    col: random(0, COLS - 1),
    row: random(0, ROWS - 1),
  };
}
