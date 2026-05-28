import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const src = path.resolve(__dirname, '../src/assets/home/hero.png')
const out = path.resolve(__dirname, '../public/lcp-hero.webp')

await sharp(src)
  .resize({ width: 960, withoutEnlargement: true })
  .webp({ quality: 78 })
  .toFile(out)

const stat = await fs.stat(out)
console.log(`LCP hero: public/lcp-hero.webp (${Math.round(stat.size / 1024)} KB)`)
