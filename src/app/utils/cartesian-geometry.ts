// can also use export const RIGHT = 0, etc for less strict typing so as to allow intermediate directions (e.g. 45 degrees)
export enum Direction {
  RIGHT, // 0rad
  UP, // (Math.PI / 2)rad
  LEFT, // (Math.PI)rad
  DOWN, // (Math.PI * 3 / 2)rad
}

export interface Position {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

/**
 * @param direction right: 0, up: 1, left: 2, down: 3
 * @param magnitude vector magnitude
 * @return column matrix of vector
 */
export function directionToVector(direction: Direction, magnitude: number): Vector {
  switch (direction) {
    case Direction.UP: return { x: 0, y: -magnitude };
    case Direction.RIGHT: return { x: magnitude, y: 0 };
    case Direction.DOWN: return { x: 0, y: magnitude };
    case Direction.LEFT: return { x: -magnitude, y: 0 };
  }
}

/**
 * @param direction right: 0, up: 1, left: 2, down: 3
 * @return the angle in radians between the direction and the x-axis
 */
export function directionToAngle(direction: Direction): number {
  return direction * Math.PI;
}

/**
 * @param angle angle in radians between the vector and the x-axis
 * @param magnitude vector magnitude
 * @param decimalPlaces number of decimal places to round to (necessary because of the nature of floats)
 * @return column matrix of vector
 */
export function angleToVector(angle: number, magnitude: number, decimalPlaces = 6): Vector {
  return {
    x: roundToDecimalPlaces(magnitude * Math.cos(angle), decimalPlaces),
    y: roundToDecimalPlaces(magnitude * Math.sin(angle), decimalPlaces),
  };
}

// has some bug with some very specific numbers
// https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
/**
 * @param float floating point number to round
 * @param decimalPlaces number of decimal places
 */
export function roundToDecimalPlaces(float: number, decimalPlaces: number): number {
  const roundingFactor = Math.pow(10, decimalPlaces);
  return Math.round(float * roundingFactor) / roundingFactor;
}
