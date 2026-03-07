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

export const bold = createStyler('bold');
export const red = createStyler('red');
export const green = createStyler('green');
export const yellow = createStyler('yellow');
export const magenta = createStyler('magenta');
export const cyan = createStyler('cyan');
export const gray = createStyler('gray');
