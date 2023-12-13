import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import terser from '@rollup/plugin-terser'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {}
  },
  plugins: [react(), terser()],
  build: {
    outDir: 'dist',
    manifest: true,
    minify: 'terser',
    lib: {
      entry: 'components/index.tsx',
      name: 'ecom-components',
      formats: ['es'],
      // fileName: 'index'
    },
    rollupOptions: {
      // external: ['react', 'react-dom'],
      output: {
        compact: true,
        inlineDynamicImports: false,
        format: 'es',
        minifyInternalExports: true,
        // manualChunks: { 'ecom': ['@haus-tech/ecom-components'] },
        entryFileNames: '[name]-[hash].js',   // currently does not work for the legacy bundle
        assetFileNames: '[name]-[hash].[ext]', // currently does not work for images
        chunkFileNames: '[name]-[hash].js',
      },
    }
  }
})