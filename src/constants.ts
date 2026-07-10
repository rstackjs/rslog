import { color } from './color.js';
import type { ColorFn } from './color.js';
import type { LogLevel, LogType } from './types.js';

export const LOG_LEVEL = {
  silent: -1,
  error: 0,
  warn: 1,
  info: 2,
  // log is an alias of info
  log: 2,
  verbose: 3,
} as const;

const createLogType = <T extends LogLevel>(
  label: string,
  level: T,
  style: ColorFn,
) => ({
  label: color.bold(style(label.padEnd(7))),
  level,
});

export const LOG_TYPES = {
  error: createLogType('error', 'error', color.red),
  warn: createLogType('warn', 'warn', color.yellow),
  info: createLogType('info', 'info', color.cyan),
  start: createLogType('start', 'info', color.cyan),
  ready: createLogType('ready', 'info', color.green),
  success: createLogType('success', 'info', color.green),
  log: {
    level: 'info',
  },
  debug: createLogType('debug', 'verbose', color.magenta),
} satisfies Record<string, LogType>;
