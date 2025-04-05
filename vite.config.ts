import { defineConfig as defineViteConfig, mergeConfig } from 'vite';
import { defineConfig as defineVitestConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'


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

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: "./src/tests/setup.ts"
}});

export default mergeConfig(viteonfig, vitestConfig)


