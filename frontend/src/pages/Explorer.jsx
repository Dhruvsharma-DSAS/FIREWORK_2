import { useState, useEffect } from "react"
import Topbar from "../components/Topbar.jsx"
import Globe from "../components/Globe.jsx"
import LayerPanel from "../components/LayerPanel.jsx"
import CellInspector from "../components/CellInspector.jsx"
import Timeline from "../components/Timeline.jsx"
import { getShell } from "../api/shell.js"
import { getExplorer } from "../api/explorer.js"
import { getWorld } from "../api/geo.js"

const START_LAYERS = { viirs: true, modis: true, hex: true, burned: false, landcover: false, clear: true, terminator: true, tracks: true }

function Explorer() {
  const [shell, setShell] = useState(null)
  const [page, setPage] = useState(null)
  const [world, setWorld] = useState(null)
  const [layers, setLayers] = useState(START_LAYERS)
  const [colorBy, setColorBy] = useState("sensor")

  useEffect(function () {
    getShell().then(setShell)
    getExplorer().then(setPage)
    getWorld().then(setWorld)
  }, [])

  function toggleLayer(name) {
    const next = { ...layers }
    next[name] = !layers[name]
    setLayers(next)
  }

  let chips = []
  if (shell) {
    chips = shell.data.chips
  }

  if (page === null) {
    return (
      <div className="app">
        <Topbar active="Explorer" chips={chips} />
      </div>
    )
  }

  const d = page.data
  const g = d.globe
  const points = g.points.filter(function (p) {
    if (p.sensor === "VIIRS") {
      return layers.viirs
    }
    return layers.modis
  })
  let hexes = []
  if (layers.hex) {
    hexes = g.hexes
  }
  let terminator = null
  if (layers.terminator) {
    terminator = g.terminator
  }
  let orbits = []
  if (layers.tracks) {
    orbits = g.orbits
  }
  let highlight = null
  if (world) {
    highlight = world.india
  }
  const activeCount = Object.keys(layers).filter(function (k) {
    return layers[k]
  }).length

  return (
    <div className="app">
      <Globe
        id="explorer"
        style={{ position: "absolute", left: 300, top: 64 }}
        options={{ w: 960, h: 820, scale: 640, cx: 470, cy: 470, rotate: g.rotate, pointSize: 1.6, colorBy: colorBy }}
        world={world}
        highlight={highlight}
        points={points}
        hexes={hexes}
        terminator={terminator}
        orbits={orbits}
      />
      <LayerPanel layers={layers} onToggle={toggleLayer} colorBy={colorBy} onColorBy={setColorBy} confidence={d.confidence} activeCount={activeCount} />
      <div className="panel" style={{ position: "absolute", left: 320, top: 84, width: 420, height: 48, display: "flex", alignItems: "center", padding: "0 14px", gap: 10 }}>
        <span className="dim">⌕</span><span style={{ fontSize: 14 }}>{d.place.name}</span><span className="spacer"></span><span className="chip"><span className="mono">{d.place.bbox.join(", ")}</span></span>
      </div>
      <CellInspector cell={d.cell} />
      <div className="panel" style={{ position: "absolute", right: 20, top: 520, width: 330 }}>
        <div className="panel-h"><span className="caps">Sensors over this cell</span></div>
        <div className="panel-b" style={{ fontSize: 12.5 }}>
          {d.overpasses.map(function (o) {
            let color = "#8FB8FF"
            if (o.sensor === "VIIRS") {
              color = "#FF8A3D"
            }
            return <div key={o.satellite} className="kv"><span><span className="legend-swatch" style={{ background: color }}></span> {o.satellite}</span><b>{o.local_time}</b></div>
          })}
          <div className="kv" style={{ border: 0 }}><span><span className="legend-swatch" style={{ background: "#9AA6BD" }}></span> Burning peak ({d.burning_peak.year})</span><b style={{ color: "var(--flame)" }}>{d.burning_peak.label}</b></div>
        </div>
      </div>
      <Timeline timeline={d.timeline} />
      <Topbar active="Explorer" chips={chips} meta={page.meta} />
    </div>
  )
}

export default Explorer
