import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Topbar from "../components/Topbar.jsx"
import Bars from "../components/Bars.jsx"
import { getShell } from "../api/shell.js"
import { getFormula } from "../api/pages.js"
import "../styles/formulas.css"

function median(list) {
  const s = list.slice().sort(function (a, b) {
    return a - b
  })
  if (s.length === 0) {
    return null
  }
  const mid = Math.floor(s.length / 2)
  if (s.length % 2 === 1) {
    return s[mid]
  }
  return (s[mid - 1] + s[mid]) / 2
}

function FormulaLab() {
  const params = useParams()
  const navigate = useNavigate()
  const [shell, setShell] = useState(null)
  const [page, setPage] = useState(null)
  const [rows, setRows] = useState([])
  const [lang, setLang] = useState("English")

  useEffect(function () {
    getShell().then(setShell)
  }, [])

  useEffect(function () {
    getFormula(params.id).then(function (body) {
      setPage(body)
      setRows(body.data.tryit.rows)
    })
  }, [params.id])

  let chips = []
  if (shell) {
    chips = shell.data.chips
  }

  if (page === null) {
    return (
      <div className="app">
        <Topbar active="Formulas" chips={chips} />
      </div>
    )
  }

  const d = page.data
  const f = d.formula

  function editModis(year, text) {
    const v = Number(text)
    setRows(rows.map(function (r) {
      if (r.year !== year) {
        return r
      }
      return { ...r, modis: v, edited: true }
    }))
  }

  const ratios = rows.filter(function (r) {
    return r.modis > 0
  }).map(function (r) {
    return r.viirs / r.modis
  })
  const k = median(ratios)
  const sorted = ratios.slice().sort(function (a, b) {
    return a - b
  })
  let kLabel = "—"
  let applied = "—"
  if (k !== null) {
    kLabel = k.toFixed(2)
    applied = String(Math.round(d.tryit.apply_modis * k))
  }

  let main = null
  if (params.id === f.id) {
    main = (
      <div>
        <div className="panel" style={{ position: "absolute", left: 304, top: 84, width: 760, height: 300, padding: 22 }}>
          <div className="row" style={{ justifyContent: "space-between" }}><div className="caps" style={{ color: "var(--flame)" }}>Formula {f.number} · {f.title}</div><span className="chip">{f.method}</span></div>
          <div className="display" style={{ fontSize: 44, marginTop: 22, textAlign: "center" }}>k<sub style={{ fontSize: 22 }}>r,m</sub> = median<sub style={{ fontSize: 18 }}>y ∈ 2012–2025</sub> ( N<sup style={{ fontSize: 20 }}>VIIRS</sup> / N<sup style={{ fontSize: 20 }}>MODIS</sup> )</div>
          <div className="row" style={{ justifyContent: "center", gap: 26, marginTop: 28, fontSize: 13 }}>
            {f.legend.map(function (l) {
              let sup = null
              if (l.sup !== "") {
                sup = <sup>{l.sup}</sup>
              }
              return <span key={l.text}><b style={{ color: l.color }}>{l.sym}{sup}</b> {l.text}</span>
            })}
          </div>
        </div>
        <div className="panel" style={{ position: "absolute", left: 304, top: 400, width: 370, height: 576 }}>
          <div className="panel-h"><span className="caps">Try it · change the inputs</span><span className="chip" style={{ color: "var(--violet)", borderColor: "rgba(155,140,255,.5)" }}>INTERACTIVE</span></div>
          <div className="panel-b">
            <table className="grid">
              <thead><tr><th>Year</th><th>MODIS</th><th>VIIRS</th><th>Ratio</th></tr></thead>
              <tbody>
                {rows.map(function (r) {
                  let cls = "try-in mono"
                  let pen = null
                  if (r.edited) {
                    cls = "try-in mono edited"
                    pen = <span style={{ color: "var(--ember)" }}> ✎</span>
                  }
                  let ratio = "—"
                  if (r.modis > 0) {
                    ratio = (r.viirs / r.modis).toFixed(2)
                  }
                  return (
                    <tr key={r.year}>
                      <td className="mono">{r.year}</td>
                      <td className="mono"><input className={cls} type="number" min="0" value={r.modis} style={{ width: (String(r.modis).length + 1) + "ch" }} aria-label={"MODIS cell-days " + r.year} onChange={function (e) { editModis(r.year, e.target.value) }} />{pen}</td>
                      <td className="mono">{r.viirs}</td>
                      <td className="mono">{ratio}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="tile" style={{ marginTop: 16, textAlign: "center" }}><div className="caps dim">Median ratio</div><div className="big" style={{ color: "var(--ember)" }}>k = {kLabel}</div><div className="mono faint" style={{ fontSize: 11 }}>sorted: {sorted.map(function (v) { return v.toFixed(2) }).join(" · ")}</div></div>
            <div className="tile" style={{ marginTop: 12, textAlign: "center" }}><div className="caps dim">{d.tryit.apply_label} = {d.tryit.apply_modis}</div><div className="big">{applied}</div><div className="mono faint" style={{ fontSize: 11 }}>VIIRS-equivalent cell-days</div></div>
            <div className="dim" style={{ fontSize: 12, marginTop: 12 }}>{d.tryit.hint}</div>
          </div>
        </div>
        <div className="panel" style={{ position: "absolute", left: 690, top: 400, width: 374, height: 576 }}>
          <div className="panel-h">
            <span className="caps">Step by step</span>
            <div className="seg">
              {Object.keys(d.steps).map(function (l) {
                let cls = ""
                if (l === lang) {
                  cls = "on"
                }
                return <span key={l} className={cls} onClick={function () { setLang(l) }}>{l}</span>
              })}
            </div>
          </div>
          <div className="panel-b">
            {d.steps[lang].map(function (s, i) {
              let style = undefined
              if (i === d.steps[lang].length - 1) {
                style = { borderColor: "transparent" }
              }
              return <div key={s.head} className="stepc" style={style}><b>{s.head}</b> {s.text}</div>
            })}
          </div>
        </div>
        <div className="panel" style={{ position: "absolute", right: 24, top: 84, width: 500, height: 892 }}>
          <div className="panel-h"><span className="caps">Why this, not that</span></div>
          <div className="panel-b" style={{ fontSize: 13, lineHeight: 1.55 }}>
            <Bars w={460} h={200} values={d.compare.values} labels={d.compare.labels} colors={d.compare.colors} yMax={4.2} title={d.compare.title} fmt={function (v) { return v.toFixed(2) }} />
            {d.compare.rows.map(function (r) {
              let style = undefined
              if (r.color !== "") {
                style = { color: r.color }
              }
              return <div key={r.label} className="kv"><span>{r.label}</span><b style={style}>{r.value}</b></div>
            })}
            <div className="caps dim" style={{ margin: "18px 0 8px" }}>Common doubts</div>
            {d.doubts.map(function (q, i) {
              let style = { marginBottom: 8 }
              if (i === d.doubts.length - 1) {
                style = undefined
              }
              return <div key={q.q} className="tile" style={style}><b>{q.q}</b><div className="dim">{q.a}</div></div>
            })}
            <div className="row" style={{ marginTop: 16 }}><button className="btn">View code · {d.code_file}</button><button className="btn ghost">References</button></div>
          </div>
        </div>
      </div>
    )
  } else {
    main = <div className="err" style={{ position: "absolute", left: 304, top: 84, width: 760 }}>Formula {params.id} is not in the demo fixture yet. Pick “Calibration ratio k” to see the full page.</div>
  }

  return (
    <div className="app">
      <div className="panel fnav" style={{ position: "absolute", left: 24, top: 84, width: 260, bottom: 24, padding: 14 }}>
        <div className="caps dim fnav-head" style={{ marginBottom: 10 }}>{d.count_label}</div>
        {d.families.map(function (fam, i) {
          let margin = "14px 0 6px"
          if (i === 0) {
            margin = "8px 0 6px"
          }
          return (
            <div key={fam.name}>
              <div className="caps fnav-head" style={{ color: "var(--flame)", margin: margin }}>{fam.name}</div>
              {fam.items.map(function (it) {
                let cls = "fnav-item"
                if (it.id === params.id) {
                  cls = "fnav-item on"
                }
                return <button key={it.id} className={cls} onClick={function () { navigate("/formulas/" + it.id) }}>{it.label}</button>
              })}
            </div>
          )
        })}
      </div>
      {main}
      <Topbar active="Formulas" chips={chips} meta={page.meta} />
    </div>
  )
}

export default FormulaLab
