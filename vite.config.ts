import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        // React and the router go in their own long-cache chunk so menu edits
        // (the file that actually changes) never bust the vendor cache.
        // The animation library is deliberately NOT pinned here: forcing it
        // into a chunk would undo the dynamic import in src/lib/motionFeatures.ts
        // and pull the whole feature bundle back onto the critical path.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) return 'react';
        },
      },
    },
  },
  server: { port: 5173, strictPort: false },
});
