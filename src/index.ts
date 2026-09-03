import { createLogger } from './createLogger.ts';

export { createLogger };
export { color } from './color.ts';

export const logger = createLogger();

export type {
  Options,
  Logger,
  LogType,
  LogLevel,
  LogMessage,
  LogFunction,
} from './types.ts';
