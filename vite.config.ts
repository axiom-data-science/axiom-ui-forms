import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'


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
      '@': '/src/',
      '@Components': '/src/Components/',
      '@State': '/src/State/'
    }
  },
  server: {
    port: 3080,
    watch: {
      usePolling: true
    }
  }
})
