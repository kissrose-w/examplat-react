import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import eslint from 'vite-plugin-eslint'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        // http://10.55.5.77:8001
        // http://39.96.210.90:8001
        // http://192.168.28.11:3001
<<<<<<< HEAD
        // http://39.96.210.90:8002
        target: 'http://39.96.210.90:8002',
=======
        target: 'http://192.168.28.11:3001',
>>>>>>> master
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
