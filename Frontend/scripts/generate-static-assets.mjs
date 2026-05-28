import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const home = path.resolve(__dirname, '../src/assets/home')
const pub = path.resolve(__dirname, '../public')

async function writeWebp(input, output, width, quality) {
  await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(output)
  const stat = await fs.stat(output)
  console.log(`  ${path.basename(output)} — ${Math.round(stat.size / 1024)} KB (${width}px)`)
}

console.log('Generating static WebP assets...\n')
await writeWebp(path.join(home, 'hero.png'), path.join(pub, 'lcp-hero.webp'), 960, 76)
await writeWebp(path.join(home, 'logo1.png'), path.join(pub, 'logo-nav.webp'), 128, 82)
await writeWebp(path.join(home, 'logo2.png'), path.join(pub, 'logo-nav-alt.webp'), 128, 82)
console.log('\nDone.')
