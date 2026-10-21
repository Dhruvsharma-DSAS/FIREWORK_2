import { useState, useEffect } from "react"
import Topbar from "../components/Topbar.jsx"
import StatusChip from "../components/StatusChip.jsx"
import Bars from "../components/Bars.jsx"
import { getShell } from "../api/shell.js"
import { getStudio } from "../api/pages.js"
import "../styles/studio.css"

const MODES = ["Beginner", "Researcher", "Custom"]

function Seg(props) {
  return (
    <div className="seg" style={props.style}>
      {props.items.map(function (it) {
        let cls = ""
        if (it === props.value) {
          cls = "on"
        }
        return <span key={it} className={cls} onClick={function () { props.onChange(it) }}>{it}</span>
      })}
    </div>
  )
}

function Slider(props) {
  return <div className="slider"><i style={{ width: props.pct + "%" }}></i><b style={{ left: (props.pct - 2) + "%" }}></b></div>
}

function DataStudio() {
  const [shell, setShell] = useState(null)
  const [page, setPage] = useState(null)
  const [mode, setMode] = useState("Beginner")
  const [confidence, setConfidence] = useState("")
  const [daynight, setDaynight] = useState("")

  useEffect(function () {
    getShell().then(setShell)
    getStudio().then(function (body) {
      setPage(body)
      setConfidence(body.data.params.confidence_on)
      setDaynight(body.data.params.daynight_on)
    })
  }, [])

  let chips = []
  if (shell) {
    chips = shell.data.chips
  }
  if (page) {
    chips = page.data.chips
  }

  if (page === null) {
    return (
      <div className="app">
        <Topbar active="Data Studio" chips={chips} />
      </div>
    )
  }

  const d = page.data
  const p = d.params
  const pv = d.preview

  function cellClass(r, c) {
    const flag = d.cell_flags.find(function (f) {
      return f.row === r && f.col === c
    })
    if (!flag) {
      return undefined
    }
    if (flag.kind === "bad") {
      return "cellbad"
    }
    return "cellfix"
  }

  return (
    <div className="app">
      <div className="panel" style={{ position: "absolute", left: 24, right: 24, top: 80, height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px" }}>
        {d.steps.map(function (s, i) {
          const n = i + 1
          let cls = "step"
          let mark = String(n)
          if (n < d.current_step) {
            cls = "step done"
            mark = "✓"
          }
          if (n === d.current_step) {
            cls = "step cur"
          }
          return <div key={s} className={cls}><b>{mark}</b>{s}</div>
        })}
      </div>
      <div className="panel" style={{ position: "absolute", left: 24, top: 154, width: 300, height: 390 }}>
        <div className="panel-h"><span className="caps">Your dataset</span><StatusChip kind="user" label="USER-UPLOADED" /></div>
        <div className="panel-b" style={{ fontSize: 12.5 }}>
          <div className="tile" style={{ marginBottom: 10 }}><div style={{ fontWeight: 700 }}>{d.dataset.file}</div><div className="dim mono" style={{ fontSize: 11 }}>{d.dataset.summary}</div></div>
          {d.dataset.rows.map(function (r) {
            let style = undefined
            if (r.warn) {
              style = { color: "var(--flame)" }
            }
            return <div key={r.label} className="kv"><span>{r.label}</span><b style={style}>{r.value}</b></div>
          })}
          <div className="caps dim" style={{ margin: "14px 0 8px" }}>Mode</div>
          <Seg items={MODES} value={mode} onChange={setMode} />
        </div>
      </div>
      <div className="panel" style={{ position: "absolute", left: 24, top: 560, width: 300, height: 410 }}>
        <div className="panel-h"><span className="caps">Ask in plain words</span><span className="chip" style={{ color: "var(--violet)", borderColor: "rgba(155,140,255,.5)" }}>AI ASSIST</span></div>
        <div className="panel-b" style={{ fontSize: 12.5, lineHeight: 1.5 }}>
          <div style={{ background: "rgba(255,255,255,.05)", borderRadius: 12, padding: 10, marginBottom: 8 }}>{d.assistant.question}</div>
          <div style={{ background: "rgba(155,140,255,.12)", border: "1px solid rgba(155,140,255,.3)", borderRadius: 12, padding: 10 }}>
            {d.assistant.plan_before}<span className="mono">{d.assistant.plan_code}</span>{d.assistant.plan_after}
            <div className="row" style={{ marginTop: 8 }}><button className="btn" style={{ padding: "5px 10px" }}>Yes, convert</button><button className="btn ghost" style={{ padding: "5px 10px" }}>Show plan</button></div>
          </div>
          <div className="dim" style={{ fontSize: 11, marginTop: 8 }}>{d.assistant.note}</div>
        </div>
      </div>
      <div className="panel" style={{ position: "absolute", left: 340, top: 154, width: 840, height: 530 }}>
        <div className="panel-h"><span className="caps">Map columns · preview of first rows</span><span className="mono faint" style={{ fontSize: 11 }}>auto-detected {d.auto_detected}</span></div>
        <div className="panel-b">
          <table className="sheet-t">
            <thead>
              <tr>
                {d.columns.map(function (c) {
                  let cls = "map"
                  if (c.bad) {
                    cls = "map bad"
                  }
                  return <th key={c.name}>{c.name}<span className={cls}>{c.map}</span></th>
                })}
              </tr>
            </thead>
            <tbody>
              {d.rows.map(function (row, r) {
                return (
                  <tr key={r}>
                    {row.map(function (v, c) {
                      return <td key={c} className={cellClass(r, c)}>{v}</td>
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="err" style={{ marginTop: 14 }}>{d.issues.error} <u>Fix</u> · <u>Drop row</u> · <u>Keep, exclude from maps</u></div>
          <div className="warn" style={{ marginTop: 10 }}>{d.issues.warn}</div>
          <div className="ok" style={{ marginTop: 10 }}>{d.issues.ok}</div>
        </div>
      </div>
      <div className="panel" style={{ position: "absolute", right: 24, top: 154, width: 390, height: 816 }}>
        <div className="panel-h"><span className="caps">Parameters</span><span className="mono faint" style={{ fontSize: 11 }}>{p.config}</span></div>
        <div className="panel-b">
          <div className="lbl"><span>Region</span><span className="mono">bbox · polygon · upload</span></div><div className="sel"><span>{p.region}</span><span>▾</span></div>
          <div className="lbl"><span>Time window (UTC)</span></div><div className="sel"><span className="mono">{p.window}</span><span>▾</span></div>
          <div className="lbl"><span>Compare with sensors</span></div>
          <div className="row" style={{ marginTop: 6, gap: 6 }}>
            {p.sensors.map(function (s) {
              if (s.on) {
                return <span key={s.label} className="chip"><span className="dot" style={{ background: "#FF8A3D" }}></span>{s.label}</span>
              }
              return <span key={s.label} className="chip" style={{ opacity: 0.5 }}>{s.label}</span>
            })}
          </div>
          <div className="lbl"><span>Grid resolution</span><span className="mono">{p.grid.label}</span></div><Slider pct={p.grid.pct} />
          <div className="lbl"><span>Match distance</span><span className="mono">{p.distance.label}</span></div><Slider pct={p.distance.pct} />
          <div className="lbl"><span>Match time window</span><span className="mono">{p.time_window.label}</span></div><Slider pct={p.time_window.pct} />
          <div className="lbl"><span>Confidence ≥</span><span className="mono">{confidence}</span></div><Seg items={p.confidence} value={confidence} onChange={setConfidence} style={{ marginTop: 6 }} />
          <div className="lbl"><span>Day / night</span></div><Seg items={p.daynight} value={daynight} onChange={setDaynight} style={{ marginTop: 6 }} />
          <div className="lbl"><span>Uncertainty</span><span className="mono">{p.uncertainty.label}</span></div><div className="sel"><span>{p.uncertainty.value}</span><span>▾</span></div>
          <div className="tile" style={{ marginTop: 16, fontSize: 12, lineHeight: 1.5 }}><b>What this changes:</b> {p.explain}</div>
          <div className="row" style={{ marginTop: 16 }}><button className="btn primary">Preview →</button><button className="btn">Download config.json</button></div>
        </div>
      </div>
      <div className="panel" style={{ position: "absolute", left: 340, top: 700, width: 840, height: 270 }}>
        <div className="panel-h"><span className="caps">Live preview · before / after cleaning</span><StatusChip kind="user" label="USER + ARCHIVE" /></div>
        <div className="panel-b" style={{ display: "flex", gap: 20 }}>
          <Bars w={540} h={190} values={pv.counts} labels={pv.hours} colors={pv.hours.map(function (h) {
            if (Number(h) >= pv.split_hour) {
              return "#FFB547"
            }
            return "#49C7F5"
          })} fmt={function (v) { return v }} />
          <div style={{ fontSize: 12.5, width: 250 }}>
            {pv.rows.map(function (r) {
              let style = undefined
              if (r.warn) {
                style = { color: "var(--flame)" }
              }
              return <div key={r.label} className="kv"><span>{r.label}</span><b style={style}>{r.value}</b></div>
            })}
            <div className="mono faint" style={{ fontSize: 10.5, marginTop: 8 }}>{pv.note}</div>
          </div>
        </div>
      </div>
      <Topbar active="Data Studio" chips={chips} meta={page.meta} />
    </div>
  )
}

export default DataStudio
