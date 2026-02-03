import { defineConfig } from '@rstest/core';

process.env.NO_COLOR = '1';

export default defineConfig({
  globals: true,
});
