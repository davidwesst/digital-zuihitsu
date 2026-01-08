/// <reference types="node" />
import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  plugins: [
    viteImagemin({
      gifsicle: {
        optimizationLevel: 3,
        interlaced: false,
      },
      mozjpeg: {
        quality: 75,
      },
      pngquant: {
        quality: [0.65, 0.8],
        speed: 3,
      },
      svgo: {
        plugins: [{ name: 'removeViewBox', active: false }],
      },
      webp: {
        quality: 75,
      },
    }),
  ],
  build: {
    outDir: '../dist', // Output to project root's dist directory
    emptyOutDir: true, // Optional: cleans the output dir before building
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./src/index.html', import.meta.url)),
        blog: fileURLToPath(new URL('./src/blog.html', import.meta.url)),
        gamelog: fileURLToPath(new URL('./src/blog/gamelog.html', import.meta.url)),
        gamelogEntry: fileURLToPath(new URL('./src/blog/gamelog/entry.html', import.meta.url)),
        dungeonlog: fileURLToPath(new URL('./src/blog/dungeonlog.html', import.meta.url)),
      },
    },
  }
})
