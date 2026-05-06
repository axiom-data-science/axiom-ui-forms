import { defineConfig as defineViteConfig, mergeConfig } from ***REMOVED***vite***REMOVED***;
import { defineConfig as defineVitestConfig } from ***REMOVED***vitest/config***REMOVED***
import react from ***REMOVED***@vitejs/plugin-react***REMOVED***
import tailwindcss from "@tailwindcss/vite";


// https://vitejs.dev/config/
const viteonfig = defineViteConfig({
  plugins: [
    react(),
    tailwindcss()

  ],
  // Add any CRACO-specific configurations here, adapted for Vite
  resolve: {
    alias: {
      ***REMOVED***@***REMOVED***: ***REMOVED***/src/***REMOVED***,
      ***REMOVED***@Components***REMOVED***: ***REMOVED***/src/Components/***REMOVED***,
      ***REMOVED***@State***REMOVED***: ***REMOVED***/src/State/***REMOVED***
    },
    // Prefer module field over main field; some @axdspub packages have broken main fields
    mainFields: [***REMOVED***module***REMOVED***, ***REMOVED***jsnext:main***REMOVED***, ***REMOVED***jsnext***REMOVED***, ***REMOVED***main***REMOVED***]
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
    globals: true, // Enable global access to Vitest utilities
    environment: ***REMOVED***jsdom***REMOVED***,
    setupFiles: "./src/tests/setup.ts",
}});

export default mergeConfig(viteonfig, vitestConfig)


