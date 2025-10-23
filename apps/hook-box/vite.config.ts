import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: __dirname,
  plugins: [
    react(),
    tsconfigPaths(),
    dts({
      rollupTypes: true,
      root: resolve(__dirname),
      tsconfigPath: resolve(__dirname, './tsconfig.app.json'),
      entryRoot: resolve(__dirname, 'src'),
      include: [resolve(__dirname, 'src/**/*.{ts,tsx}')],
      insertTypesEntry: true,
      exclude: [
        '**/*.stories.tsx',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/__tests__/**',
        'App.tsx',
        'main.tsx',
      ],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'HookKit',
      fileName: 'index',
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    emptyOutDir: true,
  },
});
