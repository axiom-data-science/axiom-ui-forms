import resolve from ***REMOVED***@rollup/plugin-node-resolve***REMOVED***
import commonjs from ***REMOVED***@rollup/plugin-commonjs***REMOVED***
import typescript from ***REMOVED***@rollup/plugin-typescript***REMOVED***
import dts from ***REMOVED***rollup-plugin-dts***REMOVED***
import json from ***REMOVED***@rollup/plugin-json***REMOVED***
import alias from ***REMOVED***@rollup/plugin-alias***REMOVED***
import nodePolyfills from ***REMOVED***rollup-plugin-polyfill-node***REMOVED***
// import packageJson from ***REMOVED***./package.json***REMOVED***

const globals = {
  ***REMOVED***react/jsx-runtime***REMOVED***: ***REMOVED***JSXRuntime***REMOVED***,
  react: ***REMOVED***React***REMOVED***,
  ***REMOVED***react-dom***REMOVED***: ***REMOVED***ReactDOM***REMOVED***,
  lodash: ***REMOVED***lodash***REMOVED***
}

const external = [
  ***REMOVED***react***REMOVED***,
  ***REMOVED***react-dom***REMOVED***,
  ***REMOVED***react-scripts***REMOVED***,
  ***REMOVED***react/jsx-runtime***REMOVED***,
  ***REMOVED***lodash***REMOVED***
]

const config = [
  {
    external,
    input: ***REMOVED***src/library.ts***REMOVED***,
    onwarn: function (warning, warn) {
      if (warning.code === ***REMOVED***MODULE_LEVEL_DIRECTIVE***REMOVED***) {
        return
      }
      // got same warning as with d3.. assuming same deal for now (bostock sez: it***REMOVED***s allowed in the spec, not gonna fix. just supress it)
      // https://github.com/d3/d3-selection/issues/168#issuecomment-451983830
      if (warning.code === ***REMOVED***CIRCULAR_DEPENDENCY***REMOVED***) return

      // rollup says - what do you expect to happen with eval? make sure code isn***REMOVED***t evil https://github.com/rollup/rollup/issues/4366#issuecomment-1023346209
      // cesium says - there***REMOVED***s a reason we use eval and (I***REMOVED***m assuming they aren***REMOVED***t particularly evil)
      // also, it sounds like they***REMOVED***re getting close to removing eval
      // https://github.com/CesiumGS/cesium/issues/9024#issuecomment-1533025563 and https://github.com/CesiumGS/cesium/issues/9473 (and FF blocker https://bugzilla.mozilla.org/show_bug.cgi?id=1247687)
      if (warning.code === ***REMOVED***EVAL***REMOVED***) return

      warn(warning)
    },
    output: [
      /* {
        file: ***REMOVED***library/cjs.js***REMOVED***,
        format: ***REMOVED***cjs***REMOVED***,
        sourcemap: true,
        globals
      }, */
      {
        file: ***REMOVED***library/index.js***REMOVED***,
        format: ***REMOVED***es***REMOVED***,
        sourcemap: true,
        globals
      },
      /* {
        file: ***REMOVED***library/browser.js***REMOVED***,
        format: ***REMOVED***iife***REMOVED***,
        name: ***REMOVED***AxiomUIforms***REMOVED***,
        sourcemap: true,
        globals
      }, */
      {
        file: ***REMOVED***library/umd.js***REMOVED***,
        format: ***REMOVED***umd***REMOVED***,
        name: ***REMOVED***AxiomUIforms***REMOVED***,
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
          ***REMOVED***@/****REMOVED***: ***REMOVED***./src***REMOVED***
        }
      }),
      typescript({ tsconfig: ***REMOVED***./tsconfig.json***REMOVED*** })
    ]
  },
  {
    external,
    input: ***REMOVED***src/library.ts***REMOVED***,
    output: [{
      file: ***REMOVED***library/axiom-ui-forms.d.ts***REMOVED***,
      format: ***REMOVED***esm***REMOVED***,
      globals
    }],
    plugins: [
      json(),
      dts({
        compilerOptions: {
          // enabling declaration (.d.ts) emit
          declaration: true,

          // optional - in general it***REMOVED***s a good practice to decouple declaration files from your actual transpiled JavaScript files
          declarationDir: ***REMOVED***library***REMOVED***,

          // optional if you***REMOVED***re using babel to transpile TS -> JS
          emitDeclarationOnly: true,

          paths: {
            ***REMOVED***@/****REMOVED***: [
              ***REMOVED***./src/****REMOVED***
            ]
          }
        }
      })
    ]
  }
]

export default config
