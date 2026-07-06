import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'TS6133' || warning.code === 'TS2345') return
        warn(warning)
      }
    }
  }
})
