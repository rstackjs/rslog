import { createLogger } from './createLogger.js';

export { createLogger };
export { color } from './color.js';

export const logger = createLogger();

export type {
  Options,
  Logger,
  LogType,
  LogLevel,
  LogMessage,
  LogFunction,
} from './types.js';
