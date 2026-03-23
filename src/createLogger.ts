import { color } from './color.js';
import { gradient } from './gradient.js';
import { LOG_LEVEL, LOG_TYPES } from './constants.js';
import { isErrorStackMessage } from './utils.js';
import type { Options, LogMessage, Logger, LogMethods } from './types.js';

const normalizeErrorMessage = (err: Error) => {
  if (err.stack) {
    let [name, ...rest] = err.stack.split('\n');
    if (name.startsWith('Error: ')) {
      name = name.slice(7);
    }
    return `${name}\n${color.gray(rest.join('\n'))}`;
  }

  return err.message;
};

export let createLogger = (options: Options = {}) => {
  let maxLevel = options.level || 'info';
  const console = options.console ?? globalThis.console;

  let log = (type: LogMethods, message?: LogMessage, ...args: any[]) => {
    let logType = LOG_TYPES[type];
    const { level } = logType;

    if (LOG_LEVEL[level] > LOG_LEVEL[maxLevel]) {
      return;
    }

    if (message === undefined || message === null) {
      return console.log();
    }

    let label = '';
    let text = '';

    if ('label' in logType) {
      label = (logType.label || '').padEnd(7);
      label = color.bold(logType.color ? logType.color(label) : label);
    }

    if (message instanceof Error) {
      text += normalizeErrorMessage(message);

      const { cause } = message;
      if (cause) {
        text += color.yellow('\n  [cause]: ');
        text +=
          cause instanceof Error ? normalizeErrorMessage(cause) : String(cause);
      }
    }
    // change the color of error stacks to
    else if (level === 'error' && typeof message === 'string') {
      let lines = message.split('\n');
      text = lines
        .map(line => (isErrorStackMessage(line) ? color.gray(line) : line))
        .join('\n');
    } else {
      text = `${message}`;
    }

    const method = level === 'error' || level === 'warn' ? level : 'log';
    console[method](label.length ? `${label} ${text}` : text, ...args);
  };

  let logger = {
    greet: (message: string) => log('log', gradient(message)),
  } as Logger;

  (Object.keys(LOG_TYPES) as LogMethods[]).forEach(key => {
    logger[key] = (...args) => log(key, ...args);
  });

  Object.defineProperty(logger, 'level', {
    get: () => maxLevel,
    set(val) {
      maxLevel = val;
    },
  });

  logger.override = customLogger => {
    Object.assign(logger, customLogger);
  };

  return logger;
};
