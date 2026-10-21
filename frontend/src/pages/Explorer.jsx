import { useState, useEffect } from "react"
import Topbar from "../components/Topbar.jsx"
import { nightCells } from "../components/nightCells.js"
import LayerPanel from "../components/LayerPanel.jsx"
import CellInspector from "../components/CellInspector.jsx"
import Timeline from "../components/Timeline.jsx"
import { getShell } from "../api/shell.js"
import { getExplorer, getCell } from "../api/explorer.js"
import { getWorld } from "../api/geo.js"
import { getMapKit } from "../api/mapkit.js"

const START_LAYERS = { viirs: true, modis: true, hex: true, burned: false, landcover: false, clear: true, terminator: true, tracks: true }
const VIEW = { center: [80, 23], zoom: 3.09, frame: { left: -60, top: 0, right: 0, bottom: -68 } }
const ATTRIB_STYLE = { left: 304, bottom: 112 }

function Explorer() {
  const [shell, setShell] = useState(null)
  const [page, setPage] = useState(null)
  const [world, setWorld] = useState(null)
  const [layers, setLayers] = useState(START_LAYERS)
  const [colorBy, setColorBy] = useState("sensor")
  const [cell, setCell] = useState(null)
  const [selected, setSelected] = useState(null)
  const [night, setNight] = useState([])
  const [mapKit, setMapKit] = useState(null)

  useEffect(function () {
    getShell().then(setShell)
    getExplorer().then(function (body) {
      setPage(body)
      setCell(body.data.cell)
      setNight(nightCells(body.data.globe.terminator))
    })
    getWorld().then(setWorld)
    getMapKit().then(setMapKit)
  }, [])

  function toggleLayer(name) {
    const next = { ...layers }
    next[name] = !layers[name]
    setLayers(next)
  }

  function pickHex(id) {
    setSelected(id)
    getCell(id).then(function (body) {
      if (body.data !== null) {
        setCell(body.data)
      }
    })
  }

  let chips = []
  if (shell) {
    chips = shell.data.chips
  }

  if (page === null || world === null || cell === null || mapKit === null) {
    return (
      <div className="app fluid wide-nav">
        <Topbar active="Explorer" chips={chips} />
      </div>
    )
  }

  const GlobeMap = mapKit.default
  const d = page.data
  const activeCount = Object.keys(layers).filter(function (k) {
    return layers[k]
  }).length

  return (
    <div className="app fluid wide-nav">
      <GlobeMap
        world={world}
        view={VIEW}
        globe={d.globe}
        layers={layers}
        colorBy={colorBy}
        selected={selected}
        night={night}
        onPick={pickHex}
        attribStyle={ATTRIB_STYLE}
      />
      <LayerPanel layers={layers} onToggle={toggleLayer} colorBy={colorBy} onColorBy={setColorBy} confidence={d.confidence} activeCount={activeCount} />
      <div className="panel" style={{ position: "absolute", left: 320, top: 84, width: 420, height: 48, display: "flex", alignItems: "center", padding: "0 14px", gap: 10 }}>
        <span className="dim">⌕</span><span style={{ fontSize: 14 }}>{d.place.name}</span><span className="spacer"></span><span className="chip"><span className="mono">{d.place.bbox.join(", ")}</span></span>
      </div>
      <CellInspector cell={cell} />
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
