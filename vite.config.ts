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
  build: {
    sourcemap: false,
    assetsDir: "code",
    minify: "terser",
    cssMinify: true,
    target: ["edge118", "firefox116", "chrome118", "safari16" ],
    lib: {
        entry: "src/my-element.ts",
        formats: ["es"] 
    },
    rollupOptions: {
      output: {
        format: "es",
      },
    }
  },
  plugins: [
  ]
})