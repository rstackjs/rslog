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

    expect((console.error as Mock).mock.calls[0][0]).toMatchSnapshot();
  });

  test('should log error with cause correctly', () => {
    console.error = rs.fn();

    const err = new Error('this is an error message with cause', {
      cause: getErrorCause(),
    });

    err.stack = '    at /rslog/foo/bar.js:29:0';

    logger.error(err);

    expect((console.error as Mock).mock.calls[0][0]).toMatchSnapshot();
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
});
