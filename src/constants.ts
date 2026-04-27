import { color } from './color.js';
import type { LogType } from './types.js';

export const LOG_LEVEL = {
  silent: -1,
  error: 0,
  warn: 1,
  info: 2,
  // log is an alias of info
  log: 2,
  verbose: 3,
} as const;

export const LOG_TYPES = {
  // Level error
  error: {
    label: 'error',
    level: 'error',
    color: color.red,
  },
  // Level warn
  warn: {
    label: 'warn',
    level: 'warn',
    color: color.yellow,
  },
  // Level info
  info: {
    label: 'info',
    level: 'info',
    color: color.cyan,
  },
  start: {
    label: 'start',
    level: 'info',
    color: color.cyan,
  },
  ready: {
    label: 'ready',
    level: 'info',
    color: color.green,
  },
  success: {
    label: 'success',
    level: 'info',
    color: color.green,
  },
  log: {
    level: 'info',
  },
  // Level debug
  debug: {
    label: 'debug',
    level: 'verbose',
    color: color.magenta,
  },
} satisfies Record<string, LogType>;
