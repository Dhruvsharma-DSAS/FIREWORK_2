const KIT = {};

KIT.rng = function (seed) {
  let s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

KIT.FIRE_CLUSTERS = [
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
  { lon: 86.4, lat: 23.7, n: 25, sx: 0.4, sy: 0.3, cls: "industrial" },
];

KIT.CLASS_COLOR = { crop: "#3DDC97", forest: "#FF4D6D", industrial: "#FFB547", unknown: "#9AA6BD" };

KIT.firePoints = function (seed, scale) {
  const r = KIT.rng(seed || 7);
  const pts = [];
  const k = scale || 1;
  KIT.FIRE_CLUSTERS.forEach(function (c) {
    const n = Math.round(c.n * k);
    for (let i = 0; i < n; i++) {
      const u = r() + r() + r() - 1.5;
      const v = r() + r() + r() - 1.5;
      pts.push({ lon: c.lon + u * c.sx, lat: c.lat + v * c.sy, cls: c.cls, frp: Math.exp(r() * 3.5), sensor: r() < 0.72 ? "VIIRS" : "MODIS" });
    }
  });
  return pts;
};

KIT.loadWorld = async function () {
  const topo = await (await fetch("/node_modules/world-atlas/land-50m.json")).json();
  const countries = await (await fetch("/node_modules/world-atlas/countries-50m.json")).json();
  KIT.land = topojson.feature(topo, topo.objects.land);
  KIT.borders = topojson.mesh(countries, countries.objects.countries, function (a, b) { return a !== b; });
  KIT.countries = topojson.feature(countries, countries.objects.countries);
};

KIT.globe = function (svgSel, o) {
  const opt = Object.assign({ w: 800, h: 800, rotate: [-78, -18, 0], scale: 360, cx: null, cy: null, points: true, hex: false, orbit: false, terminator: false, grat: true, glow: true, pointSize: 1.4, borders: true, landFill: "#1A2B4D", ocean0: "#0D1B36", ocean1: "#050A16", seed: 7, density: 1, hexRes: 2, hexColor: "#FF6A3D", sensorFilter: null, colorBy: "heat", highlight: null }, o || {});
  const svg = d3.select(svgSel).attr("width", opt.w).attr("height", opt.h).attr("viewBox", "0 0 " + opt.w + " " + opt.h);
  const cx = opt.cx === null ? opt.w / 2 : opt.cx;
  const cy = opt.cy === null ? opt.h / 2 : opt.cy;
  const proj = d3.geoOrthographic().scale(opt.scale).translate([cx, cy]).rotate(opt.rotate).clipAngle(90);
  const path = d3.geoPath(proj);
  const id = "g" + Math.floor(Math.random() * 1e6);
  const defs = svg.append("defs");
  const og = defs.append("radialGradient").attr("id", id + "oc").attr("cx", "38%").attr("cy", "32%").attr("r", "75%");
  og.append("stop").attr("offset", "0%").attr("stop-color", opt.ocean0);
  og.append("stop").attr("offset", "100%").attr("stop-color", opt.ocean1);
  const gg = defs.append("radialGradient").attr("id", id + "gl").attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
  gg.append("stop").attr("offset", "84%").attr("stop-color", "#49C7F5").attr("stop-opacity", 0.0);
  gg.append("stop").attr("offset", "90%").attr("stop-color", "#49C7F5").attr("stop-opacity", 0.22);
  gg.append("stop").attr("offset", "100%").attr("stop-color", "#49C7F5").attr("stop-opacity", 0.0);
  const fg = defs.append("filter").attr("id", id + "blur").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
  fg.append("feGaussianBlur").attr("stdDeviation", 2.2);
  const shade = defs.append("radialGradient").attr("id", id + "sh").attr("cx", "35%").attr("cy", "30%").attr("r", "80%");
  shade.append("stop").attr("offset", "0%").attr("stop-color", "#ffffff").attr("stop-opacity", 0.07);
  shade.append("stop").attr("offset", "60%").attr("stop-color", "#000000").attr("stop-opacity", 0.0);
  shade.append("stop").attr("offset", "100%").attr("stop-color", "#000000").attr("stop-opacity", 0.45);
  if (opt.glow) {
    svg.append("circle").attr("cx", cx).attr("cy", cy).attr("r", opt.scale * 1.18).attr("fill", "url(#" + id + "gl)");
  }
  svg.append("path").datum({ type: "Sphere" }).attr("d", path).attr("fill", "url(#" + id + "oc)");
  if (opt.grat) {
    svg.append("path").datum(d3.geoGraticule().step([15, 15])()).attr("d", path).attr("fill", "none").attr("stroke", "#5D7BB8").attr("stroke-opacity", 0.16).attr("stroke-width", 0.6);
  }
  svg.append("path").datum(KIT.land).attr("d", path).attr("fill", opt.landFill).attr("stroke", "#2D4470").attr("stroke-width", 0.5);
  if (opt.borders) {
    svg.append("path").datum(KIT.borders).attr("d", path).attr("fill", "none").attr("stroke", "#3A5486").attr("stroke-opacity", 0.55).attr("stroke-width", 0.4);
  }
  if (opt.highlight) {
    svg.append("path").datum(opt.highlight).attr("d", path).attr("fill", "rgba(255,106,61,0.18)").attr("stroke", "#FF6A3D").attr("stroke-width", 1.2);
  }
  let pts = KIT.firePoints(opt.seed, opt.density);
  if (opt.sensorFilter) {
    pts = pts.filter(function (p) { return p.sensor === opt.sensorFilter; });
  }
  if (opt.hex) {
    const counts = {};
    pts.forEach(function (p) {
      const c = h3.latLngToCell(p.lat, p.lon, opt.hexRes);
      counts[c] = (counts[c] || 0) + 1;
    });
    let maxC = 1;
    Object.keys(counts).forEach(function (k) { if (counts[k] > maxC) { maxC = counts[k]; } });
    const hexColor = d3.scaleSequential(d3.interpolateRgbBasis(["#3B1D0F", "#C2410C", "#FF6A3D", "#FFD08A"])).domain([0, Math.log(maxC + 1)]);
    Object.keys(counts).forEach(function (k) {
      const b = h3.cellToBoundary(k, true);
      const ring = b.slice().reverse();
      ring.push(ring[0]);
      svg.append("path").datum({ type: "Polygon", coordinates: [ring] }).attr("d", path).attr("fill", hexColor(Math.log(counts[k] + 1))).attr("fill-opacity", 0.85).attr("stroke", "#060A13").attr("stroke-width", 0.6);
    });
  }
  if (opt.points) {
    const gp = svg.append("g");
    const glowLayer = svg.append("g").attr("filter", "url(#" + id + "blur)");
    pts.forEach(function (p) {
      const xy = proj([p.lon, p.lat]);
      const vis = d3.geoDistance([p.lon, p.lat], [-opt.rotate[0], -opt.rotate[1]]) < Math.PI / 2;
      if (!xy || !vis) { return; }
      let col = "#FF8A3D";
      if (opt.colorBy === "class") { col = KIT.CLASS_COLOR[p.cls]; }
      if (opt.colorBy === "sensor") { col = p.sensor === "VIIRS" ? "#FF8A3D" : "#8FB8FF"; }
      const rr = opt.pointSize * (0.7 + Math.min(p.frp, 25) / 30);
      glowLayer.append("circle").attr("cx", xy[0]).attr("cy", xy[1]).attr("r", rr * 2.6).attr("fill", col).attr("opacity", 0.35);
      gp.append("circle").attr("cx", xy[0]).attr("cy", xy[1]).attr("r", rr).attr("fill", col).attr("opacity", 0.95);
    });
  }
  if (opt.terminator) {
    const now = opt.terminator;
    const anti = [-(now.sunLon) + 180, -now.sunLat];
    const circle = d3.geoCircle().center([anti[0] > 180 ? anti[0] - 360 : anti[0], anti[1]]).radius(90)();
    svg.append("path").datum(circle).attr("d", path).attr("fill", "#000814").attr("fill-opacity", 0.55);
  }
  if (opt.orbit) {
    const tracks = opt.orbit === true ? [{ inc: 98.7, node: -100, color: "#49C7F5" }] : opt.orbit;
    tracks.forEach(function (t) {
      const coords = [];
      for (let a = 0; a <= 360; a += 2) {
        const ar = a * Math.PI / 180;
        const inc = t.inc * Math.PI / 180;
        const lat = Math.asin(Math.sin(inc) * Math.sin(ar)) * 180 / Math.PI;
        let lon = t.node + Math.atan2(Math.cos(inc) * Math.sin(ar), Math.cos(ar)) * 180 / Math.PI - a * 0.25;
        coords.push([((lon + 540) % 360) - 180, lat]);
      }
      svg.append("path").datum({ type: "LineString", coordinates: coords }).attr("d", path).attr("fill", "none").attr("stroke", t.color).attr("stroke-width", 1.6).attr("stroke-dasharray", "6 5").attr("opacity", 0.9);
      if (t.satA !== undefined) {
        const xy = proj(coords[Math.round(t.satA / 2)]);
        if (xy) {
          svg.append("circle").attr("cx", xy[0]).attr("cy", xy[1]).attr("r", 6).attr("fill", t.color);
          svg.append("circle").attr("cx", xy[0]).attr("cy", xy[1]).attr("r", 14).attr("fill", "none").attr("stroke", t.color).attr("stroke-opacity", 0.5);
        }
      }
    });
  }
  svg.append("path").datum({ type: "Sphere" }).attr("d", path).attr("fill", "url(#" + id + "sh)").attr("stroke", "#49C7F5").attr("stroke-opacity", 0.25).attr("stroke-width", 1);
  return { proj: proj, path: path, svg: svg };
};

KIT.lineChart = function (svgSel, o) {
  const opt = Object.assign({ w: 500, h: 220, series: [], xLabels: null, yMin: null, yMax: null, pad: [24, 16, 26, 40], band: null, vline: null, grid: true, dark: true }, o);
  const svg = d3.select(svgSel).attr("width", opt.w).attr("height", opt.h);
  const n = opt.series[0].values.length;
  const all = [];
  opt.series.forEach(function (s) { s.values.forEach(function (v) { all.push(v); }); });
  if (opt.band) { opt.band.lo.forEach(function (v) { all.push(v); }); opt.band.hi.forEach(function (v) { all.push(v); }); }
  const x = d3.scaleLinear().domain([0, n - 1]).range([opt.pad[3], opt.w - opt.pad[1]]);
  const y = d3.scaleLinear().domain([opt.yMin !== null ? opt.yMin : d3.min(all) * 0.9, opt.yMax !== null ? opt.yMax : d3.max(all) * 1.08]).range([opt.h - opt.pad[2], opt.pad[0]]);
  const axisCol = opt.dark ? "#67728A" : "#8A8270";
  if (opt.grid) {
    y.ticks(4).forEach(function (t) {
      svg.append("line").attr("x1", opt.pad[3]).attr("x2", opt.w - opt.pad[1]).attr("y1", y(t)).attr("y2", y(t)).attr("stroke", axisCol).attr("stroke-opacity", 0.25);
      svg.append("text").attr("x", opt.pad[3] - 6).attr("y", y(t) + 4).attr("text-anchor", "end").attr("font-size", 10).attr("fill", axisCol).attr("font-family", "JB").text(t);
    });
  }
  if (opt.band) {
    const area = d3.area().x(function (d, i) { return x(i); }).y0(function (d, i) { return y(opt.band.lo[i]); }).y1(function (d, i) { return y(opt.band.hi[i]); });
    svg.append("path").datum(opt.band.lo).attr("d", area).attr("fill", opt.band.color).attr("opacity", 0.18);
  }
  if (opt.vline !== null) {
    svg.append("line").attr("x1", x(opt.vline.at)).attr("x2", x(opt.vline.at)).attr("y1", opt.pad[0]).attr("y2", opt.h - opt.pad[2]).attr("stroke", opt.vline.color).attr("stroke-dasharray", "4 4");
    svg.append("text").attr("x", x(opt.vline.at) + 6).attr("y", opt.pad[0] + 12).attr("font-size", 11).attr("fill", opt.vline.color).attr("font-family", "Inter").text(opt.vline.label);
  }
  opt.series.forEach(function (s) {
    const line = d3.line().x(function (d, i) { return x(i); }).y(function (d) { return y(d); }).curve(d3.curveMonotoneX);
    svg.append("path").datum(s.values).attr("d", line).attr("fill", "none").attr("stroke", s.color).attr("stroke-width", s.width || 2.4).attr("stroke-dasharray", s.dash || null);
    if (s.dots) {
      s.values.forEach(function (v, i) { svg.append("circle").attr("cx", x(i)).attr("cy", y(v)).attr("r", 2.6).attr("fill", s.color); });
    }
  });
  if (opt.xLabels) {
    opt.xLabels.forEach(function (lab, i) {
      if (lab !== "") {
        svg.append("text").attr("x", x(i)).attr("y", opt.h - 8).attr("text-anchor", "middle").attr("font-size", 10).attr("fill", axisCol).attr("font-family", "JB").text(lab);
      }
    });
  }
  return { x: x, y: y, svg: svg };
};

KIT.bars = function (svgSel, o) {
  const opt = Object.assign({ w: 400, h: 200, values: [], labels: [], colors: null, color: "#FF6A3D", pad: [20, 10, 28, 36], yMax: null, fmt: null, dark: true }, o);
  const svg = d3.select(svgSel).attr("width", opt.w).attr("height", opt.h);
  const x = d3.scaleBand().domain(d3.range(opt.values.length)).range([opt.pad[3], opt.w - opt.pad[1]]).padding(0.28);
  const y = d3.scaleLinear().domain([0, opt.yMax || d3.max(opt.values) * 1.15]).range([opt.h - opt.pad[2], opt.pad[0]]);
  const axisCol = opt.dark ? "#67728A" : "#8A8270";
  opt.values.forEach(function (v, i) {
    const col = opt.colors ? opt.colors[i] : opt.color;
    svg.append("rect").attr("x", x(i)).attr("y", y(v)).attr("width", x.bandwidth()).attr("height", y(0) - y(v)).attr("rx", 4).attr("fill", col);
    if (opt.fmt) {
      svg.append("text").attr("x", x(i) + x.bandwidth() / 2).attr("y", y(v) - 5).attr("text-anchor", "middle").attr("font-size", 10.5).attr("fill", opt.dark ? "#EEF2FA" : "#1B2233").attr("font-family", "JB").text(opt.fmt(v));
    }
    svg.append("text").attr("x", x(i) + x.bandwidth() / 2).attr("y", opt.h - 9).attr("text-anchor", "middle").attr("font-size", 10).attr("fill", axisCol).attr("font-family", "Inter").text(opt.labels[i]);
  });
  svg.append("line").attr("x1", opt.pad[3]).attr("x2", opt.w - opt.pad[1]).attr("y1", y(0)).attr("y2", y(0)).attr("stroke", axisCol);
  return svg;
};

KIT.heat = function (svgSel, o) {
  const opt = Object.assign({ w: 700, h: 420, rows: [], rowLabels: [], colLabels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], max: null, mark: [], pad: [24, 8, 8, 52], dark: true, gap: 3 }, o);
  const svg = d3.select(svgSel).attr("width", opt.w).attr("height", opt.h);
  const nr = opt.rows.length;
  const nc = opt.rows[0].length;
  const cw = (opt.w - opt.pad[3] - opt.pad[1]) / nc;
  const ch = (opt.h - opt.pad[0] - opt.pad[2]) / nr;
  let mx = opt.max;
  if (mx === null) { mx = d3.max(opt.rows, function (r) { return d3.max(r); }); }
  const col = d3.scaleSequential(d3.interpolateRgbBasis(opt.dark ? ["#101A2E", "#3B1D0F", "#9A3412", "#FF6A3D", "#FFD08A"] : ["#F3ECDD", "#F6C9A0", "#F08A4B", "#C2410C", "#6B1D0B"])).domain([0, mx]);
  opt.colLabels.forEach(function (c, j) {
    svg.append("text").attr("x", opt.pad[3] + j * cw + cw / 2).attr("y", opt.pad[0] - 8).attr("text-anchor", "middle").attr("font-size", 11).attr("fill", opt.dark ? "#9AA6BD" : "#5A5547").attr("font-family", "SG").text(c);
  });
  opt.rows.forEach(function (r, i) {
    svg.append("text").attr("x", opt.pad[3] - 8).attr("y", opt.pad[0] + i * ch + ch / 2 + 4).attr("text-anchor", "end").attr("font-size", 10.5).attr("fill", opt.dark ? "#9AA6BD" : "#5A5547").attr("font-family", "JB").text(opt.rowLabels[i]);
    r.forEach(function (v, j) {
      svg.append("rect").attr("x", opt.pad[3] + j * cw + opt.gap / 2).attr("y", opt.pad[0] + i * ch + opt.gap / 2).attr("width", cw - opt.gap).attr("height", ch - opt.gap).attr("rx", 3).attr("fill", col(Math.min(v, mx)));
    });
  });
  opt.mark.forEach(function (m) {
    svg.append("rect").attr("x", opt.pad[3] + m[1] * cw).attr("y", opt.pad[0] + m[0] * ch).attr("width", cw).attr("height", ch).attr("fill", "none").attr("stroke", m[2] || "#49C7F5").attr("stroke-width", 2.4).attr("rx", 4);
  });
  return { svg: svg, cw: cw, ch: ch };
};

KIT.calendarData = function (seed, harmonised) {
  const r = KIT.rng(seed || 11);
  const base = [0.3, 0.4, 0.8, 2.6, 3.1, 0.9, 0.2, 0.15, 0.4, 3.6, 5.2, 0.7];
  const rows = [];
  for (let y = 2003; y <= 2025; y++) {
    const row = [];
    for (let m = 0; m < 12; m++) {
      let v = base[m] * (1 + (r() - 0.5) * 0.45);
      if (!harmonised && y >= 2012) { v = v * 2.5; }
      if (y === 2016 && m === 10) { v = v * 1.55; }
      if (y >= 2022 && m === 10) { v = v * 0.55; }
      row.push(v);
    }
    rows.push(row);
  }
  return rows;
};

KIT.logo = function (svgSel, size, opt) {
  const o = Object.assign({ ring: "#EEF2FA", ember: "#FF6A3D", orbit: "#49C7F5", mono: false }, opt || {});
  const s = size;
  const svg = d3.select(svgSel).attr("width", s).attr("height", s).attr("viewBox", "0 0 100 100");
  svg.append("circle").attr("cx", 50).attr("cy", 50).attr("r", 40).attr("fill", "none").attr("stroke", o.ring).attr("stroke-width", 4);
  for (let i = 0; i < 12; i++) {
    const a = i * 30 * Math.PI / 180;
    const r1 = i % 3 === 0 ? 30 : 33;
    svg.append("line").attr("x1", 50 + Math.sin(a) * r1).attr("y1", 50 - Math.cos(a) * r1).attr("x2", 50 + Math.sin(a) * 36).attr("y2", 50 - Math.cos(a) * 36).attr("stroke", o.ring).attr("stroke-width", i % 3 === 0 ? 3 : 1.6).attr("stroke-linecap", "round");
  }
  svg.append("ellipse").attr("cx", 50).attr("cy", 50).attr("rx", 14).attr("ry", 40).attr("fill", "none").attr("stroke", o.ring).attr("stroke-opacity", 0.55).attr("stroke-width", 1.6);
  svg.append("ellipse").attr("cx", 50).attr("cy", 50).attr("rx", 46).attr("ry", 13).attr("transform", "rotate(-28 50 50)").attr("fill", "none").attr("stroke", o.mono ? o.ring : o.orbit).attr("stroke-width", 2.6);
  const a = 1.5 * 30 * Math.PI / 180;
  svg.append("circle").attr("cx", 50 + Math.sin(a) * 40).attr("cy", 50 - Math.cos(a) * 40).attr("r", 7.5).attr("fill", o.mono ? o.ring : o.ember);
  svg.append("circle").attr("cx", 50).attr("cy", 50).attr("r", 3.2).attr("fill", o.ring);
};

KIT.markAll = function () {
  const out = [];
  document.querySelectorAll("[data-mark]").forEach(function (el) {
    const b = el.getBoundingClientRect();
    out.push({ n: el.getAttribute("data-mark"), x: b.left, y: b.top, w: b.width, h: b.height });
  });
  return out;
};

KIT.topbar = function (active, chips) {
  const items = ["Home", "Explorer", "Calendar", "Sensor Lab", "Data Studio", "Formulas", "Validation", "Sources", "Blind Spot", "Learn"];
  const nav = items.map(function (it) {
    if (it === active) { return '<span class="on">' + it + "</span>"; }
    return "<span>" + it + "</span>";
  }).join("");
  const ch = chips || '<span class="chip archive"><span class="dot"></span>ARCHIVE</span><span class="chip live"><span class="dot"></span>LIVE NRT</span>';
  const html = '<div class="topbar"><div class="brand"><svg id="logo"></svg><div>FIREWORK CHRONOS<small>EARTH INTELLIGENCE ATLAS</small></div></div><div class="nav">' + nav + '</div><div class="spacer"></div><div class="row" data-mark="0">' + ch + '</div><span class="btn ghost" style="padding:7px 10px">⌘K Search</span></div>';
  document.getElementById("app").insertAdjacentHTML("afterbegin", html);
  KIT.logo("#logo", 34);
};

KIT.region = async function (svgSel, o) {
  const opt = Object.assign({ w: 900, h: 520, bbox: [73.5, 28.8, 77.3, 32.3], sensorFilter: null, colorBy: "sensor", density: 3, seed: 5, pointSize: 2.4, grid: 0, hex: false, hexRes: 5, land: "#16233F", states: true, burned: false, clouds: false }, o || {});
  if (!KIT.india) { KIT.india = await (await fetch("/data/india_states.json")).json(); }
  const svg = d3.select(svgSel).attr("width", opt.w).attr("height", opt.h);
  const b = opt.bbox;
  const box = { type: "Feature", geometry: { type: "Polygon", coordinates: [[[b[0], b[1]], [b[0], b[3]], [b[2], b[3]], [b[2], b[1]], [b[0], b[1]]]] } };
  const proj = d3.geoMercator().fitSize([opt.w, opt.h], box);
  const path = d3.geoPath(proj);
  svg.append("rect").attr("width", opt.w).attr("height", opt.h).attr("fill", "#0A1326");
  if (KIT.countries) { svg.append("path").datum(KIT.countries).attr("d", path).attr("fill", opt.land).attr("stroke", "#2D4470").attr("stroke-width", 0.8); }
  if (opt.states) {
    KIT.india.features.forEach(function (f) {
      let fill = opt.land;
      if (f.properties.name === "Punjab" || f.properties.name === "Haryana") { fill = "#1E2E52"; }
      svg.append("path").datum(f).attr("d", path).attr("fill", fill).attr("stroke", "#3A5486").attr("stroke-width", 0.9);
    });
  }
  if (opt.grid > 0) {
    for (let x = Math.floor(b[0] / opt.grid) * opt.grid; x <= b[2]; x += opt.grid) {
      svg.append("path").datum({ type: "LineString", coordinates: [[x, b[1] - 1], [x, b[3] + 1]] }).attr("d", path).attr("stroke", "#49C7F5").attr("stroke-opacity", 0.16).attr("fill", "none");
    }
    for (let y = Math.floor(b[1] / opt.grid) * opt.grid; y <= b[3]; y += opt.grid) {
      svg.append("path").datum({ type: "LineString", coordinates: [[b[0] - 1, y], [b[2] + 1, y]] }).attr("d", path).attr("stroke", "#49C7F5").attr("stroke-opacity", 0.16).attr("fill", "none");
    }
  }
  const r = KIT.rng(opt.seed);
  const pts = [];
  const centers = [[75.6, 30.7, 0.9, 0.45], [76.2, 30.2, 0.6, 0.4], [74.9, 30.9, 0.5, 0.35], [76.6, 29.6, 0.6, 0.4], [75.2, 30.2, 0.5, 0.4]];
  centers.forEach(function (c) {
    const n = Math.round(90 * opt.density);
    for (let i = 0; i < n; i++) {
      const u = r() + r() + r() - 1.5;
      const v = r() + r() + r() - 1.5;
      pts.push({ lon: c[0] + u * c[2], lat: c[1] + v * c[3], sensor: r() < 0.72 ? "VIIRS" : "MODIS", cls: r() < 0.88 ? "crop" : (r() < 0.5 ? "industrial" : "unknown"), frp: Math.exp(r() * 2.5) });
    }
  });
  pts.push({ lon: 76.85, lat: 30.95, sensor: "VIIRS", cls: "industrial", frp: 30 });
  let shown = pts;
  if (opt.sensorFilter) { shown = pts.filter(function (p) { return p.sensor === opt.sensorFilter; }); }
  if (opt.hex) {
    const counts = {};
    shown.forEach(function (p) { const c = h3.latLngToCell(p.lat, p.lon, opt.hexRes); counts[c] = (counts[c] || 0) + 1; });
    let maxC = 1;
    Object.keys(counts).forEach(function (k) { if (counts[k] > maxC) { maxC = counts[k]; } });
    const hc = d3.scaleSequential(d3.interpolateRgbBasis(["#3B1D0F", "#C2410C", "#FF6A3D", "#FFD08A"])).domain([0, Math.log(maxC + 1)]);
    Object.keys(counts).forEach(function (k) {
      const ring = h3.cellToBoundary(k, true).slice().reverse();
      ring.push(ring[0]);
      svg.append("path").datum({ type: "Polygon", coordinates: [ring] }).attr("d", path).attr("fill", hc(Math.log(counts[k] + 1))).attr("fill-opacity", 0.85).attr("stroke", "#060A13").attr("stroke-width", 0.8);
    });
  }
  if (opt.clouds) {
    const cr = KIT.rng(99);
    for (let i = 0; i < 9; i++) {
      const xy = proj([b[0] + cr() * (b[2] - b[0]), b[1] + cr() * (b[3] - b[1])]);
      svg.append("ellipse").attr("cx", xy[0]).attr("cy", xy[1]).attr("rx", 40 + cr() * 70).attr("ry", 20 + cr() * 30).attr("fill", "#DDE6F5").attr("opacity", 0.18);
    }
  }
  if (!opt.hex) {
    shown.forEach(function (p) {
      const xy = proj([p.lon, p.lat]);
      let col = p.sensor === "VIIRS" ? "#FF8A3D" : "#8FB8FF";
      if (opt.colorBy === "class") { col = KIT.CLASS_COLOR[p.cls]; }
      if (opt.colorBy === "heat") { col = "#FF8A3D"; }
      const rr = opt.pointSize * (p.sensor === "MODIS" ? 1.5 : 1);
      svg.append("circle").attr("cx", xy[0]).attr("cy", xy[1]).attr("r", rr * 2.4).attr("fill", col).attr("opacity", 0.18);
      svg.append("circle").attr("cx", xy[0]).attr("cy", xy[1]).attr("r", rr).attr("fill", col).attr("opacity", 0.95);
    });
  }
  return { proj: proj, path: path, svg: svg, pts: pts };
};
