import { Block, GridState, SnakeState } from './state/snake-board.state';
import { Vector } from '../utils/cartesian-geometry';
import { map } from 'lodash-es';

/**
 * checks if any imminent displacement to the block is going to cause a collision with the grid walls
 * @param block block that will be displaced
 * @param displacement displacement that the block will undergo
 * @param grid game grid
 */
export function checkWallCollision(block: Block, displacement: Vector, grid: GridState): boolean {

  const minX = 0;
  const maxX = grid.WIDTH;
  const minY = 0;
  const maxY = grid.HEIGHT;

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
    const nextBlock = blocks[index + 1];
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
  return blocks[blocks.length - 1];
}
