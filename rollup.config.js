import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  dest: 'dist/bundle.js',
  format: 'umd',
  globals: {

  },
  plugins: [ babel()]
};