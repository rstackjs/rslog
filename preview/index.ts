import { createLogger, logger } from '../dist/index.js';
import { getErrorCause } from './cause.ts';

logger.greet(`\n➜ Rslog v1.0.0\n`);
logger.info('This is a info message');
logger.start('This is a start message');
logger.warn('This is a warn message');
logger.debug('This is a debug message');
logger.ready('This is a ready message');
logger.success('This is a success message');
logger.error('This is a error message');
logger.error(new Error('This is a error message with stack'));
logger.error(new TypeError('This is a type error with stack'));
logger.error(
  new Error('This is a error message with cause', {
    cause: getErrorCause(),
  }),
);

// multi-line alignment demo
const alignLogger = createLogger({ alignMultiline: true });
const prefixAlignLogger = createLogger({
  alignMultiline: true,
  prefix: '[web]',
});

alignLogger.info(`User profile updated:
- Name: John Doe
- Email: john@example.com
- Phone: +1234567890`);

prefixAlignLogger.info(`User profile updated:
- Name: John Doe
- Email: john@example.com`);

// error stacks stay top-aligned even with alignMultiline
alignLogger.error(`Something failed:
- reason A
    at /rslog/foo/bar.js:29:0
- reason B`);

// pre-formatted JSON content (demonstrates the double-indent trade-off)
alignLogger.info(`Config loaded:
{
  "port": 3000,
  "host": "localhost"
}`);
