import util from 'node:util';

export type ColorFn = (text: string | number) => string;

function checkNodeVersion() {
  const { versions } = process;
  if ('styleText' in util || !versions.node || versions.bun || versions.deno) {
    return;
  }
  throw new Error(
    `Unsupported Node.js version: "${process.versions.node || 'unknown'}". Expected Node.js >= 20.`,
  );
}

checkNodeVersion();

const createStyler =
  (style: Parameters<typeof util.styleText>[0]): ColorFn =>
  text =>
    util.styleText(style, String(text));

export const color = {
  dim: createStyler('dim'),
  red: createStyler('red'),
  bold: createStyler('bold'),
  blue: createStyler('blue'),
  cyan: createStyler('cyan'),
  gray: createStyler('gray'),
  black: createStyler('black'),
  green: createStyler('green'),
  white: createStyler('white'),
  reset: createStyler('reset'),
  yellow: createStyler('yellow'),
  magenta: createStyler('magenta'),
  underline: createStyler('underline'),
  strikethrough: createStyler('strikethrough'),
};
