import { defineConfig } from ***REMOVED***vite***REMOVED***
import react from ***REMOVED***@vitejs/plugin-react***REMOVED***
import tailwindcss from ***REMOVED***tailwindcss***REMOVED***


// https://vitejs.dev/config/
export default defineConfig({
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
    port: 3080
  }
})
