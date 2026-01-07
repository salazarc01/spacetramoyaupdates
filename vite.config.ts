
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
    'process.platform': JSON.stringify('browser')
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
});
