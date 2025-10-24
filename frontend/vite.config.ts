import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000, // Development server port (will auto-increment if busy)
    strictPort: false, // Allow Vite to find next available port
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3004', // Backend API
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
