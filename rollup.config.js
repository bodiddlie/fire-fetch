import babel from 'rollup-plugin-babel';
import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';

const externals = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const makeExternalPredicate = externalsArr => {
  if (externalsArr.length === 0) {
    return () => false;
  }
  const extenralPattern = new RegExp(`^(${externalsArr.join('|')})($|/)`);
  return id => extenralPattern.test(id);
};

export default {
  input: 'src/index.js',
  external: makeExternalPredicate(externals),
  plugins: [
    babel({ plugins: ['external-helpers'] }),
    resolve({ extensions: ['.js', '.jsx'] }),
  ],
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' },
  ],
};
