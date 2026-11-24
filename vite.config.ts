import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Only the exact preview host handed to this VM is allowed; nothing wildcarded.
const allowedHosts = process.env.PREVIEW_HOST ? [process.env.PREVIEW_HOST] : []

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    allowedHosts,
  },
})
