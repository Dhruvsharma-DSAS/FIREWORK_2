import { useState, useEffect } from "react"
import * as d3 from "d3"
import Topbar from "../components/Topbar.jsx"
import StatusChip from "../components/StatusChip.jsx"
import Bars from "../components/Bars.jsx"
import Lines from "../components/Lines.jsx"
import { getShell } from "../api/shell.js"
import { getBlindSpot } from "../api/pages.js"

const CX = 260
const CY = 235
const R = 180

function hourAngle(h) {
  return h / 24 * 2 * Math.PI
}

function ClockArc(props) {
  const a = d3.arc().innerRadius(R - 15).outerRadius(R + 15).startAngle(hourAngle(props.from)).endAngle(hourAngle(props.to))
  return <path d={a()} transform={"translate(" + CX + "," + CY + ")"} fill={props.color} opacity={props.opacity} />
}

function Clock(props) {
  const c = props.clock
  const labels = []
  for (let h = 0; h < 24; h += 3) {
    labels.push(h)
  }
  return (
    <svg width="520" height="480" style={{ display: "block" }}>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#2A3556" strokeWidth="30" />
      <ClockArc from={c.burn_window[0]} to={c.burn_window[1]} color="#FFB547" opacity={0.9} />
      <ClockArc from={c.midday[0]} to={c.midday[1]} color="#3DDC97" opacity={0.35} />
      {c.passes.map(function (h) {
        const a = hourAngle(h)
        return (
          <g key={h}>
            <line x1={CX + Math.sin(a) * (R - 20)} y1={CY - Math.cos(a) * (R - 20)} x2={CX + Math.sin(a) * (R + 24)} y2={CY - Math.cos(a) * (R + 24)} stroke="#49C7F5" strokeWidth="3" />
            <circle cx={CX + Math.sin(a) * (R + 24)} cy={CY - Math.cos(a) * (R + 24)} r="7" fill="#49C7F5" />
          </g>
        )
      })}
      {labels.map(function (h) {
        const a = hourAngle(h)
        return <text key={h} x={CX + Math.sin(a) * (R - 38)} y={CY - Math.cos(a) * (R - 38) + 4} textAnchor="middle" fill="#9AA6BD" fontSize="12" fontFamily="JB">{String(h).padStart(2, "0") + ":00"}</text>
      })}
      <text x={CX} y={CY - 6} textAnchor="middle" fill="#EEF2FA" fontSize="30" fontFamily="Fraunces">{c.headline}</text>
      <text x={CX} y={CY + 18} textAnchor="middle" fill="#9AA6BD" fontSize="12">{c.line1}</text>
      <text x={CX} y={CY + 38} textAnchor="middle" fill="#9AA6BD" fontSize="12">{c.line2}</text>
      <text x="20" y="470" fill="#49C7F5" fontSize="12">{c.pass_label}</text>
      <text x="260" y="470" fill="#FFB547" fontSize="12">{c.burn_label}</text>
    </svg>
  )
}

function BlindSpot() {
  const [shell, setShell] = useState(null)
  const [page, setPage] = useState(null)

  useEffect(function () {
    getShell().then(setShell)
    getBlindSpot().then(setPage)
  }, [])

  let chips = []
  if (shell) {
    chips = shell.data.chips
  }

  if (page === null) {
    return (
      <div className="app">
        <Topbar active="Blind Spot" chips={chips} />
      </div>
    )
  }

  const d = page.data

  return (
    <div className="app">
      <div style={{ position: "absolute", left: 32, top: 92 }}>
        <div className="caps" style={{ color: "var(--flame)" }}>Blind spot observatory</div>
        <h1 className="display" style={{ fontSize: 40, marginTop: 6 }}>When the satellites can't see</h1>
      </div>
      <div className="panel" style={{ position: "absolute", left: 32, top: 180, width: 560, height: 560 }}>
        <div className="panel-h"><span className="caps">24-hour clock · {d.clock.region}</span><span className="chip">{d.clock.source}</span></div>
        <div className="panel-b"><Clock clock={d.clock} /></div>
      </div>
      <div className="panel" style={{ position: "absolute", left: 612, top: 180, width: 956, height: 360 }}>
        <div className="panel-h"><span className="caps">Counts vs burned area</span><StatusChip kind="archive" label="REPORTED VALUES" /></div>
        <div className="panel-b" style={{ display: "flex", gap: 24 }}>
          <Bars w={560} h={270} values={d.counts.values} labels={d.counts.labels} colors={d.counts.colors} fmt={function (v) { return v.toLocaleString("en-US") }} />
          <div style={{ width: 330, fontSize: 13, lineHeight: 1.6 }}>
            {d.counts.tiles.map(function (t, i) {
              let style = undefined
              if (i > 0) {
                style = { marginTop: 12 }
              }
              let note = null
              if (t.note !== "") {
                note = <div className="mono faint" style={{ fontSize: 11 }}>{t.note}</div>
              }
              return (
                <div key={t.label} className="tile" style={style}>
                  <div className="caps dim">{t.label}</div>
                  <div className="big" style={{ color: t.color }}>{t.value}</div>
                  {note}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="panel" style={{ position: "absolute", left: 612, top: 556, width: 956, height: 184 }}>
        <div className="panel-h"><span className="caps">Blind-spot ratio B = burned area / harmonised cell-days</span><span className="mono faint" style={{ fontSize: 11 }}>{d.ratio.note}</span></div>
        <div className="panel-b"><Lines w={920} h={120} series={[{ values: d.ratio.values, color: "#FFB547", dots: true }]} xLabels={d.ratio.years} yMin={0} yMax={3} vline={{ at: d.ratio.baseline_index, color: "#9AA6BD", label: "baseline ends" }} /></div>
      </div>
      <div className="panel" style={{ position: "absolute", left: 32, top: 760, width: 1536, height: 210 }}>
        <div className="panel-h"><span className="caps">What can hide a fire</span></div>
        <div className="panel-b" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, fontSize: 13, lineHeight: 1.5 }}>
          {d.hides.map(function (h) {
            return <div key={h.title} className="tile"><b style={{ color: "var(--sky)" }}>{h.title}</b><div className="dim">{h.text}</div></div>
          })}
        </div>
      </div>
      <Topbar active="Blind Spot" chips={chips} meta={page.meta} />
    </div>
  )
}

export default BlindSpot
