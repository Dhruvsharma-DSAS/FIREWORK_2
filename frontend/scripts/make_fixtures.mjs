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

const CLUSTER_NAMES = [
  "Punjab–Haryana, IN", "Uttar Pradesh, IN", "Jharkhand–Odisha, IN", "Myanmar–Thailand", "Cambodia", "Kalimantan, ID",
  "Angola–DR Congo", "Sahel belt", "Mato Grosso, BR", "Gran Chaco", "Northern Australia", "California, US",
  "Yakutia, RU", "Khuzestan flares, IR", "Niger Delta flares, NG", "Jamnagar refinery, IN", "Jharia coalfield, IN"
];

function nearestCluster(lon, lat) {
  let best = 0;
  let bestD = 1e9;
  FIRE_CLUSTERS.forEach(function (c, i) {
    const d = (c.lon - lon) * (c.lon - lon) + (c.lat - lat) * (c.lat - lat);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return CLUSTER_NAMES[best];
}

function explorerCells() {
  const pts = firePoints(7, 1.4);
  const groups = {};
  pts.forEach(function (p) {
    const id = h3.latLngToCell(p.lat, p.lon, 3);
    if (!groups[id]) {
      groups[id] = [];
    }
    groups[id].push(p);
  });
  const r = rng(21);
  const cells = {};
  Object.keys(groups).forEach(function (id) {
    const g = groups[id];
    const byCls = {};
    g.forEach(function (p) { byCls[p.cls] = (byCls[p.cls] || 0) + 1; });
    let cls = "unknown";
    let best = 0;
    Object.keys(byCls).forEach(function (k) {
      if (byCls[k] > best) {
        best = byCls[k];
        cls = k;
      }
    });
    const center = h3.cellToLatLng(id);
    const clear = 14 + Math.floor(r() * 16);
    const fire = Math.min(clear, Math.max(1, Math.round(g.length * 0.35)));
    let blind = null;
    if (cls === "crop" && g.length > 30) {
      blind = { ratio: round(1.6 + r() * 1.2, 1), baseline_before: 2021 };
    }
    cells[id] = {
      id: id,
      place: nearestCluster(center[1], center[0]),
      grid_label: "H3 res 3 ≈ " + Math.round(h3.cellArea(id, "km2")).toLocaleString("en-US") + " km²",
      month_label: "Nov 2024",
      fire_days: fire,
      clear_days: clear,
      days_in_month: 30,
      rate: round(fire / clear, 2),
      h: fire,
      lo: Math.round(fire * 0.86),
      hi: Math.round(fire * 1.14),
      source_mix: { cls: cls, pct: Math.round(best / g.length * 100) },
      blind_spot: blind,
      status: "archive"
    };
  });
  write("explorer_cells", { data: cells, meta: meta("fixture: demo values derived from explorer.json hex points") });
}

function regionPoints(seed, density) {
  const r = rng(seed);
  const pts = [];
  const centers = [[75.6, 30.7, 0.9, 0.45], [76.2, 30.2, 0.6, 0.4], [74.9, 30.9, 0.5, 0.35], [76.6, 29.6, 0.6, 0.4], [75.2, 30.2, 0.5, 0.4]];
  centers.forEach(function (c) {
    const n = Math.round(90 * density);
    for (let i = 0; i < n; i++) {
      const u = r() + r() + r() - 1.5;
      const v = r() + r() + r() - 1.5;
      let sensor = "MODIS";
      if (r() < 0.72) {
        sensor = "VIIRS";
      }
      let cls = "crop";
      if (r() >= 0.88) {
        cls = "unknown";
        if (r() < 0.5) {
          cls = "industrial";
        }
      }
      const frp = Math.exp(r() * 2.5);
      pts.push({ lon: round(c[0] + u * c[2], 4), lat: round(c[1] + v * c[3], 4), sensor: sensor, cls: cls, frp: round(frp, 2) });
    }
  });
  pts.push({ lon: 76.85, lat: 30.95, sensor: "VIIRS", cls: "industrial", frp: 30 });
  return pts;
}

function sensorlab() {
  const xs = [];
  const ys = [];
  for (let i = 0; i < 40; i++) {
    const f = Math.exp(Math.log(0.5) + i / 39 * (Math.log(200) - Math.log(0.5)));
    let lab = "";
    if (i % 8 === 0) {
      lab = f.toFixed(1);
    }
    xs.push(lab);
    ys.push(round(1 / (1 + Math.exp(-2.2 * (Math.log(f) - Math.log(9)))), 4));
  }
  const base = [100, 104, 108, 103, 97, 95, 99, 104, 107, 103, 98, 96, 101, 106, 108, 104, 99, 97, 100, 105, 107, 103, 99];
  const raw = base.map(function (v, i) {
    if (i >= 9) {
      return round(v * 2.6, 1);
    }
    return v;
  });
  const years = [];
  for (let y = 2003; y <= 2025; y++) {
    let lab = "";
    if (y % 4 === 3) {
      lab = String(y);
    }
    years.push(lab);
  }
  write("sensorlab", {
    data: {
      region: { name: "Punjab", bbox: [73.5, 28.8, 77.3, 32.3], grid_deg: 0.1 },
      date: "2015-11-05",
      left: { sensor: "MODIS", label: "MODIS · 1 km · 2015-11-05", color: "#8FB8FF" },
      right: { sensor: "VIIRS", label: "VIIRS · 375 m · 2015-11-05", color: "#FF8A3D" },
      points: regionPoints(5, 3),
      k_by_month: { title: "Calibration ratio k by month · overlap 2012–2025", values: [2.1, 2.2, 2.3, 2.4, 2.6, 2.3, 2.0, 2.0, 2.2, 2.5, 2.5, 2.3], labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"] },
      detection: { title: "Detection probability · Aqua vs VIIRS matched pairs", note: "FRP50 ≈ 9 MW (synthetic test)", values: ys, x_labels: xs, frp50_index: Math.round(39 * (Math.log(9) - Math.log(0.5)) / (Math.log(200) - Math.log(0.5))) },
      raw_vs_harmonised: { title: "Raw vs harmonised · Punjab Nov totals", raw: raw, harmonised: base, x_labels: years, seam_index: 9, seam_label: "2012 seam" },
      model: {
        family: "GLM · NegBin",
        rows: [
          { label: "k day = e^β₁", value: "2.64 [2.50–2.80]" },
          { label: "k night = e^(β₁+β₃)", value: "— needs archive run" },
          { label: "Overdispersion (Pearson χ²/df)", value: "1.9 → use NegBin" },
          { label: "AIC ratio vs power law", value: "−165.3 vs −198.0" }
        ],
        note: "All numbers on this panel come from synthetic tests in accuracy_tools.py"
      }
    },
    meta: meta("fixture: docs/design/pages/sensorlab.html demo values")
  });
}

function studio() {
  write("studio", {
    data: {
      chips: [{ kind: "user", label: "YOUR DATA" }, { kind: "archive", label: "ARCHIVE" }],
      steps: ["Upload", "Inspect", "Validate", "Map columns", "Parameters", "Preview", "Run", "Formulas", "Compare", "Export"],
      current_step: 4,
      dataset: {
        file: "punjab_field_survey.xlsx",
        summary: "1,284 rows · 9 columns · sheet \"Nov\"",
        rows: [
          { label: "Detected type", value: "point table" },
          { label: "Coordinates", value: "lat/lon (deg)" },
          { label: "Time zone guess", value: "IST → UTC?", warn: true },
          { label: "Duplicates", value: "12 rows" },
          { label: "Missing values", value: "3.1%" }
        ]
      },
      assistant: {
        question: "Compare my survey fires with VIIRS for Nov 2024 and tell me how many the satellite missed.",
        plan_before: "I will: (1) match your points to VIIRS within 1 km and ±1 day, (2) count matched vs unmatched by hour. Your ",
        plan_code: "time",
        plan_after: " column looks like IST — convert to UTC first?",
        note: "The assistant only builds the analysis plan. Every number comes from the pipeline, never from the language model."
      },
      columns: [
        { name: "Lat", map: "→ latitude ✓", bad: false },
        { name: "Long", map: "→ longitude ✓", bad: false },
        { name: "Date", map: "→ date ✓", bad: false },
        { name: "time", map: "→ time (tz?)", bad: true },
        { name: "Fire_size_acre", map: "→ area · acre→km²", bad: false },
        { name: "Crop", map: "→ label: crop", bad: false },
        { name: "Village", map: "→ keep as text", bad: false },
        { name: "Obs", map: "→ unmapped", bad: true }
      ],
      auto_detected: "7 / 9",
      rows: [
        ["30.712", "75.811", "2024-11-05", "16:40", "2.5", "paddy", "Raikot", "—"],
        ["30.698", "75.902", "2024-11-05", "17:05", "1.0", "paddy", "Jagraon", "smoke"],
        ["307.2", "75.77", "2024-11-06", "15:55", "4.0", "paddy", "Sudhar", "—"],
        ["30.661", "75.640", "06/11/24", "13:20", "0.8", "wheat?", "Mullanpur", "—"],
        ["30.744", "75.993", "2024-11-07", "18:10", "—", "paddy", "Dehlon", "—"],
        ["30.802", "75.705", "2024-11-07", "12:45", "3.2", "paddy", "Sidhwan", "—"]
      ],
      cell_flags: [{ row: 2, col: 0, kind: "bad" }, { row: 3, col: 2, kind: "fix" }],
      issues: {
        error: "Row 3: latitude 307.2 is outside −90…90 (probably 30.72 with a typo).",
        warn: "Row 4: date written as 06/11/24 — is this 6 Nov or 11 Jun? Choose a date format for the whole column.",
        ok: "Unit conversion ready: Fire_size_acre × 0.004047 = km². Original values are kept in the export."
      },
      params: {
        region: "Ludhiana district (geoBoundaries ADM2)",
        window: "2024-10-01 → 2024-11-30",
        sensors: [{ label: "VIIRS N20", on: true }, { label: "VIIRS N21", on: true }, { label: "MODIS Aqua", on: false }],
        grid: { label: "0.1°", pct: 30 },
        distance: { label: "1.0 km", pct: 40 },
        time_window: { label: "± 1 day", pct: 25 },
        confidence: ["low", "nominal", "high"],
        confidence_on: "nominal",
        daynight: ["day", "night", "separate"],
        daynight_on: "separate",
        uncertainty: { label: "bootstrap · 2000", value: "90% band, resample whole years" },
        explain: "a larger match distance finds more matches but can pair two different fires. 1 km ≈ 3 VIIRS pixels.",
        config: "config v3 · saved"
      },
      preview: {
        hours: ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],
        counts: [4, 9, 18, 30, 22, 61, 140, 170, 96, 40],
        split_hour: 15,
        rows: [
          { label: "Rows kept", value: "1,268 / 1,284" },
          { label: "Matched to VIIRS", value: "214 (17%)" },
          { label: "Unmatched after 15:00", value: "83% of unmatched", warn: true }
        ],
        note: "Example data for the mockup — not a real survey."
      }
    },
    meta: meta("fixture: docs/design/pages/studio.html demo values")
  });
}

function formulas() {
  write("formulas", {
    data: {
      count_label: "46 methods · 8 families",
      families: [
        { name: "Harmonisation", items: [{ id: "F05", label: "Grid index & cell-days" }, { id: "F06", label: "Clear-sky rate" }, { id: "F08", label: "Calibration ratio k" }, { id: "F11", label: "Poisson / NegBin GLM" }, { id: "F12", label: "Empirical Bayes shrinkage" }] },
        { name: "Validation", items: [{ id: "F20", label: "Seam ratio · LOYO" }, { id: "F21", label: "Pettitt / PELT" }, { id: "F22", label: "Bland–Altman" }] },
        { name: "Calendar & trends", items: [{ id: "F25", label: "Robust z (MAD)" }, { id: "F26", label: "Mann–Kendall · Sen" }, { id: "F27", label: "Benjamini–Hochberg" }] },
        { name: "Source & blind spot", items: [{ id: "F42", label: "L-context · distance decay" }, { id: "F43", label: "Blind-spot ratio B" }] }
      ],
      formula: {
        id: "F08",
        number: 8,
        title: "MODIS → VIIRS overlap calibration",
        method: "standard method · median of ratios",
        legend: [
          { sym: "k", sup: "", color: "var(--ember)", text: "calibration ratio" },
          { sym: "r", sup: "", color: "var(--sky)", text: "region" },
          { sym: "m", sup: "", color: "var(--sky)", text: "month" },
          { sym: "N", sup: "V", color: "var(--viirs)", text: "VIIRS cell-days" },
          { sym: "N", sup: "M", color: "var(--modis)", text: "MODIS cell-days" }
        ]
      },
      tryit: {
        rows: [
          { year: 2013, modis: 40, viirs: 100, edited: false },
          { year: 2014, modis: 60, viirs: 150, edited: false },
          { year: 2015, modis: 20, viirs: 52, edited: true },
          { year: 2016, modis: 80, viirs: 196, edited: false }
        ],
        apply_label: "Apply to Nov 2008 MODIS",
        apply_modis: 120,
        hint: "Change one year to 9 (an outlier): the mean jumps, the median does not move."
      },
      steps: {
        English: [
          { head: "1 · Pair the years.", text: "Use only overlap years where both sensors watched the same region and month." },
          { head: "2 · Ratio per year.", text: "Divide VIIRS cell-days by MODIS cell-days (skip MODIS = 0)." },
          { head: "3 · Take the median.", text: "Robust to one strange year (breakdown point 50%)." },
          { head: "4 · Shrink if data is thin.", text: "Pull toward the global k when few years exist." },
          { head: "5 · Convert.", text: "Pre-2012 MODIS × k = VIIRS-equivalent, with a bootstrap band." }
        ],
        Hinglish: [
          { head: "1 · Saal jodo.", text: "Sirf overlap ke saal lo jab dono sensors ne same region aur month dekha." },
          { head: "2 · Har saal ka ratio.", text: "VIIRS cell-days ko MODIS cell-days se divide karo (MODIS = 0 ho to skip)." },
          { head: "3 · Median lo.", text: "Ek ajeeb saal se farak nahi padta (breakdown point 50%)." },
          { head: "4 · Data kam ho to shrink karo.", text: "Kam saal hon to global k ki taraf kheencho." },
          { head: "5 · Convert karo.", text: "2012 se pehle ka MODIS × k = VIIRS-equivalent, bootstrap band ke saath." }
        ]
      },
      compare: {
        title: "k estimates when one year is an outlier (example)",
        values: [3.6, 2.6, 2.5, 2.52],
        labels: ["mean", "ratio of sums", "median", "GLM"],
        colors: ["#FF4D6D", "#9AA6BD", "#3DDC97", "#9B8CFF"],
        rows: [
          { label: "Mean of ratios", value: "pulled by outliers", color: "var(--rose)" },
          { label: "Ratio of totals", value: "dominated by big years", color: "" },
          { label: "Median of ratios", value: "robust, simple", color: "var(--mint)" },
          { label: "GLM with offset", value: "adds CI + covariates", color: "var(--mint)" }
        ]
      },
      doubts: [
        { q: "Why not just use VIIRS?", a: "VIIRS starts in 2012. Without conversion, 2000–2011 cannot be compared." },
        { q: "Is k the same everywhere?", a: "No — it depends on fire size, land type and season. That is why k has region and month." },
        { q: "Does k fix clouds?", a: "No. Clouds are handled by the clear-sky rate before calibration." }
      ],
      code_file: "harmonize.py"
    },
    meta: meta("fixture: docs/design/pages/formulas.html demo values")
  });
}

function validation() {
  const act = [100, 150, 52, 196, 140, 120, 160, 130, 110, 90, 70, 60];
  const pred = act.map(function (v, i) { return round(v * (1 + ((i * 37) % 9 - 4) / 100), 2); });
  const r = rng(4);
  const ba = [];
  for (let i = 0; i < 60; i++) {
    const mean = 20 + r() * 260;
    const diff = (r() + r() + r() - 1.5) * 9;
    ba.push([round(mean, 2), round(diff, 2)]);
  }
  write("validation", {
    data: {
      banner: "VALUES SHOWN = SYNTHETIC TESTS · REAL RUN PENDING",
      tiles: [
        { label: "Seam left", value: "ρ ≈ 0.03", note: "target < 0.10", color: "var(--mint)" },
        { label: "LOYO error", value: "1.0%", note: "median · target < 10–15%", color: "" },
        { label: "Pettitt p", value: "0.41", note: "no step left (not proof)", color: "" },
        { label: "Band coverage", value: "—", note: "needs real archive", color: "var(--flame)" },
        { label: "FDR control", value: "94 → 53", note: "cells flagged, naive → BH", color: "" }
      ],
      loyo: { years: ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"], actual: act, predicted: pred },
      bland_altman: { points: ba, sd: 10, x_max: 300, y_range: 30, note: "bias should include 0", x_label: "mean of the two (cell-days)" },
      regions: [
        { region: "Punjab", years: "14", k: "2.5 [2.45–2.55]", loyo: "4%", status: "reliable", color: "var(--mint)" },
        { region: "Haryana", years: "14", k: "2.4 [2.3–2.6]", loyo: "7%", status: "reliable", color: "var(--mint)" },
        { region: "Kerala", years: "5", k: "2.0 [1.4–2.9]", loyo: "22%", status: "indicative only", color: "var(--flame)" },
        { region: "Ladakh", years: "1", k: "global prior", loyo: "—", status: "too few fires", color: "var(--rose)" }
      ],
      regions_note: "Table values illustrate the layout. Real values come from the archive run.",
      limitations_warn: "No significant change point ≠ no bias. It only means the test could not find one.",
      limitations: [
        { label: "Late-afternoon burning (after 15:00)", value: "undercount" },
        { label: "Terra / Aqua orbit drift after 2020", value: "Terra excluded from fit" },
        { label: "Fog flagged as cloud in November", value: "min clear-obs rule" },
        { label: "Counts ≠ burned area ≠ emissions", value: "labelled everywhere" }
      ]
    },
    meta: meta("fixture: docs/design/pages/validation.html synthetic test values")
  });
}

function sources() {
  write("sources", {
    data: {
      bbox: [74.6, 29.9, 77.2, 31.6],
      points: regionPoints(5, 2.2),
      legend: [
        { cls: "crop", label: "crop residue" },
        { cls: "forest", label: "forest / wildland" },
        { cls: "industrial", label: "industrial / persistent" },
        { cls: "unknown", label: "unknown (abstain)" }
      ],
      site: {
        id: "S-0417",
        place: "near Ropar",
        cls: "INDUSTRIAL",
        prob: 0.89,
        evidence_for: [
          { label: "Persistence π (hot days / observed)", value: "0.82" },
          { label: "Night detections ν", value: "70%" },
          { label: "Median brightness gap ΔT", value: "38 K" },
          { label: "Thermal power plant (OSM) at 300 m", value: "IE +5.0" }
        ],
        evidence_against: [{ label: "Cropland within 1.2 km", value: "AE +1.0" }],
        formula: "L = ln((IE+1)/(AE+1)) = ln(7.5/3.5) = 0.76 → industrial context",
        abstain_note: "Below 0.55 probability the site is shown as UNKNOWN, not guessed."
      },
      split: {
        title: "Calendar split by source · Punjab Nov",
        years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
        crop: [300, 310, 295, 320, 280, 180, 150, 140],
        industrial: [22, 24, 23, 25, 24, 26, 25, 27],
        unknown: [18, 20, 15, 17, 16, 14, 13, 12],
        note: "Removing persistent industrial heat sharpens the crop season. Demo values."
      }
    },
    meta: meta("fixture: docs/design/pages/source.html demo points")
  });
}

function blindspot() {
  write("blindspot", {
    data: {
      clock: {
        region: "Punjab",
        source: "iFOREST 2025",
        burn_window: [15, 19.5],
        midday: [11, 15],
        passes: [10.5, 13.5],
        headline: ">90%",
        line1: "of large fires after 15:00 (2024–25)",
        line2: "was 3% in 2021",
        pass_label: "● satellite passes 10:30 · 13:30",
        burn_label: "■ burning window now (schematic)"
      },
      counts: {
        values: [31447, 20000, 11633, 8812],
        labels: ["Punjab 2022", "Punjab 2025", "Haryana 2019", "Haryana 2025"],
        colors: ["#FF6A3D", "#FF6A3D", "#49C7F5", "#49C7F5"],
        tiles: [
          { label: "Official fire counts since 2021", value: "−90%+", color: "var(--rose)", note: "" },
          { label: "Punjab burnt area 2022 → 2025", value: "−36%", color: "var(--flame)", note: "31,447 → ~20,000 km²" }
        ]
      },
      ratio: { values: [1.0, 1.1, 0.9, 1.0, 1.05, 1.3, 1.8, 2.4, 2.6], years: ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"], baseline_index: 4, note: "flag when B > 2 × pre-2021 median" },
      hides: [
        { title: "Overpass time", text: "Polar satellites pass ~10:30 and ~13:30 local. Burning after 15:00 is not seen." },
        { title: "Clouds & fog", text: "FireMask class 4 = cloud. Rate = fire / clear removes this bias." },
        { title: "Small / cool fires", text: "Below the detection curve (FRP50). VIIRS sees more than MODIS." },
        { title: "Night & geometry", text: "Different night sensitivity; large pixels at swath edge." }
      ]
    },
    meta: meta("fixture: docs/design/pages/blindspot.html reported values")
  });
}

fs.mkdirSync(outDir, { recursive: true });
shell();
home();
explorer();
explorerCells();
calendar();
sensorlab();
studio();
formulas();
validation();
sources();
blindspot();
