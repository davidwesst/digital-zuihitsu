import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist', // Output to project root's dist directory
    emptyOutDir: true, // Optional: cleans the output dir before building
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./src/index.html', import.meta.url)),
        blog: fileURLToPath(new URL('./src/blog.html', import.meta.url)),
        gamelog: fileURLToPath(new URL('./src/blog/gamelog.html', import.meta.url)),
      },
    },
  }
})
