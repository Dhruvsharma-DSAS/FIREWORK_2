import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { chromium } from "@playwright/test"

const here = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(here, "..", "..", "tests", "visual")
const base = process.env.BASE_URL || "http://localhost:5173"

const PAGES = {
  hero_photo: { url: "/", w: 1600, h: 1000, wait: 6000 },
  explorer: { url: "/explore", w: 1600, h: 1000, wait: 4000 },
  calendar: { url: "/calendar/punjab", w: 1600, h: 1000, wait: 1500 },
  sensorlab: { url: "/sensors", w: 1600, h: 1000, wait: 1500 },
  studio: { url: "/studio", w: 1600, h: 1000, wait: 1500 },
  formulas: { url: "/formulas/F08", w: 1600, h: 1000, wait: 1500 },
  validation: { url: "/validation", w: 1600, h: 1000, wait: 1500 },
  source: { url: "/sources", w: 1600, h: 1000, wait: 1500 },
  blindspot: { url: "/blind-spot", w: 1600, h: 1000, wait: 1500 }
}

async function main() {
  const wanted = process.argv.slice(2).filter(function (a) { return !a.startsWith("--") })
  const makePoster = process.argv.indexOf("--poster") !== -1
  fs.mkdirSync(outDir, { recursive: true })
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] })
  for (const name of Object.keys(PAGES)) {
    if (wanted.length > 0 && wanted.indexOf(name) === -1) {
      continue
    }
    const p = PAGES[name]
    const page = await browser.newPage({ viewport: { width: p.w, height: p.h }, deviceScaleFactor: 1.5, reducedMotion: "reduce" })
    page.on("pageerror", function (e) { console.log("PAGE ERROR", name, e.message) })
    page.on("console", function (m) { if (m.type() === "error") { console.log("CONSOLE", name, m.text()) } })
    await page.goto(base + p.url, { waitUntil: "networkidle" })
    await page.evaluate("document.fonts.ready")
    await page.waitForFunction("document.querySelector('.ldr-layer') === null", null, { timeout: 30000 })
    await page.waitForTimeout(p.wait)
    if (makePoster && name === "hero_photo") {
      const data = await page.evaluate("document.getElementById('hero-canvas').toDataURL('image/jpeg', 0.86)")
      fs.writeFileSync(path.join(here, "..", "public", "hero", "poster.jpg"), Buffer.from(data.split(",")[1], "base64"))
      console.log("poster written")
    }
    await page.screenshot({ path: path.join(outDir, name + ".png") })
    console.log("shot", name)
    await page.close()
  }
  await browser.close()
}

main()
