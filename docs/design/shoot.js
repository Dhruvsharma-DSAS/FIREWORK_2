const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
  const jobs = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const head = fs.readFileSync("/home/claude/atlas/mock/head.html", "utf8");
  const marks = fs.existsSync("shots/marks.json") ? JSON.parse(fs.readFileSync("shots/marks.json", "utf8")) : {};
  for (const j of jobs) {
    let src = fs.readFileSync("pages/" + j.page, "utf8").replace("<!--HEAD-->", head);
    if (j.wire) { src = src.replace("</head>", "<link rel=\"stylesheet\" href=\"/wire.css\"></head>"); }
    fs.writeFileSync("pages/_" + j.page, src);
    const page = await browser.newPage({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: j.dpr || 2 });
    page.on("pageerror", (e) => console.log("ERR", j.page, e.message)); page.on("console", (m) => { if (m.text().startsWith("SUN")) console.log(m.text()); });
    await page.goto("/pages/_" + j.page + (j.q || ""));
    await page.waitForFunction("window.READY === true", null, { timeout: 60000 });
    await page.waitForTimeout(400);
    marks[j.out] = { w: j.w, h: j.h, marks: await page.evaluate("KIT.markAll()") };
    await page.screenshot({ path: "shots/" + j.out + ".png", fullPage: !!j.full });
    await page.close();
    console.log("shot", j.out);
  }
  fs.writeFileSync("shots/marks.json", JSON.stringify(marks, null, 1));
  await browser.close();
})();
