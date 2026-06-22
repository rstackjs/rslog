import supportsColor from 'supports-color';

// https://github.com/chalk/supports-color
export const colorLevel = supportsColor.stdout ? supportsColor.stdout.level : 0;

const ANSI_REGEXP = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');

export const stripAnsi = (text: string): string =>
  text.replace(ANSI_REGEXP, '');

const errorStackRegExp = /at [^\r\n]{0,200}:\d+:\d+[\s)]*$/;
const anonymousErrorStackRegExp = /at [^\r\n]{0,200}\(<anonymous>\)$/;
const indexErrorStackRegExp = /at [^\r\n]{0,200}\(index\s\d+\)$/;

export const isErrorStackMessage = (message: string) => {
  const stripped = stripAnsi(message);
  return (
    errorStackRegExp.test(stripped) ||
    anonymousErrorStackRegExp.test(stripped) ||
    indexErrorStackRegExp.test(stripped)
  );
};
