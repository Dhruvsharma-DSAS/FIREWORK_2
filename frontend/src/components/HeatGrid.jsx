import * as d3 from "d3"
import { HEAT_COLORS } from "./heatColors.js"

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]

function HeatGrid(props) {
  const w = props.w
  const h = props.h
  const pad = [24, 8, 8, 52]
  const gap = 3
  const rows = props.rows
  const nc = rows[0].length
  const cw = (w - pad[3] - pad[1]) / nc
  const ch = (h - pad[0] - pad[2]) / rows.length
  const color = d3.scaleSequential(d3.interpolateRgbBasis(HEAT_COLORS)).domain([0, props.max])
  return (
    <svg width={w} height={h}>
      {MONTHS.map(function (m, j) {
        return <text key={j} x={pad[3] + j * cw + cw / 2} y={pad[0] - 8} textAnchor="middle" fontSize="11" fill="#9AA6BD" fontFamily="SG">{m}</text>
      })}
      {rows.map(function (r, i) {
        return (
          <g key={i}>
            <text x={pad[3] - 8} y={pad[0] + i * ch + ch / 2 + 4} textAnchor="end" fontSize="10.5" fill="#9AA6BD" fontFamily="JB">{props.rowLabels[i]}</text>
            {r.map(function (v, j) {
              return <rect key={j} x={pad[3] + j * cw + gap / 2} y={pad[0] + i * ch + gap / 2} width={cw - gap} height={ch - gap} rx="3" fill={color(Math.min(v, props.max))} />
            })}
          </g>
        )
      })}
      {props.marks.map(function (m, k) {
        let dash = undefined
        if (m.dashed) {
          dash = "5 3"
        }
        return <rect key={k} x={pad[3] + m.col * cw} y={pad[0] + m.row * ch} width={cw} height={ch} fill="none" stroke={m.color} strokeWidth="2.4" strokeDasharray={dash} rx="4" pointerEvents="none" />
      })}
    </svg>
  )
}

export default HeatGrid
