import supportsColor from 'supports-color';

// https://github.com/chalk/supports-color
export const colorLevel = supportsColor.stdout ? supportsColor.stdout.level : 0;

const errorStackRegExp = /at [^\r\n]{0,200}:\d+:\d+[\s\)]*$/;
const anonymousErrorStackRegExp = /at [^\r\n]{0,200}\(<anonymous>\)$/;
const indexErrorStackRegExp = /at [^\r\n]{0,200}\(index\s\d+\)$/;

export const isErrorStackMessage = (message: string) =>
  errorStackRegExp.test(message) ||
  anonymousErrorStackRegExp.test(message) ||
  indexErrorStackRegExp.test(message);
