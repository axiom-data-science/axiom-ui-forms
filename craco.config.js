const path = require('path')

// someday, clean up the the FOUR! repeated declarations of aliases (others are is in tsconfig.paths.json => tsconfig.json and .storybook/main.ts)
// https://stackoverflow.com/a/71892901

module.exports = {
  webpack: {
    eslint: {
      enable: false
    },
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@Components': path.resolve(__dirname, 'src/Components'),
      '@State': path.resolve(__dirname, 'src/State')
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
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@Components/(.*)$': '<rootDir>/src/State/$1',
        '^@State/(.*)$': '<rootDir>/src/State/$1'
      }
    }
  }
}
