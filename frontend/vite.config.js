import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-redirect-file',
      writeBundle() {
        // Copy _redirects file to build output
        fs.copyFileSync(
          resolve(__dirname, 'public/_redirects'),
          resolve(__dirname, 'dist/_redirects')
        )
      }
    }
  ],
  base:'/',
  define: {
    global: 'window',
  },
})