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
  'react-router-dom': 'reactRouterDom',
  '@tanstack/react-query': 'reactQuery'
}

const external = [
  'react',
  'react-dom',
  'react-scripts',
  'react/jsx-runtime',
  'react-router-dom',
  '@tanstack/react-query'
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

      warn(warning)
    },
    output: [
      {
        dir: 'library',
        entryFileNames: 'cjs.js',
        format: 'cjs',
        sourcemap: true,
        globals
      },
      {
        dir: 'library',
        entryFileNames: 'index.esm.js',
        format: 'esm',
        sourcemap: true,
        globals
        // preserveModules: true
      }
      /* {
        dir: 'library/esm',
        format: 'esm',
        sourcemap: true,
        chunkFileNames: 'chunks/[name]-[hash].js',
        preserveModules: true,
        // inlineDynamicImports: true,
        globals
      } *///,
      /* {
        file: 'library/browser.js',
        format: 'iife',
        name: 'AxiomUIforms',
        sourcemap: true,
        globals
      }, */
      /* {
        dir: 'library/umd',
        format: 'umd',
        name: 'AxiomUIforms',
        sourcemap: true,
        // inlineDynamicImports: true,
        globals
      } */
    ],
    plugins: [
      nodePolyfills(),
      json(),
      resolve({ preferBuiltins: false, browser: true }),
      commonjs(),
      /* babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-react']
      }), */
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
