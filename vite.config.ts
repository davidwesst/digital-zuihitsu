import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist', // Output to project root's dist directory
    emptyOutDir: true, // Optional: cleans the output dir before building
  }
})