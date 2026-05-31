import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, InlineConfig, UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

interface VitestConfigExport extends UserConfig {
  test: InlineConfig;
}

export default defineConfig({
  root: __dirname,
  plugins: [
    react(),
    vanillaExtractPlugin(),
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
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/__tests__/**',
      ],
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: resolve(__dirname, './vitest.setup.ts'),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/index.ts'),
      name: 'ComponentKits',
      fileName: 'index',
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
    emptyOutDir: true,
  },
} as VitestConfigExport);
