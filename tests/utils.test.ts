import { isErrorStackMessage } from '../src/utils.js';

describe('isErrorStackMessage', () => {
  test('should test error stack message correctly', () => {
    expect(
      isErrorStackMessage('    at /rslog/packages/foo/bar.js:29:251'),
    ).toBeTruthy();

    expect(
      isErrorStackMessage(
        '    at Object.call (/rslog/packages/foo/bar.js:19:28)',
      ),
    ).toBeTruthy();

    expect(
      isErrorStackMessage(
        '    at async Command.<anonymous> (rslog/packages/foo/dist/index.js:55:5)',
      ),
    ).toBeTruthy();

    expect(isErrorStackMessage('             at async Promise.all (index 0)')).toBeTruthy();

    expect(
      isErrorStackMessage('    at transform.next (<anonymous>)'),
    ).toBeTruthy();

    expect(isErrorStackMessage('    at Array.map (<anonymous>)')).toBeTruthy();

    expect(
      isErrorStackMessage('    error   TypeError: foo.some is not a function'),
    ).toBeFalsy();

    expect(
      isErrorStackMessage('        │     at new Promise (<anonymous>)'),
    ).toBeTruthy();

    expect(
      isErrorStackMessage(
        '        │     at runSyncOrAsync (node:internal/util:427:12)',
      ),
    ).toBeTruthy();
  });
});
