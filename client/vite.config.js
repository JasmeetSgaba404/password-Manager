import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
  proxy: {
    '/login': 'http://localhost:5005',
    '/vault': 'http://localhost:5005',
    '/signup': 'http://localhost:5005',
    '/logout': 'http://localhost:5005'
  }
}
})
