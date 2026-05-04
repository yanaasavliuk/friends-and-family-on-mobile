import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/friends-and-family-on-mobile/',
  plugins: [vue()],
  cacheDir: '/tmp/vite-cache',
  server: {
    watch: {
      usePolling: true,
      interval: 500,
    },
  },
})
