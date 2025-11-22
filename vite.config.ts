import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    glsl()
  ],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@interface': path.resolve(__dirname, 'src/interface'),
      '@state': path.resolve(__dirname, 'src/state'),
      '@webgl': path.resolve(__dirname, 'src/webgl'),
      '@styles': path.resolve(__dirname, 'src/styles'),
    }
  }
})