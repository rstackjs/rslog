import { defineConfig, ts } from '@rslint/core';

export default defineConfig([
  { ignores: ['**/dist/**'] },
  ts.configs.recommended,
]);
