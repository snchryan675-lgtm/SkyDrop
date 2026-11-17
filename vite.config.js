import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: { host: '0.0.0.0', port: 5173, strictPort: true, allowedHosts: true, proxy: { '/api': { target: 'http://127.0.0.1:3000' } } },
  preview: { host: '0.0.0.0', port: 5173, allowedHosts: true, proxy: { '/api': { target: 'http://127.0.0.1:3000' } } },
});
