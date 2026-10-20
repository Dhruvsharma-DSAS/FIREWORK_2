import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import * as d3 from "d3"
import Topbar from "../components/Topbar.jsx"
import StatusChip from "../components/StatusChip.jsx"
import DemoBanner from "../components/DemoBanner.jsx"
import HeatGrid from "../components/HeatGrid.jsx"
import { HEAT_COLORS } from "../components/heatColors.js"
import LineChart from "../components/LineChart.jsx"
import { getShell } from "../api/shell.js"
import { getCalendar } from "../api/calendar.js"

const MARK_STYLE = {
  anomaly: { color: "#49C7F5", dashed: false },
  blind_spot: { color: "#FFB547", dashed: true }
}

function Calendar() {
  const params = useParams()
  const [shell, setShell] = useState(null)
  const [page, setPage] = useState(null)
  const [mode, setMode] = useState("harmonised")

  useEffect(function () {
    getShell().then(setShell)
  }, [])

  useEffect(function () {
    getCalendar(params.region).then(setPage)
  }, [params.region])

  let chips = []
  if (shell) {
    chips = shell.data.chips
  }

  if (page === null) {
    return (
      <div className="app">
        <Topbar active="Calendar" chips={chips} />
      </div>
    )
  }

  if (page.data === null) {
    return (
      <div className="app">
        <Topbar active="Calendar" chips={chips} />
        <div className="err" style={{ position: "absolute", left: 32, top: 96, width: 520 }}>{page.meta.error}</div>
      </div>
    )
  }

  const d = page.data
  const s = d.selected
  const firstYear = d.years[0]
  const lastYear = d.years[d.years.length - 1]
  let rows = d.harmonised
  if (mode === "raw") {
    rows = d.raw
  }
  const marks = d.marks.map(function (m) {
    return { row: m.year - firstYear, col: m.month - 1, color: MARK_STYLE[m.kind].color, dashed: MARK_STYLE[m.kind].dashed }
  })
  const legend = d3.interpolateRgbBasis(HEAT_COLORS)
  const legendSteps = []
  for (let i = 0; i < 40; i++) {
    legendSteps.push(i)
  }
  const xLabels = d.years.map(function (y, i) {
    if (i % 4 === 0) {
      return String(y)
    }
    return ""
  })
  let zText = String(s.z)
  if (s.z > 0) {
    zText = "+" + s.z
  }
  const season = d.season
  const slopeText = String(season.sen_slope).replace("-", "−")
  const modes = [{ key: "raw", label: "Raw counts" }, { key: "harmonised", label: "Harmonised" }]

  return (
    <div className="app">
      <Topbar active="Calendar" chips={chips} />
      <div style={{ position: "absolute", left: 32, top: 92 }}>
        <div className="caps" style={{ color: "var(--flame)" }}>Historical fire calendar</div>
        <h1 className="display" style={{ fontSize: 40, marginTop: 6 }}>{d.region_name} · {firstYear} → {lastYear}</h1>
        <div className="dim" style={{ fontSize: 14, marginTop: 4 }}>Unit: {d.unit} · grid {d.grid_deg}°</div>
      </div>
      <div className="row" style={{ position: "absolute", right: 32, top: 112, gap: 12 }}>
        <div className="seg">
          {modes.map(function (m) {
            let cls = ""
            if (m.key === mode) {
              cls = "on"
            }
            return <span key={m.key} className={cls} onClick={function () { setMode(m.key) }}>{m.label}</span>
          })}
        </div>
        <div className="seg"><span className="on">All sources</span><span>Crop</span><span>Forest</span><span>Industrial</span></div>
        <DemoBanner meta={page.meta} label="DEMO VALUES" />
      </div>
      <div className="panel" style={{ position: "absolute", left: 32, top: 200, width: 1010, height: 740, padding: 18 }}>
        <HeatGrid w={970} h={670} rows={rows} rowLabels={d.years.map(String)} max={d.max} marks={marks} />
        <div className="row" style={{ marginTop: 6, fontSize: 12 }}>
          <span className="dim">Low</span>
          <svg width="160" height="12">
            {legendSteps.map(function (i) {
              return <rect key={i} x={i * 4} y="0" width="4.6" height="12" fill={legend(i / 39)} />
            })}
          </svg>
          <span className="dim">High</span>
          <span style={{ marginLeft: 24, border: "2px solid var(--sky)", borderRadius: 4, width: 14, height: 14, display: "inline-block" }}></span>
          <span className="dim">unusual month (robust z &gt; {d.z_threshold})</span>
          <span style={{ marginLeft: 18, border: "2px dashed var(--flame)", borderRadius: 4, width: 14, height: 14, display: "inline-block" }}></span>
          <span className="dim">blind-spot flag</span>
        </div>
      </div>
      <div className="panel" style={{ position: "absolute", right: 32, top: 200, width: 500 }}>
        <div className="panel-h"><span className="caps">Selected · {s.month_label}</span><StatusChip kind={s.status} label={s.status.toUpperCase()} /></div>
        <div className="panel-b">
          <div className="row" style={{ gap: 12 }}>
            <div className="tile" style={{ flex: 1 }}><div className="caps dim">Value</div><div className="big">{s.value}</div><div className="mono faint" style={{ fontSize: 11 }}>{s.band_pct}% band {s.lo}–{s.hi}</div></div>
            <div className="tile" style={{ flex: 1 }}><div className="caps dim">Robust z</div><div className="big" style={{ color: "var(--sky)" }}>{zText}</div><div className="mono faint" style={{ fontSize: 11 }}>median {s.median} · MAD {s.mad}</div></div>
          </div>
          <div className="kv" style={{ marginTop: 10 }}><span>Converted from</span><b>{s.converted_from}</b></div>
          <div className="kv"><span>k̃ (shrunk)</span><b>{s.k} [{s.k_lo}–{s.k_hi}]</b></div>
          <div className="kv"><span>Era</span><b>{s.era}</b></div>
          <div className="kv"><span>Validation (LOYO, Nov)</span><b>median error {s.loyo_median_error_pct}%</b></div>
        </div>
      </div>
      <div className="panel" style={{ position: "absolute", right: 32, top: 520, width: 500, height: 420 }}>
        <div className="panel-h"><span className="caps">Season shape · {season.month_name} totals</span><span className="mono faint" style={{ fontSize: 11 }}>Sen slope {slopeText} / yr · p = {season.p} ({season.test})</span></div>
        <div className="panel-b">
          <LineChart w={468} h={250} values={season.values} lo={season.lo} hi={season.hi} color="#FF6A3D" xLabels={xLabels} vline={{ at: season.viirs_start_year - firstYear, color: "#49C7F5", label: "VIIRS starts" }} />
          <div className="warn" style={{ marginTop: 8 }}>{season.note}</div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
