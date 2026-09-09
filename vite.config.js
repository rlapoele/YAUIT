import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';

const repositoryRoot = fileURLToPath(new URL('.', import.meta.url));
const exampleRoot = fileURLToPath(
  new URL('./examples/todo-step-2', import.meta.url)
);

export default defineConfig({
  root: exampleRoot,
  server: {
    fs: {
      allow: [repositoryRoot]
    }
  },
  build: {
    outDir: fileURLToPath(new URL('./dist/todo-step-2', import.meta.url)),
    emptyOutDir: true
  }
});
