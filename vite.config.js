import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'default',
        ref: true,
        titleProp: true,
        replaceAttrValues: { '#000': 'currentColor' }
      },
      include: '**/*.svg?react',
    }),
  ],
  define: {
    // Exponer variables de entorno sin el prefijo VITE_
    'import.meta.env.ADMIN_USERNAME': JSON.stringify(process.env.ADMIN_USERNAME),
    'import.meta.env.ADMIN_PASSWORD': JSON.stringify(process.env.ADMIN_PASSWORD),
    'import.meta.env.ADMIN_USERNAME_ALT': JSON.stringify(process.env.ADMIN_USERNAME_ALT),
    'import.meta.env.ADMIN_PASSWORD_ALT': JSON.stringify(process.env.ADMIN_PASSWORD_ALT),
  },
})
