import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from parent directory
  const env = loadEnv(mode, '../', '')
  
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_APP_PORT) || 5173,
    },
    envDir: '../',
  }
})
