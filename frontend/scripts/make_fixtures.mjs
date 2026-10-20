import fs from "fs";
import vm from "vm";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, "..", "src", "fixtures");
const h3Source = fs.readFileSync(path.join(here, "..", "..", "docs", "design", "h3.bundle.js"), "utf8");
const h3Context = {};
vm.createContext(h3Context);
vm.runInContext(h3Source + "\nthis.h3 = h3;", h3Context);
const h3 = h3Context.h3;

function rng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function round(v, d) {
  const k = Math.pow(10, d);
  return Math.round(v * k) / k;
}

function meta(source) {
  return {
    data_source: source,
    version: "fixture-m1",
    generated_at: "2026-10-21T00:00:00Z",
    units: null,
    demo: true,
    fallback_used: false
  };
}

function write(name, body) {
  fs.writeFileSync(path.join(outDir, name + ".json"), JSON.stringify(body, null, 1));
  console.log("wrote", name, fs.statSync(path.join(outDir, name + ".json")).size);
}

const FIRE_CLUSTERS = [
  { lon: 75.6, lat: 30.6, n: 260, sx: 1.6, sy: 0.9, cls: "crop" },
  { lon: 79.5, lat: 26.5, n: 120, sx: 3.0, sy: 1.5, cls: "crop" },
  { lon: 85.0, lat: 22.0, n: 60, sx: 2.0, sy: 1.6, cls: "forest" },
  { lon: 98.0, lat: 19.5, n: 160, sx: 2.6, sy: 2.4, cls: "forest" },
  { lon: 104.0, lat: 15.0, n: 140, sx: 3.0, sy: 2.2, cls: "crop" },
  { lon: 113.5, lat: -1.5, n: 110, sx: 3.0, sy: 1.6, cls: "forest" },
  { lon: 22.0, lat: -9.0, n: 320, sx: 7.0, sy: 3.5, cls: "forest" },
  { lon: 18.0, lat: 8.0, n: 260, sx: 9.0, sy: 2.2, cls: "crop" },
  { lon: -55.0, lat: -9.0, n: 220, sx: 6.0, sy: 3.5, cls: "forest" },
  { lon: -60.0, lat: -22.0, n: 80, sx: 3.5, sy: 2.5, cls: "crop" },
  { lon: 133.0, lat: -16.0, n: 160, sx: 9.0, sy: 3.0, cls: "forest" },
  { lon: -120.5, lat: 38.5, n: 50, sx: 2.0, sy: 2.0, cls: "forest" },
  { lon: 128.0, lat: 60.0, n: 90, sx: 8.0, sy: 3.0, cls: "forest" },
  { lon: 49.5, lat: 29.5, n: 40, sx: 1.2, sy: 1.0, cls: "industrial" },
  { lon: 6.5, lat: 5.0, n: 50, sx: 1.2, sy: 0.8, cls: "industrial" },
  { lon: 69.9, lat: 22.4, n: 12, sx: 0.15, sy: 0.15, cls: "industrial" },
  { lon: 86.4, lat: 23.7, n: 25, sx: 0.4, sy: 0.3, cls: "industrial" }
];

function firePoints(seed, scale) {
  const r = rng(seed);
  const pts = [];
  FIRE_CLUSTERS.forEach(function (c) {
    const n = Math.round(c.n * scale);
    for (let i = 0; i < n; i++) {
      const u = r() + r() + r() - 1.5;
      const v = r() + r() + r() - 1.5;
      const frp = Math.exp(r() * 3.5);
      let sensor = "MODIS";
      if (r() < 0.72) {
        sensor = "VIIRS";
      }
      pts.push({ lon: round(c.lon + u * c.sx, 4), lat: round(c.lat + v * c.sy, 4), cls: c.cls, frp: round(frp, 2), sensor: sensor });
    }
  });
  return pts;
}

function hexCounts(pts, res) {
  const counts = {};
  pts.forEach(function (p) {
    const c = h3.latLngToCell(p.lat, p.lon, res);
    counts[c] = (counts[c] || 0) + 1;
  });
  return Object.keys(counts).map(function (k) {
    const ring = h3.cellToBoundary(k, true).slice().reverse().map(function (xy) { return [round(xy[0], 4), round(xy[1], 4)]; });
    ring.push(ring[0]);
    return { id: k, count: counts[k], ring: ring };
  });
}

function calendarRows(seed, harmonised) {
  const r = rng(seed);
  const base = [0.3, 0.4, 0.8, 2.6, 3.1, 0.9, 0.2, 0.15, 0.4, 3.6, 5.2, 0.7];
  const rows = [];
  for (let y = 2003; y <= 2025; y++) {
    const row = [];
    for (let m = 0; m < 12; m++) {
      let v = base[m] * (1 + (r() - 0.5) * 0.45);
      if (!harmonised && y >= 2012) { v = v * 2.5; }
      if (y === 2016 && m === 10) { v = v * 1.55; }
      if (y >= 2022 && m === 10) { v = v * 0.55; }
      row.push(round(v, 4));
    }
    rows.push(row);
  }
  return rows;
}

function shell() {
  write("shell", {
    data: {
      chips: [
        { kind: "archive", label: "ARCHIVE" },
        { kind: "live", label: "LIVE NRT" }
      ],
      home_chips: [
        { kind: "live", label: "LIVE NRT · 3h" },
        { kind: "archive", label: "ARCHIVE 2000–2025" }
      ]
    },
    meta: meta("fixture: docs/design mock-up chips")
  });
}

function home() {
  const r = rng(7);
  const fires = [];
  const C = [[30.6, 75.4, 1.1, 180], [29.8, 76.4, 0.9, 120], [30.9, 74.6, 0.7, 90], [26.5, 80.5, 1.6, 60], [22.5, 82.0, 1.5, 50], [18.5, 80.5, 1.3, 40], [24.5, 93.5, 1.0, 50]];
  C.forEach(function (c) {
    for (let i = 0; i < c[3]; i++) {
      const rad = Math.sqrt(-2 * Math.log(r() + 1e-9)) * c[2] * 0.5;
      const t = r() * 6.283;
      let color = "#ff5a2a";
      if (r() < 0.25) {
        color = "#ffd27a";
      }
      fires.push([round(c[0] + rad * Math.sin(t), 4), round(c[1] + rad * Math.cos(t), 4), color]);
    }
  });
  write("home", {
    data: {
      satellite: { name: "NOAA-21 · VIIRS", rows: [
        { label: "Altitude", value: "≈ 824 km" },
        { label: "Swath", value: "≈ 3,040 km" },
        { label: "Equator pass", value: "~13:30 LT" },
        { label: "Fire pixel", value: "375 m" }
      ] },
      record_start: 2000,
      sensors_joined: 5,
      sensors_live: 2,
      sensors_live_note: "VIIRS AFTER NOV 2026",
      cluster: { region: "Punjab–Haryana, IN", ci_pct: 90 },
      fires: fires
    },
    meta: meta("fixture: docs/design/pages/hero_photo.html demo pattern")
  });
}

function explorer() {
  const pts = firePoints(7, 1.4);
  const r = rng(3);
  const bars = [];
  for (let i = 0; i < 300; i++) {
    const y = 2000 + i / 12;
    let era = 0.8;
    if (y >= 2012) {
      era = 1;
    }
    bars.push(round((0.4 + 0.6 * Math.abs(Math.sin(i / 12 * Math.PI * 2))) * era * (0.7 + 0.3 * r()), 3));
  }
  write("explorer", {
    data: {
      layers_active: 7,
      confidence: { label: "nominal", value: 0.6, slider_pct: 55 },
      place: { name: "Punjab, India", bbox: [73.8, 27.6, 77.6, 32.6] },
      cell: {
        id: "1207_2558",
        district: "Ludhiana",
        res_deg: 0.1,
        area_km2: 106,
        month_label: "Nov 2024",
        fire_days: 14,
        clear_days: 22,
        days_in_month: 30,
        rate: 0.64,
        h: 14,
        lo: 12,
        hi: 16,
        source_mix: { cls: "crop", pct: 81 },
        blind_spot: { ratio: 2.4, baseline_before: 2021 },
        status: "archive"
      },
      overpasses: [
        { satellite: "Terra MODIS", sensor: "MODIS", local_time: "~10:30" },
        { satellite: "Aqua MODIS", sensor: "MODIS", local_time: "~13:30" },
        { satellite: "NOAA-20 / 21 VIIRS", sensor: "VIIRS", local_time: "~13:30" }
      ],
      burning_peak: { year: 2024, label: "after 15:00" },
      timeline: { start_year: 2000, seam_year: 2012, selected_index: 287, selected_label: "Nov 2024", values: bars },
      globe: {
        rotate: [-80, -23, 0],
        terminator: { sunLon: -10, sunLat: -15 },
        orbits: [
          { inc: 98.7, node: -40, color: "#49C7F5", satA: 110 },
          { inc: 98.7, node: -25, color: "#8FB8FF", satA: 96 }
        ],
        highlight_country: "India",
        points: pts,
        hexes: hexCounts(pts, 3)
      }
    },
    meta: meta("fixture: docs/design/pages/explorer.html demo pattern")
  });
}

function calendar() {
  const rows = calendarRows(11, true);
  const raw = calendarRows(11, false);
  const nov = rows.map(function (row) { return round(row[10] * 80, 2); });
  const years = [];
  for (let y = 2003; y <= 2025; y++) {
    years.push(y);
  }
  write("calendar", {
    data: {
      region: "punjab",
      region_name: "Punjab",
      years: years,
      unit: "VIIRS-equivalent fire cell-days per 1,000 clear-sky cell-days",
      grid_deg: 0.1,
      max: 6.5,
      harmonised: rows,
      raw: raw,
      marks: [
        { year: 2016, month: 11, kind: "anomaly" },
        { year: 2024, month: 11, kind: "blind_spot" },
        { year: 2025, month: 11, kind: "blind_spot" }
      ],
      z_threshold: 2,
      selected: {
        year: 2016,
        month: 11,
        month_label: "November 2016",
        value: 412,
        lo: 380,
        hi: 441,
        band_pct: 90,
        z: 2.4,
        median: 318,
        mad: 26,
        converted_from: "Aqua MODIS × k̃(Nov)",
        k: 2.5,
        k_lo: 2.45,
        k_hi: 2.55,
        era: "VIIRS reference",
        loyo_median_error_pct: 4,
        status: "archive"
      },
      season: {
        month_name: "November",
        values: nov,
        lo: nov.map(function (v) { return round(v * 0.92, 2); }),
        hi: nov.map(function (v) { return round(v * 1.08, 2); }),
        viirs_start_year: 2012,
        sen_slope: -6.1,
        p: 0.21,
        test: "HR-MK",
        note: "2022–2025 decline overlaps the late-afternoon shift. Treat the trend as unconfirmed until burned area agrees."
      }
    },
    meta: meta("fixture: docs/design/pages/calendar.html demo pattern")
  });
}

fs.mkdirSync(outDir, { recursive: true });
shell();
home();
explorer();
calendar();
