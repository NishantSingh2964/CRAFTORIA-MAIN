/**
 * Optional: batch-convert src/assets/home PNGs to WebP on disk.
 * Run: npm run optimize-images
 * (Build-time optimization via vite-imagetools is preferred.)
 */
import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const assetsDir = path.resolve(__dirname, '../src/assets/home')

const rules = [
  { test: /^hero\d*\.png$/i, width: 1600, quality: 82 },
  { test: /^image\d+\.png$/i, width: 720, quality: 80 },
  { test: /^logo\d*\.png$/i, width: 200, quality: 88 },
  { test: /^(boyfriend|girlfriend|Husband|Wife|Father|Mother|GranfFather)\.png$/i, width: 520, quality: 78 },
  { test: /^(testimonial|imagesection|Touch|personalize)\.png$/i, width: 1200, quality: 80 },
  { test: /\.png$/i, width: 800, quality: 78 },
]

async function optimizeFile(filePath, fileName) {
  const rule = rules.find((r) => r.test.test(fileName)) || rules[rules.length - 1]
  const outPath = filePath.replace(/\.png$/i, '.webp')

  const buffer = await sharp(filePath)
    .resize({ width: rule.width, withoutEnlargement: true })
    .webp({ quality: rule.quality })
    .toBuffer()

  await fs.writeFile(outPath, buffer)
  const before = (await fs.stat(filePath)).size
  const after = buffer.length
  console.log(`  ${fileName} → ${path.basename(outPath)} (${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB)`)
}

async function main() {
  const entries = await fs.readdir(assetsDir)
  const pngs = entries.filter((f) => f.toLowerCase().endsWith('.png'))
  console.log(`Optimizing ${pngs.length} images in assets/home...\n`)

  for (const file of pngs) {
    await optimizeFile(path.join(assetsDir, file), file)
  }

  console.log('\nDone. Update imports to .webp or use vite-imagetools query params.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
