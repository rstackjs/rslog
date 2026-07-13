const ANSI_REGEXP = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');

export const stripAnsi = (text: string): string =>
  text.replace(ANSI_REGEXP, '');

const errorStackRegExp =
  /at [^\r\n]{0,200}(?::\d+:\d+[\s)]*|\(<anonymous>\)|\(index\s\d+\))$/;

export const isErrorStackMessage = (message: string) => {
  const stripped = stripAnsi(message);
  return errorStackRegExp.test(stripped);
};
