import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import visualizer from 'rollup-plugin-visualizer';
import pkg from './package.json';

export default {
  input: './src/snapbox.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'default'
    },
    {
      file: pkg.module,
      format: 'esm'
    }
  ],
  plugins: [
    external(),
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs(),
    visualizer()
  ]
};
