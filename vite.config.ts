import { defineConfig } from 'vite';
// import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  worker: {
    format: "es"
  },
  server: {
    open: 'index.html',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2022",
    }
  },
  build: {
    sourcemap: false,
    assetsDir: "code",
    cssMinify: true,
    target: "esnext",
    
    rollupOptions: {
      output: {
        format: "es",
      },
    }
  },
  plugins: [
  ]
})