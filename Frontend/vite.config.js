import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

const headHints = `
  <link rel="preload" href="/lcp-hero.webp" as="image" type="image/webp" fetchpriority="high" />
`

function htmlLcpPlugin() {
  return {
    name: 'html-lcp-preload',
    transformIndexHtml(html) {
      return html.replace('<head>', `<head>${headHints}`)
    },
  }
}

/** CSS must load before JS — blocking stylesheet, ordered ahead of the module script. */
function headOrderPlugin() {
  return {
    name: 'head-order',
    enforce: 'post',
    transformIndexHtml(html) {
      const css =
        html.match(/<link rel="stylesheet" crossorigin href="\/assets\/index-[^"]+\.css">/)?.[0]
      if (!css) return html

      let out = html.replace(css, '')
      out = out.replace(
        /<link rel="modulepreload" crossorigin href="\/assets\/clerk-[^"]+\.js">\s*/g,
        ''
      )
      out = out.replace(/<script type="module"/, `${css}\n  <script type="module"`)
      return out
    },
  }
}

export default defineConfig({
  plugins: [
    imagetools(),
    react(),
    htmlLcpPlugin(),
    headOrderPlugin(),
    ViteImageOptimizer({
      png: { quality: 70 },
      jpeg: { quality: 72 },
      jpg: { quality: 72 },
      webp: { quality: 72 },
    }),
  ],
  build: {
    modulePreload: { polyfill: false },
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('@clerk')) return 'clerk'
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) {
            return 'react-vendor'
          }
        },
      },
    },
  },
})
