import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3020, // Frontend development server port
    strictPort: true, // Always use port 3020 for frontend
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3021', // Backend API
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
