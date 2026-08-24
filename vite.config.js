import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-redirects',
      closeBundle() {
        // Copy _redirects to dist after build
        const src = resolve(__dirname, 'public', '_redirects');
        const destDir = resolve(__dirname, 'dist');
        const dest = resolve(destDir, '_redirects');
        
        if (existsSync(src)) {
          // Ensure dist exists
          if (!existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true });
          }
          copyFileSync(src, dest);
          console.log('✅ _redirects copied to dist/');
        } else {
          console.warn('⚠️ _redirects not found in public/');
        }
      }
    }
  ],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Ensure _redirects is treated as an asset
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === '_redirects') {
            return '_redirects';
          }
          return 'assets/[name]-[hash].[ext]';
        }
      }
    }
  }
})