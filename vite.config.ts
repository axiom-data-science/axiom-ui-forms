import { defineConfig as defineViteConfig, mergeConfig } from ***REMOVED***vite***REMOVED***;
import { defineConfig as defineVitestConfig } from ***REMOVED***vitest/config***REMOVED***
import react from ***REMOVED***@vitejs/plugin-react***REMOVED***
import tailwindcss from ***REMOVED***tailwindcss***REMOVED***


// https://vitejs.dev/config/
const viteonfig = defineViteConfig({
  plugins: [
    react(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  // Add any CRACO-specific configurations here, adapted for Vite
  resolve: {
    alias: {
      ***REMOVED***@***REMOVED***: ***REMOVED***/src/***REMOVED***,
      ***REMOVED***@Components***REMOVED***: ***REMOVED***/src/Components/***REMOVED***,
      ***REMOVED***@State***REMOVED***: ***REMOVED***/src/State/***REMOVED***
    }
  },
  server: {
    port: 3080,
    watch: {
      usePolling: true
    }
  }
})

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: ***REMOVED***jsdom***REMOVED***,
    setupFiles: "./src/tests/setup.ts"
}});

export default mergeConfig(viteonfig, vitestConfig)


