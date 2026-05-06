import { defineConfig as defineViteConfig, mergeConfig } from 'vite';
import { defineConfig as defineVitestConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
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
      '@': '/src/',
      '@Components': '/src/Components/',
      '@State': '/src/State/'
    },
    // Prefer module field over main field; some @axdspub packages have broken main fields
    mainFields: ['module', 'jsnext:main', 'jsnext', 'main']
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
    environment: 'jsdom',
    setupFiles: "./src/tests/setup.ts",
}});

export default mergeConfig(viteonfig, vitestConfig)


