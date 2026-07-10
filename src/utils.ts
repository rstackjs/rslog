const errorStackRegExp =
  /at [^\r\n]{0,200}(?::\d+:\d+[\s)]*|\(<anonymous>\)|\(index\s\d+\))$/;

export const isErrorStackMessage = (message: string) =>
  errorStackRegExp.test(message);
