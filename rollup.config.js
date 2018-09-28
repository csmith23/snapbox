import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
const config = {
  input: 'src/snapbox.js',
  external: ['react', 'react-jss', 'prop-types', 'classnames'],
  output: {
    format: 'umd',
    name: 'snapbox',
    globals: { react: 'React' }
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    terser()
  ]
}

export default config
