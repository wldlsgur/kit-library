import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.js', format: 'es' },
    { file: 'dist/index.cjs', format: 'cjs' },
  ],
  external: ['@babel/core'],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
      emitDeclarationOnly: false,
    }),
  ],
};
