import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    allowedHosts: ['routes-quad-bonds-feelings.trycloudflare.com']
  },
  build: { target: 'es2020' }
});
