import { useNavigate } from "react-router-dom"
import StatusChip from "./StatusChip.jsx"
import LoadingLayer from "./LoadingLayer.jsx"

function CellInspector(props) {
  const navigate = useNavigate()
  const c = props.cell
  let warning = null
  if (c.blind_spot) {
    warning = <div className="warn" style={{ marginTop: 12 }}>Blind-spot flag: burned area per counted cell-day is {c.blind_spot.ratio}× its pre-{c.blind_spot.baseline_before} normal. Counts likely too low.</div>
  }
  let title = "Cell " + c.id
  let subtitle = c.district + " district · " + c.res_deg + "° × " + c.res_deg + "° ≈ " + c.area_km2 + " km²"
  if (c.place) {
    title = "Hex " + c.id.slice(0, 7)
    subtitle = c.place + " · " + c.grid_label
  }
  return (
    <div className="panel" style={{ position: "absolute", right: 20, top: 84, width: 330 }}>
      <div className="panel-h"><span className="caps">Cell inspector</span><StatusChip kind={c.status} label={c.status.toUpperCase()} /></div>
      <div className="panel-b">
        <div className="display" style={{ fontSize: 24 }}>{title}</div>
        <div className="dim" style={{ fontSize: 12, marginBottom: 10 }}>{subtitle}</div>
        <div className="kv"><span>{c.month_label} fire cell-days</span><b>{c.fire_days}</b></div>
        <div className="kv"><span>Clear-sky cell-days</span><b>{c.clear_days} / {c.days_in_month}</b></div>
        <div className="kv"><span>Rate (fire / clear)</span><b>{c.rate}</b></div>
        <div className="kv"><span>Harmonised (VIIRS-eq)</span><b>{c.h} <span className="faint">[{c.lo}–{c.hi}]</span></b></div>
        <div className="kv"><span>Source mix</span><b style={{ color: "var(--mint)" }}>{c.source_mix.cls} {c.source_mix.pct}%</b></div>
        {warning}
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" onClick={function () { navigate("/calendar/punjab") }}>Open calendar</button>
          <button className="btn">Export CSV</button>
        </div>
      </div>
      <LoadingLayer scope="cell" variant="inline" />
    </div>
  )
}

export default CellInspector
