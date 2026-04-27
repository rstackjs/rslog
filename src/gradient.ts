import { color } from './color.js';
import { colorLevel } from './utils.js';

// RGB for #bdfff3
const startColor = [189, 255, 243];
// RGB for #4ac29a
const endColor = [74, 194, 154];

const isWord = (char: string) => !/[\s\n]/.test(char);

export const gradient = (message: string) => {
  if (colorLevel < 3) {
    return colorLevel === 2 ? color.cyan(message) : message;
  }

  // split string and handle emoji correctly
  // https://stackoverflow.com/questions/24531751/how-can-i-split-a-string-containing-emoji-into-an-array
  const chars = [...message];
  const steps = chars.filter(isWord).length;
  let r = startColor[0];
  let g = startColor[1];
  let b = startColor[2];
  const rStep = (endColor[0] - r) / steps;
  const gStep = (endColor[1] - g) / steps;
  const bStep = (endColor[2] - b) / steps;
  let output = '';

  for (const char of chars) {
    if (isWord(char)) {
      r += rStep;
      g += gStep;
      b += bStep;
    }
    output += `\x1b[38;2;${Math.round(r)};${Math.round(g)};${Math.round(
      b,
    )}m${char}\x1b[39m`;
  }

  return color.bold(output);
};
