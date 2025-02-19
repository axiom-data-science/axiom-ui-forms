import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
import nodePolyfills from 'rollup-plugin-polyfill-node'
// import packageJson from './package.json'

const globals = {
  'react/jsx-runtime': 'JSXRuntime',
  react: 'React',
  'react-dom': 'ReactDOM',
  lodash: 'lodash'
}

const external = [
  'react',
  'react-dom',
  'react-scripts',
  'react/jsx-runtime',
  'lodash'
]

const config = [
  {
    external,
    input: 'src/library.ts',
    onwarn: function (warning, warn) {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
        return
      }
      // got same warning as with d3.. assuming same deal for now (bostock sez: it's allowed in the spec, not gonna fix. just supress it)
      // https://github.com/d3/d3-selection/issues/168#issuecomment-451983830
      if (warning.code === 'CIRCULAR_DEPENDENCY') return

      // rollup says - what do you expect to happen with eval? make sure code isn't evil https://github.com/rollup/rollup/issues/4366#issuecomment-1023346209
      // cesium says - there's a reason we use eval and (I'm assuming they aren't particularly evil)
      // also, it sounds like they're getting close to removing eval
      // https://github.com/CesiumGS/cesium/issues/9024#issuecomment-1533025563 and https://github.com/CesiumGS/cesium/issues/9473 (and FF blocker https://bugzilla.mozilla.org/show_bug.cgi?id=1247687)
      if (warning.code === 'EVAL') return

      warn(warning)
    },
    output: [
      /* {
        file: 'library/cjs.js',
        format: 'cjs',
        sourcemap: true,
        globals
      }, */
      {
        file: 'library/index.js',
        format: 'es',
        sourcemap: true,
        globals
      },
      /* {
        file: 'library/browser.js',
        format: 'iife',
        name: 'AxiomUIforms',
        sourcemap: true,
        globals
      }, */
      {
        file: 'library/umd.js',
        format: 'umd',
        name: 'AxiomUIforms',
        sourcemap: true,
        globals
      }
    ],
    plugins: [
      nodePolyfills(),
      json(),
      resolve({ preferBuiltins: false, browser: true }),
      commonjs(),
      alias({
        entries: {
          '@/*': './src'
        }
      }),
      typescript({ tsconfig: './tsconfig.json' })
    ]
  },
  {
    external,
    input: 'src/library.ts',
    output: [{
      file: 'library/axiom-ui-forms.d.ts',
      format: 'esm',
      globals
    }],
    plugins: [
      json(),
      dts({
        compilerOptions: {
          // enabling declaration (.d.ts) emit
          declaration: true,

          // optional - in general it's a good practice to decouple declaration files from your actual transpiled JavaScript files
          declarationDir: 'library',

          // optional if you're using babel to transpile TS -> JS
          emitDeclarationOnly: true,

          paths: {
            '@/*': [
              './src/*'
            ]
          }
        }
      })
    ]
  }
]

export default config
