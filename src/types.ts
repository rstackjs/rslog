import type { ColorFn } from './color.js';
import type { LOG_TYPES } from './constants.js';

export type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'log' | 'verbose';

export type LogMessage = unknown;

export interface LogType {
  label?: string;
  level: LogLevel;
  color?: ColorFn;
}

export type LogFunction = (message?: LogMessage, ...args: unknown[]) => void;

export interface Options {
  /**
   * Controls which log levels are emitted.
   * @default 'info'
   */
  level?: LogLevel;
  /**
   * Prepends a fixed prefix to every log message.
   * @default undefined
   */
  prefix?: string;
  /**
   * Overrides the console used by this logger instance.
   * @default globalThis.console
   */
  console?: Pick<Console, 'log' | 'warn' | 'error'>;
}

export type LogMethods = keyof typeof LOG_TYPES;

export type Logger = Record<LogMethods, LogFunction> & {
  greet: (message: string) => void;
  level: LogLevel;
  readonly options: Options;
  override: (customLogger: Partial<Record<LogMethods, LogFunction>>) => void;
};
