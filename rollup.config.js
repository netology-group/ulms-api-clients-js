import babel from 'rollup-plugin-babel'
import cjs from 'rollup-plugin-commonjs'
import npm from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import { terser as uglify } from 'rollup-plugin-terser'

import babelrc from './.babelrc.json'
import { name as pkgname, directories, peerDependencies } from './package.json'

const entry = process.env.ENTRY || 'index'
const environment = process.env.NODE_ENV || 'development'

const uglifyOptions = {
  compress: {
    drop_console: true,
    pure_getters: true,
    unsafe_comps: true,
    warnings: false
  }
}

const shouldUglify = (options = uglifyOptions, minifier) => environment === 'production' ? uglify(options, minifier) : []

const nameToGlobal = name => name.split(/[@/-]/).filter(_ => _).map(_ => _.slice(0, 1).toUpperCase() + _.slice(1)).join('')

const dist = (name = nameToGlobal(pkgname)) => ({
  input: `${directories.lib}/${entry}.js`,
  output: {
    exports: 'named',
    format: 'umd',
    name,
    globals: {
      uuid: 'uuid'
    }
  },
  external: _ => Object.keys(peerDependencies).includes(_),
  plugins: [
    npm({ browser: true, node: true, preferBuiltins: false }),
    cjs(),
    babel({
      babelrc: false,
      presets: babelrc.env.rollup.presets || [],
      plugins: [...(babelrc.plugins || []), ...(babelrc.env.rollup.plugins || [])]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(environment)
    }),
    shouldUglify()
  ]
})

export default dist()
