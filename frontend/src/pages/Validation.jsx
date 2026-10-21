import { useState, useEffect } from "react"
import * as d3 from "d3"
import Topbar from "../components/Topbar.jsx"
import Lines from "../components/Lines.jsx"
import { getShell } from "../api/shell.js"
import { getValidation } from "../api/pages.js"

function BlandAltman(props) {
  const b = props.data
  const x = d3.scaleLinear().domain([0, b.x_max]).range([40, 690])
  const y = d3.scaleLinear().domain([-b.y_range, b.y_range]).range([230, 20])
  return (
    <svg width="700" height="250" style={{ display: "block" }}>
      <line x1="40" x2="690" y1={y(0)} y2={y(0)} stroke="#3DDC97" />
      <line x1="40" x2="690" y1={y(b.sd)} y2={y(b.sd)} stroke="#FFB547" strokeDasharray="5 4" />
      <line x1="40" x2="690" y1={y(-b.sd)} y2={y(-b.sd)} stroke="#FFB547" strokeDasharray="5 4" />
      <text x="694" y={y(b.sd) - 4} textAnchor="end" fill="#FFB547" fontSize="11">+1.96 SD</text>
      <text x="694" y={y(-b.sd) + 14} textAnchor="end" fill="#FFB547" fontSize="11">−1.96 SD</text>
      {b.points.map(function (p, i) {
        return <circle key={i} cx={x(p[0])} cy={y(p[1])} r="3.2" fill="#49C7F5" opacity="0.8" />
      })}
      <text x="365" y="246" textAnchor="middle" fill="#67728A" fontSize="11">{b.x_label}</text>
    </svg>
  )
}

function Validation() {
  const [shell, setShell] = useState(null)
  const [page, setPage] = useState(null)

  useEffect(function () {
    getShell().then(setShell)
    getValidation().then(setPage)
  }, [])

  let chips = []
  if (shell) {
    chips = shell.data.chips
  }

  if (page === null) {
    return (
      <div className="app">
        <Topbar active="Validation" chips={chips} />
      </div>
    )
  }

  const d = page.data
  let banner = null
  if (page.meta.demo) {
    banner = <span className="chip demo"><span className="dot"></span>{d.banner}</span>
  }

  return (
    <div className="app">
      <div style={{ position: "absolute", left: 32, top: 92 }}>
        <div className="caps" style={{ color: "var(--flame)" }}>Accuracy &amp; validation</div>
        <h1 className="display" style={{ fontSize: 40, marginTop: 6 }}>How much should you trust it?</h1>
      </div>
      <div className="row" style={{ position: "absolute", right: 32, top: 112 }}>{banner}</div>
      <div style={{ position: "absolute", left: 32, top: 186, right: 32, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16 }}>
        {d.tiles.map(function (t) {
          let style = undefined
          if (t.color !== "") {
            style = { color: t.color }
          }
          return (
            <div key={t.label} className="tile">
              <div className="caps dim">{t.label}</div>
              <div className="big" style={style}>{t.value}</div>
              <div className="dim" style={{ fontSize: 12 }}>{t.note}</div>
            </div>
          )
        })}
      </div>
      <div className="panel" style={{ position: "absolute", left: 32, top: 330, width: 760, height: 310 }}>
        <div className="panel-h"><span className="caps">Leave-one-year-out · predicted vs actual VIIRS</span></div>
        <div className="panel-b"><Lines w={720} h={250} series={[{ values: d.loyo.actual, color: "#FF8A3D", dots: true }, { values: d.loyo.predicted, color: "#EEF2FA", dash: "5 4", width: 1.6 }]} xLabels={d.loyo.years} /></div>
      </div>
      <div className="panel" style={{ position: "absolute", right: 32, top: 330, width: 740, height: 310 }}>
        <div className="panel-h"><span className="caps">Bland–Altman · harmonised MODIS vs VIIRS</span><span className="mono faint" style={{ fontSize: 11 }}>{d.bland_altman.note}</span></div>
        <div className="panel-b"><BlandAltman data={d.bland_altman} /></div>
      </div>
      <div className="panel" style={{ position: "absolute", left: 32, top: 660, width: 760, height: 310 }}>
        <div className="panel-h"><span className="caps">Region reliability</span></div>
        <div className="panel-b">
          <table className="grid">
            <thead><tr><th>Region</th><th>Overlap years</th><th>k̃ (Nov)</th><th>LOYO error</th><th>Status</th></tr></thead>
            <tbody>
              {d.regions.map(function (r) {
                return (
                  <tr key={r.region}>
                    <td>{r.region}</td>
                    <td className="mono">{r.years}</td>
                    <td className="mono">{r.k}</td>
                    <td className="mono">{r.loyo}</td>
                    <td style={{ color: r.color }}>{r.status}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="mono faint" style={{ fontSize: 11, marginTop: 10 }}>{d.regions_note}</div>
        </div>
      </div>
      <div className="panel" style={{ position: "absolute", right: 32, top: 660, width: 740, height: 310 }}>
        <div className="panel-h"><span className="caps">Known limitations</span></div>
        <div className="panel-b" style={{ fontSize: 13, lineHeight: 1.6 }}>
          <div className="warn" style={{ marginBottom: 8 }}>{d.limitations_warn}</div>
          {d.limitations.map(function (l) {
            return <div key={l.label} className="kv"><span>{l.label}</span><b>{l.value}</b></div>
          })}
        </div>
      </div>
      <Topbar active="Validation" chips={chips} meta={page.meta} />
    </div>
  )
}

export default Validation
