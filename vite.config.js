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
})
