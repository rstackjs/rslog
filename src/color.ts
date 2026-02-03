import { styleText } from 'node:util';

export type ColorFn = (text: string | number) => string;

const createStyler =
  (style: Parameters<typeof styleText>[0]): ColorFn =>
  text =>
    styleText(style, String(text));

export const bold = createStyler('bold');
export const red = createStyler('red');
export const green = createStyler('green');
export const yellow = createStyler('yellow');
export const magenta = createStyler('magenta');
export const cyan = createStyler('cyan');
export const gray = createStyler('gray');
