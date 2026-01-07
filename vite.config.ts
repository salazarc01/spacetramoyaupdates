
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Permite que el código acceda a process.env como se requiere en las guías de Gemini
    'process.env': process.env
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html'
    }
  }
});
