import type { ColorFn } from './color.js';
import type { LOG_TYPES } from './constants.js';

export type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'log' | 'verbose';

export type LogMessage = unknown;

export interface LogType {
  label?: string;
  level: LogLevel;
  color?: ColorFn;
}

export type LogFunction = (message?: LogMessage, ...args: any[]) => void;

export interface Options {
  level?: LogLevel;
  console?: Pick<Console, 'log' | 'warn' | 'error'>;
}

export type LogMethods = keyof typeof LOG_TYPES;

export type Logger = Record<LogMethods, LogFunction> & {
  greet: (message: string) => void;
  level: LogLevel;
  override: (customLogger: Partial<Record<LogMethods, LogFunction>>) => void;
};
