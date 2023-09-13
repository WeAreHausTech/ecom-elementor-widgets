import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'demo',
  root: './demo',
  build: {
    rollupOptions: {
      input: {
        app: './demo/index.html',
        css: './demo/index.scss',
      },
    },
  },
})
