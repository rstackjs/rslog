import { createLogger, Logger, logger } from '../src/index.js';
import { expect, test, describe, rs, Mock } from '@rstest/core';
import stripAnsi from 'strip-ansi';
import { createSnapshotSerializer } from 'path-serializer';

expect.addSnapshotSerializer(createSnapshotSerializer());

const getErrorCause = () => {
  const err = new Error('this is a cause error');
  err.stack = '    at /rslog/foo/bar.js:29:0';
  return err;
};

const printTestLogs = (logger: Logger) => {
  logger.greet(`😊 Rslog v1.0.0\n`);
  logger.log('this is a log message');
  logger.error('this is a error message');
  logger.info('this is an info message');
  logger.warn('this is a warn message');
  logger.ready('this is a ready message');
  logger.debug('this is a debug message');
  logger.success('this is a success message');
};

describe('logger', () => {
  test('should respect color settings configured after import', async () => {
    rs.stubEnv('FORCE_COLOR', undefined);
    rs.stubEnv('NO_COLOR', undefined);
    rs.stubEnv('NODE_DISABLE_COLORS', undefined);

    try {
      rs.resetModules();
      const { createLogger: createConfiguredLogger } =
        await import('../src/index.js');
      const log = rs.fn();

      rs.stubEnv('FORCE_COLOR', '1');
      createConfiguredLogger({
        console: { log, warn: rs.fn(), error: rs.fn() },
      }).info('hello');

      expect(log).toHaveBeenCalledWith(expect.stringContaining('\x1b'));
    } finally {
      rs.unstubAllEnvs();
      rs.resetModules();
    }
  });

  test('should log as expected', () => {
    console.log = rs.fn();
    console.warn = rs.fn();
    console.error = rs.fn();

    printTestLogs(logger);

    [console.log, console.warn, console.error].forEach((consoleFn) => {
      expect(
        (consoleFn as Mock).mock.calls.map((items) =>
          items.map((item) => stripAnsi(item.toString())),
        ),
      ).toMatchSnapshot();
    });
  });

  test('should create new logger with info level correctly', () => {
    console.log = rs.fn();
    console.warn = rs.fn();
    console.error = rs.fn();

    const logger = createLogger({
      level: 'info',
    });

    printTestLogs(logger);

    [console.log, console.warn, console.error].forEach((consoleFn) => {
      expect(
        (consoleFn as Mock).mock.calls.map((items) =>
          items.map((item) => stripAnsi(item.toString())),
        ),
      ).toMatchSnapshot();
    });
  });

  test('should create new logger with warn level correctly', () => {
    console.warn = rs.fn();
    console.error = rs.fn();

    const logger = createLogger({
      level: 'warn',
    });

    printTestLogs(logger);

    expect(
      (console.warn as Mock).mock.calls.map((items) =>
        items.map((item) => stripAnsi(item.toString())),
      ),
    ).toMatchSnapshot();
    expect(
      (console.error as Mock).mock.calls.map((items) =>
        items.map((item) => stripAnsi(item.toString())),
      ),
    ).toMatchSnapshot();
  });

  test('should prepend prefix correctly', () => {
    console.log = rs.fn();
    console.warn = rs.fn();
    console.error = rs.fn();

    const logger = createLogger({
      prefix: '[web]',
      level: 'verbose',
    });

    printTestLogs(logger);

    [console.log, console.warn, console.error].forEach((consoleFn) => {
      expect(
        (consoleFn as Mock).mock.calls.map((items) =>
          items.map((item) => stripAnsi(item.toString())),
        ),
      ).toMatchSnapshot();
    });
  });

  test('should log error with stack correctly', () => {
    console.error = rs.fn();

    const err = new Error('this is an error message');

    err.stack = '    at /rslog/foo/bar.js:29:0';

    logger.error(err);

    expect(
      stripAnsi((console.error as Mock).mock.calls[0][0].toString()),
    ).toMatchSnapshot();
  });

  test('should log error with cause correctly', () => {
    console.error = rs.fn();

    const err = new Error('this is an error message with cause', {
      cause: getErrorCause(),
    });

    err.stack = '    at /rslog/foo/bar.js:29:0';

    logger.error(err);

    expect(
      stripAnsi((console.error as Mock).mock.calls[0][0].toString()),
    ).toMatchSnapshot();
  });

  test('should create new logger with silent level correctly', () => {
    console.log = rs.fn();

    const logger = createLogger({
      level: 'silent',
    });

    printTestLogs(logger);

    expect((console.log as Mock).mock.calls.length).toBe(0);
  });

  test('should use custom console correctly', () => {
    console.log = rs.fn();
    console.warn = rs.fn();
    console.error = rs.fn();

    const customConsole = {
      log: rs.fn(),
      warn: rs.fn(),
      error: rs.fn(),
    };

    const logger = createLogger({
      console: customConsole,
    });

    printTestLogs(logger);

    [customConsole.log, customConsole.warn, customConsole.error].forEach(
      (consoleFn) => {
        expect(
          (consoleFn as Mock).mock.calls.map((items) =>
            items.map((item) => stripAnsi(item.toString())),
          ),
        ).toMatchSnapshot();
      },
    );

    expect((console.log as Mock).mock.calls.length).toBe(0);
    expect((console.warn as Mock).mock.calls.length).toBe(0);
    expect((console.error as Mock).mock.calls.length).toBe(0);
  });

  test('should expose original logger options correctly', () => {
    const customConsole = {
      log: rs.fn(),
      warn: rs.fn(),
      error: rs.fn(),
    };

    const logger = createLogger({
      prefix: '[web]',
      level: 'warn',
      console: customConsole,
    });

    logger.level = 'verbose';

    expect(logger.options).toEqual({
      prefix: '[web]',
      level: 'warn',
      console: customConsole,
    });
  });

  test('should greet with a bold mint color in true-color terminals', async () => {
    const originalIsTTY = Object.getOwnPropertyDescriptor(
      process.stdout,
      'isTTY',
    );
    const originalHasColors = Object.getOwnPropertyDescriptor(
      process.stdout,
      'hasColors',
    );
    const hasColors = rs.fn(() => true);
    const customConsole = {
      log: rs.fn(),
      warn: rs.fn(),
      error: rs.fn(),
    };

    Object.defineProperties(process.stdout, {
      isTTY: { configurable: true, value: true },
      hasColors: { configurable: true, value: hasColors },
    });

    try {
      rs.resetModules();
      const { createLogger: createTrueColorLogger } =
        await import('../src/index.js');

      createTrueColorLogger({ console: customConsole }).greet('hello');

      expect((customConsole.log as Mock).mock.calls[0][0]).toBe(
        '\x1b[1;38;2;132;225;199mhello\x1b[39;22m',
      );
      expect(hasColors).toHaveBeenCalledWith(2 ** 24, process.env);
    } finally {
      if (originalIsTTY) {
        Object.defineProperty(process.stdout, 'isTTY', originalIsTTY);
      } else {
        Reflect.deleteProperty(process.stdout, 'isTTY');
      }
      if (originalHasColors) {
        Object.defineProperty(process.stdout, 'hasColors', originalHasColors);
      } else {
        Reflect.deleteProperty(process.stdout, 'hasColors');
      }
      rs.resetModules();
    }
  });

  test('should align multi-line messages when alignMultiline is enabled', () => {
    console.log = rs.fn();
    console.error = rs.fn();

    const alignLogger = createLogger({ alignMultiline: true });

    alignLogger.info(`User profile updated:
- Name: John Doe
- Email: john@example.com`);

    expect(
      (console.log as Mock).mock.calls.map((items) =>
        items.map((item) => stripAnsi(item.toString())),
      ),
    ).toMatchSnapshot();
  });

  test('should align multi-line messages to label + prefix column', () => {
    console.log = rs.fn();

    const alignLogger = createLogger({
      alignMultiline: true,
      prefix: '[web]',
    });

    alignLogger.info(`User profile updated:
- Name: John Doe
- Email: john@example.com`);

    expect(
      (console.log as Mock).mock.calls.map((items) =>
        items.map((item) => stripAnsi(item.toString())),
      ),
    ).toMatchSnapshot();
  });

  test('should align multi-line log messages to prefix column', () => {
    console.log = rs.fn();

    const alignLogger = createLogger({
      alignMultiline: true,
      prefix: '[web]',
    });

    alignLogger.log(`First line
Second line`);

    expect(stripAnsi((console.log as Mock).mock.calls[0][0].toString()))
      .toBe(`[web] First line
      Second line`);
  });

  test('should keep error stacks top-aligned when alignMultiline is enabled', () => {
    console.error = rs.fn();

    const alignLogger = createLogger({ alignMultiline: true });

    alignLogger.error(`Something failed:
- reason A
    at /rslog/foo/bar.js:29:0
- reason B`);

    expect(
      (console.error as Mock).mock.calls.map((items) =>
        items.map((item) => stripAnsi(item.toString())),
      ),
    ).toMatchSnapshot();
  });

  test('should not align Error object output when alignMultiline is enabled', () => {
    console.error = rs.fn();

    const alignLogger = createLogger({ alignMultiline: true });

    const err = new Error('this is an error message with cause', {
      cause: getErrorCause(),
    });
    err.stack = '    at /rslog/foo/bar.js:29:0';

    alignLogger.error(err);

    expect(
      stripAnsi((console.error as Mock).mock.calls[0][0].toString()),
    ).toMatchSnapshot();
  });

  test('should keep grayed error stack un-indented and colored when alignMultiline is enabled', () => {
    console.error = rs.fn();

    const alignLogger = createLogger({ alignMultiline: true });

    alignLogger.error(`Something failed:
    at /rslog/foo/bar.js:29:0
- reason B`);

    const raw = (console.error as Mock).mock.calls[0][0].toString();
    const lines = raw.split('\n');

    expect(lines[1]).toContain(String.fromCharCode(27));
    expect(stripAnsi(lines[1]).startsWith('    at ')).toBe(true);
    expect(stripAnsi(lines[2]).startsWith('        - reason B')).toBe(true);
  });

  test('should align stack-like lines in non-error levels (no stack exemption)', () => {
    console.log = rs.fn();

    const alignLogger = createLogger({ alignMultiline: true });

    alignLogger.info(`Deploy summary:
- deployed at server:443:8080
- status: ok`);

    const lines = stripAnsi(
      (console.log as Mock).mock.calls[0][0].toString(),
    ).split('\n');

    expect(lines[0].startsWith('info    Deploy summary:')).toBe(true);
    expect(lines[1].startsWith('        - deployed at server:443:8080')).toBe(
      true,
    );
    expect(lines[2].startsWith('        - status: ok')).toBe(true);
  });

  test('should not add trailing whitespace on blank lines when alignMultiline is enabled', () => {
    console.log = rs.fn();

    const alignLogger = createLogger({ alignMultiline: true });

    alignLogger.info(`Part 1

Part 2`);

    const lines = (console.log as Mock).mock.calls[0][0].toString().split('\n');

    expect(lines[1]).toBe('');
  });
});
