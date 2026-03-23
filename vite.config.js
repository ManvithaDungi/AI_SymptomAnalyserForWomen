import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
    singleFork: true,
    deps: {
      inline: ['html-encoding-sniffer', '@exodus/bytes']
    }
  },
  server: {
    port: 3000,
  },
})
