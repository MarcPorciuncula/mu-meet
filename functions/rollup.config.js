import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import fs from 'fs';
import path from 'path';

const pkgPath = path.resolve(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath).toString());

export default {
  entry: 'src/index.js',
  format: 'cjs',
  dest: 'index.js',
  external: Object.keys(pkg.dependencies),
  plugins: [
    resolve({ main: true }),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({ exclude: 'node_modules/**' }),
  ],
};
