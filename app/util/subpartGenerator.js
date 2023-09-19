import { randomInt } from "node:crypto";
import { promisify } from "node:util";

const randomIntAsync = promisify(randomInt);
const MAX_SAFE_INTEGER_FOR_GENERATOR = Math.pow(2, 48);

/**
 * @param min {number?}
 * @param max {number?}
 * @returns {string}
 */
export default async function subpartGenerator(min, max) {
  /*
    Number.MAX_SAFE_INTEGER represents the maximum safe integer in JavaScript (2^53 – 1).
    The range (max - min) must be less than 2^48.
    Min and max must be safe integers.
    More info: https://nodejs.org/api/crypto.html#cryptorandomintmin-max-callback
  */
  if (typeof min !== 'number') {
    min = 1;
  }
  if (typeof max !== 'number') {
    min = MAX_SAFE_INTEGER_FOR_GENERATOR;
  }
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max)) {
    throw new Error('Numbers must be safe integers');
  }
  if ((max - min) >= MAX_SAFE_INTEGER_FOR_GENERATOR) {
    throw new Error('The range (max - min) must be less than 2^48');
  }
  return (await randomIntAsync(min, max)).toString(36);
}
