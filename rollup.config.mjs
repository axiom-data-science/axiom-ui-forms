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
