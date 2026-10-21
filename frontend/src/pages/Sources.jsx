import { useState, useEffect } from "react"
import * as d3 from "d3"
import Topbar from "../components/Topbar.jsx"
import DemoBanner from "../components/DemoBanner.jsx"
import RegionMap from "../components/RegionMap.jsx"
import { getShell } from "../api/shell.js"
import { getSources } from "../api/pages.js"
import { getRegionBase } from "../api/geo.js"

const CLASS_COLOR = { crop: "#3DDC97", forest: "#FF4D6D", industrial: "#FFB547", unknown: "#9AA6BD" }

function SplitBars(props) {
  const s = props.split
  const x = d3.scaleBand().domain(s.years).range([40, 480]).padding(0.25)
  const y = d3.scaleLinear().domain([0, 380]).range([220, 10])
  return (
    <svg width="490" height="250" style={{ display: "block" }}>
      {s.years.map(function (yy, i) {
        const parts = [[s.crop[i], CLASS_COLOR.crop], [s.industrial[i], CLASS_COLOR.industrial], [s.unknown[i], CLASS_COLOR.unknown]]
        let base = 0
        const rects = parts.map(function (p, k) {
          const r = <rect key={k} x={x(yy)} y={y(base + p[0])} width={x.bandwidth()} height={y(base) - y(base + p[0])} fill={p[1]} />
          base = base + p[0]
          return r
        })
        return (
          <g key={yy}>
            {rects}
            <text x={x(yy) + x.bandwidth() / 2} y="240" textAnchor="middle" fontSize="10" fill="#67728A" fontFamily="JB">{yy}</text>
          </g>
        )
      })}
    </svg>
  )
}

function Sources() {
  const [shell, setShell] = useState(null)
  const [page, setPage] = useState(null)
  const [base, setBase] = useState(null)

  useEffect(function () {
    getShell().then(setShell)
    getSources().then(setPage)
    getRegionBase().then(setBase)
  }, [])

  let chips = []
  if (shell) {
    chips = shell.data.chips
  }

  if (page === null) {
    return (
      <div className="app">
        <Topbar active="Sources" chips={chips} />
      </div>
    )
  }

  const d = page.data
  const site = d.site

  return (
    <div className="app">
      <div className="panel" style={{ position: "absolute", left: 24, top: 84, width: 1000, height: 892, overflow: "hidden" }}>
        <RegionMap w={1000} h={892} bbox={d.bbox} points={d.points} base={base} colorBy="class" pointSize={3} grid={0} />
        <div className="row" style={{ position: "absolute", left: 16, bottom: 16, gap: 14, fontSize: 12, background: "rgba(6,10,19,.75)", padding: "8px 12px", borderRadius: 10 }}>
          {d.legend.map(function (l) {
            return <span key={l.cls}><span className="legend-swatch" style={{ background: CLASS_COLOR[l.cls] }}></span> {l.label}</span>
          })}
        </div>
        <DemoBanner meta={page.meta} label="DEMO POINTS" style={{ position: "absolute", right: 16, top: 16, background: "rgba(6,10,19,.7)" }} />
      </div>
      <div className="panel" style={{ position: "absolute", right: 24, top: 84, width: 530, height: 520 }}>
        <div className="panel-h"><span className="caps">Site {site.id} · {site.place}</span><span className="chip" style={{ color: "var(--flame)", borderColor: "rgba(255,181,71,.5)" }}>{site.cls} · {site.prob}</span></div>
        <div className="panel-b" style={{ fontSize: 13 }}>
          <div className="caps dim" style={{ margin: "4px 0 8px" }}>Evidence for</div>
          {site.evidence_for.map(function (r) {
            return <div key={r.label} className="kv"><span>{r.label}</span><b>{r.value}</b></div>
          })}
          <div className="caps dim" style={{ margin: "14px 0 8px" }}>Evidence against</div>
          {site.evidence_against.map(function (r) {
            return <div key={r.label} className="kv"><span>{r.label}</span><b>{r.value}</b></div>
          })}
          <div className="tile" style={{ marginTop: 12 }}><div className="mono" style={{ fontSize: 13 }}>{site.formula}</div></div>
          <div className="dim" style={{ fontSize: 12, marginTop: 10 }}>{site.abstain_note}</div>
        </div>
      </div>
      <div className="panel" style={{ position: "absolute", right: 24, top: 620, width: 530, height: 356 }}>
        <div className="panel-h"><span className="caps">{d.split.title}</span></div>
        <div className="panel-b"><SplitBars split={d.split} /><div className="dim" style={{ fontSize: 12 }}>{d.split.note}</div></div>
      </div>
      <Topbar active="Sources" chips={chips} meta={page.meta} />
    </div>
  )
}

export default Sources
