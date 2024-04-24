const path = require(***REMOVED***path***REMOVED***)


// someday, clean up the the FOUR! repeated declarations of aliases (others are is in tsconfig.paths.json => tsconfig.json and .storybook/main.ts)
// https://stackoverflow.com/a/71892901

module.exports = {
  webpack: {
    eslint: {
      enable: false
    },
    alias: {
      ***REMOVED***@***REMOVED***: path.resolve(__dirname, ***REMOVED***src/***REMOVED***),
      ***REMOVED***@Components***REMOVED***: path.resolve(__dirname, ***REMOVED***src/Components***REMOVED***),
      ***REMOVED***@State***REMOVED***: path.resolve(__dirname, ***REMOVED***src/State***REMOVED***)
    },
    configure: {
      ignoreWarnings: [/Failed to parse source map/],
      resolve: {
        fallback: {
          https: false,
          http: false,
          path: false,
          zlib: false
        }
      },
      module: {
        // this silences a warning (Critical dependency: require function is used in a way in which dependencies cannot be statically extracted) that comes up with the cesium build included with @axdspubs/axiom-maps
        unknownContextCritical: false
      }
    }
  },
  jest: {
    configure: {
      verbose: true,
      moduleNameMapper: {
        ***REMOVED***^@/(.*)$***REMOVED***: ***REMOVED***<rootDir>/src/$1***REMOVED***,
        ***REMOVED***^@State/(.*)$***REMOVED***: ***REMOVED***<rootDir>/src/State/$1***REMOVED***
      }
    }
  }
}
