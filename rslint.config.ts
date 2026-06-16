import { defineConfig, js, ts } from '@rslint/core';

export default defineConfig([
  { ignores: ['**/dist/**'] },
  js.configs.recommended,
  ts.configs.recommended,
]);
