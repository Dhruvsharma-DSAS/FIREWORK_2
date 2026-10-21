import { useState, useEffect } from "react"
import Topbar from "../components/Topbar.jsx"
import DemoBanner from "../components/DemoBanner.jsx"
import RegionMap from "../components/RegionMap.jsx"
import Bars from "../components/Bars.jsx"
import Lines from "../components/Lines.jsx"
import { getShell } from "../api/shell.js"
import { getSensorLab } from "../api/pages.js"
import { getRegionBase } from "../api/geo.js"

const MAP_W = 900
const MAP_H = 520
const MODES = ["Day", "Night", "Both"]

function SensorLab() {
  const [shell, setShell] = useState(null)
  const [page, setPage] = useState(null)
  const [base, setBase] = useState(null)
  const [split, setSplit] = useState(MAP_W / 2)
  const [dragging, setDragging] = useState(false)
  const [mode, setMode] = useState("Day")

  useEffect(function () {
    getShell().then(setShell)
    getSensorLab().then(setPage)
    getRegionBase().then(setBase)
  }, [])

  let chips = []
  if (shell) {
    chips = shell.data.chips
  }

  if (page === null) {
    return (
      <div className="app">
        <Topbar active="Sensor Lab" chips={chips} />
      </div>
    )
  }

  const d = page.data

  function moveTo(clientX, el) {
    const box = el.getBoundingClientRect()
    setSplit(Math.max(40, Math.min(MAP_W - 40, clientX - box.left)))
  }

  function onDown(e) {
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    moveTo(e.clientX, e.currentTarget)
  }

  function onMove(e) {
    if (dragging) {
      moveTo(e.clientX, e.currentTarget)
    }
  }

  function onUp() {
    setDragging(false)
  }

  function onKey(e) {
    if (e.key === "ArrowLeft") {
      setSplit(Math.max(40, split - 20))
    }
    if (e.key === "ArrowRight") {
      setSplit(Math.min(MAP_W - 40, split + 20))
    }
  }

  const k = d.k_by_month
  const det = d.detection
  const rh = d.raw_vs_harmonised
  let rhBody = <Lines w={868} h={190} series={[{ values: rh.raw, color: "#FF4D6D", dots: true }, { values: rh.harmonised, color: "#3DDC97", dots: true }]} xLabels={rh.x_labels} vline={{ at: rh.seam_index, color: "#49C7F5", label: rh.seam_label }} />
  if (mode !== "Day") {
    rhBody = <div className="warn" style={{ marginTop: 40 }}>{mode} series needs the archive run. The demo fixture only has day-time overpasses.</div>
  }

  return (
    <div className="app">
      <div style={{ position: "absolute", left: 32, top: 92 }}>
        <div className="caps" style={{ color: "var(--flame)" }}>Satellite comparison lab</div>
        <h1 className="display" style={{ fontSize: 40, marginTop: 6 }}>Same place, two rulers</h1>
      </div>
      <div className="panel" style={{ position: "absolute", left: 32, top: 180, width: MAP_W, height: MAP_H, overflow: "hidden", cursor: "ew-resize", touchAction: "none" }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <RegionMap w={MAP_W} h={MAP_H} bbox={d.region.bbox} points={d.points} base={base} sensorFilter={d.left.sensor} colorBy="sensor" pointSize={2.4} grid={d.region.grid_deg} style={{ position: "absolute", left: 0, top: 0 }} />
        <div style={{ position: "absolute", left: split, top: 0, bottom: 0, width: MAP_W - split, overflow: "hidden" }}>
          <RegionMap w={MAP_W} h={MAP_H} bbox={d.region.bbox} points={d.points} base={base} sensorFilter={d.right.sensor} colorBy="sensor" pointSize={2.4} grid={d.region.grid_deg} style={{ position: "absolute", left: -split, top: 0 }} />
        </div>
        <div style={{ position: "absolute", left: split - 2, top: 0, bottom: 0, width: 4, background: "var(--text)" }}></div>
        <div role="slider" tabIndex={0} aria-label="Swipe between MODIS and VIIRS" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(split / MAP_W * 100)} onKeyDown={onKey} style={{ position: "absolute", left: split - 22, top: 240, width: 44, height: 44, borderRadius: "50%", background: "var(--text)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>⟷</div>
        <span className="chip" style={{ position: "absolute", left: 16, top: 14, background: "rgba(6,10,19,.7)" }}><span className="dot" style={{ background: d.left.color }}></span>{d.left.label}</span>
        <span className="chip" style={{ position: "absolute", right: 16, top: 14, background: "rgba(6,10,19,.7)" }}><span className="dot" style={{ background: d.right.color }}></span>{d.right.label}</span>
      </div>
      <div className="panel" style={{ position: "absolute", right: 32, top: 180, width: 600, height: 250 }}>
        <div className="panel-h"><span className="caps">{k.title}</span><DemoBanner meta={page.meta} /></div>
        <div className="panel-b"><Bars w={568} h={190} values={k.values} labels={k.labels} color="#FF8A3D" fmt={function (v) { return v.toFixed(1) }} /></div>
      </div>
      <div className="panel" style={{ position: "absolute", right: 32, top: 450, width: 600, height: 250 }}>
        <div className="panel-h"><span className="caps">{det.title}</span><span className="mono faint" style={{ fontSize: 11 }}>{det.note}</span></div>
        <div className="panel-b"><Lines w={568} h={190} series={[{ values: det.values, color: "#8FB8FF" }]} xLabels={det.x_labels} yMin={0} yMax={1} vline={{ at: det.frp50_index, color: "#FF4D6D", label: "FRP50" }} /></div>
      </div>
      <div className="panel" style={{ position: "absolute", left: 32, top: 720, width: 900, height: 250 }}>
        <div className="panel-h">
          <span className="caps">{rh.title}</span>
          <div className="seg">
            {MODES.map(function (m) {
              let cls = ""
              if (m === mode) {
                cls = "on"
              }
              return <span key={m} className={cls} onClick={function () { setMode(m) }}>{m}</span>
            })}
          </div>
        </div>
        <div className="panel-b">{rhBody}</div>
      </div>
      <div className="panel" style={{ position: "absolute", right: 32, top: 720, width: 600, height: 250 }}>
        <div className="panel-h"><span className="caps">Model fit</span><span className="chip archive"><span className="dot"></span>{d.model.family}</span></div>
        <div className="panel-b" style={{ fontSize: 13 }}>
          {d.model.rows.map(function (r) {
            return <div key={r.label} className="kv"><span>{r.label}</span><b>{r.value}</b></div>
          })}
          <div className="mono faint" style={{ fontSize: 11, marginTop: 8 }}>{d.model.note}</div>
        </div>
      </div>
      <Topbar active="Sensor Lab" chips={chips} meta={page.meta} />
    </div>
  )
}

export default SensorLab
