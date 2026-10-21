import { useState } from "react"

function Timeline(props) {
  const t = props.timeline
  const [step, setStep] = useState("Month")
  const steps = ["Day", "Month", "Year"]
  return (
    <div className="panel" style={{ position: "absolute", left: 20, right: 20, bottom: 16, height: 88, padding: "12px 18px" }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="row">
          <button className="btn" style={{ padding: "6px 12px" }}>▶ Play</button>
          <span className="seg">
            {steps.map(function (s) {
              let cls = ""
              if (s === step) {
                cls = "on"
              }
              return <span key={s} className={cls} onClick={function () { setStep(s) }}>{s}</span>
            })}
          </span>
          <span className="mono" style={{ fontSize: 13, marginLeft: 10 }}>{t.selected_label}</span>
        </div>
        <div className="row">
          <span className="chip">MODIS era</span>
          <span className="chip" style={{ borderColor: "var(--viirs)", color: "var(--viirs)" }}>VIIRS era</span>
          <span className="mono faint" style={{ fontSize: 11 }}>seam: {t.seam_year}</span>
        </div>
      </div>
      <svg width="100%" height="34" viewBox="0 0 1520 34" preserveAspectRatio="none" style={{ marginTop: 6, display: "block" }}>
        {t.values.map(function (v, i) {
          let color = "#8FB8FF"
          if (t.start_year + i / 12 >= t.seam_year) {
            color = "#FF8A3D"
          }
          return <rect key={i} x={i * 5.05} y={30 - v * 26} width="3.8" height={v * 26} rx="1" fill={color} opacity="0.75" />
        })}
        <rect x={t.selected_index * 5.05 - 2} y="0" width="8" height="34" fill="none" stroke="#EEF2FA" strokeWidth="2" rx="2" />
      </svg>
    </div>
  )
}

export default Timeline
