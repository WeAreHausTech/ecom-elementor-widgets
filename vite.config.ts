import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {}
  },
  plugins: [react()],
  build: {
    outDir: 'dist',
    manifest: true,
    lib: {
      entry: 'components/index.tsx',
      name: 'ecom-components',
      formats: ['es'],
      // fileName: 'index'
    },
    rollupOptions: {
      // external: ['react', 'react-dom'],
      output: {
        inlineDynamicImports: false,
        // manualChunks: { 'ecom': ['@haus-tech/ecom-components'] },
        entryFileNames: '[name]-[hash].js',   // currently does not work for the legacy bundle
        assetFileNames: '[name]-[hash].[ext]', // currently does not work for images
        chunkFileNames: '[name]-[hash].js',
      },
    }
  }
})