// Рендер видео «Vote for Medina».
//   node video/vote-for-me/render.mjs            — всё видео (out/vote-for-medina*.mp4)
//   node video/vote-for-me/render.mjs --stills 1.5 7.5 — отдельные кадры в out/stills
// Нужны: playwright-core + Chromium, ffmpeg. Звук берётся из video/vote-for-me/assets/sound.m4a.
import { chromium } from 'playwright-core'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(dir, 'out')
const FPS = 30
const args = process.argv.slice(2)
const stills = args[0] === '--stills' ? args.slice(1).map(Number) : null
const composeOnly = args[0] === '--compose' // только пересобрать mp4 из готовых кадров

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium',
  args: ['--allow-file-access-from-files'],
})
const page = await browser.newPage({ viewport: { width: 1920, height: 1200 } })
await page.goto('file://' + path.join(dir, 'index.html'))
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)

if (stills && !composeOnly) {
  fs.mkdirSync(path.join(out, 'stills'), { recursive: true })
  for (const t of stills) {
    await page.evaluate((t) => window.render(t), t)
    await page.screenshot({ path: path.join(out, 'stills', `${t}.png`) })
  }
  await browser.close()
  process.exit(0)
}

const duration = await page.evaluate(() => window.DURATION)
const frames = path.join(out, 'frames')
if (!composeOnly) {
fs.rmSync(frames, { recursive: true, force: true })
fs.mkdirSync(frames, { recursive: true })
}
const total = composeOnly ? 0 : Math.round(duration * FPS)
for (let i = 0; i < total; i++) {
  await page.evaluate((t) => window.render(t), i / FPS)
  await page.screenshot({ path: path.join(frames, String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 92 })
  if (i % 60 === 0) console.log(`кадр ${i}/${total}`)
}

// подпись для вертикальной версии (как в референсе)
const cap = await browser.newPage({ viewport: { width: 1080, height: 1920 } })
await cap.setContent(`<body style="margin:0;background:transparent"><div style="position:absolute;left:0;right:0;top:300px;text-align:center;font:700 52px/1.25 'Liberation Sans',Arial,sans-serif;color:#fff;text-shadow:0 2px 6px rgba(0,0,0,.5)">POV: you let me animate<br>your campaign <span style=\"font-family:'Noto Color Emoji'\">🙈</span></div></body>`)
await cap.screenshot({ path: path.join(out, 'caption.png'), omitBackground: true })
await browser.close()

const sound = path.join(dir, 'assets', 'sound.m4a')
const audio = fs.existsSync(sound) ? ['-i', sound] : []
const map = audio.length ? ['-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '160k', '-shortest'] : []
const ff = process.env.FFMPEG || 'ffmpeg'
// горизонтальная версия
execFileSync(ff, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, '%04d.jpg'), ...audio,
  ...map, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', path.join(out, 'vote-for-medina-16x10.mp4')], { stdio: 'inherit' })
// вертикальная версия для TikTok 1080×1920
execFileSync(ff, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, '%04d.jpg'), ...audio, '-i', path.join(out, 'caption.png'),
  '-filter_complex', `[0:v]scale=1080:675,pad=1080:1920:0:600:black[v];[v][${audio.length ? 2 : 1}:v]overlay=0:0[o]`,
  '-map', '[o]', ...(audio.length ? ['-map', '1:a', '-c:a', 'aac', '-b:a', '160k', '-shortest'] : []),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', path.join(out, 'vote-for-medina-tiktok.mp4')], { stdio: 'inherit' })
console.log('готово:', out)
