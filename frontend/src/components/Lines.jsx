import * as d3 from "d3"

function Lines(props) {
  const w = props.w
  const h = props.h
  const pad = [24, 16, 26, 40]
  const axis = "#67728A"
  const n = props.series[0].values.length
  const all = []
  props.series.forEach(function (s) {
    s.values.forEach(function (v) {
      all.push(v)
    })
  })
  let yMin = d3.min(all) * 0.9
  if (props.yMin !== undefined) {
    yMin = props.yMin
  }
  let yMax = d3.max(all) * 1.08
  if (props.yMax !== undefined) {
    yMax = props.yMax
  }
  const x = d3.scaleLinear().domain([0, n - 1]).range([pad[3], w - pad[1]])
  const y = d3.scaleLinear().domain([yMin, yMax]).range([h - pad[2], pad[0]])
  const line = d3.line().x(function (d, i) { return x(i) }).y(function (d) { return y(d) }).curve(d3.curveMonotoneX)
  let vline = null
  if (props.vline) {
    const vx = x(props.vline.at)
    vline = (
      <g>
        <line x1={vx} x2={vx} y1={pad[0]} y2={h - pad[2]} stroke={props.vline.color} strokeDasharray="4 4" />
        <text x={vx + 6} y={pad[0] + 12} fontSize="11" fill={props.vline.color} fontFamily="Inter">{props.vline.label}</text>
      </g>
    )
  }
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {y.ticks(4).map(function (t) {
        return (
          <g key={t}>
            <line x1={pad[3]} x2={w - pad[1]} y1={y(t)} y2={y(t)} stroke={axis} strokeOpacity="0.25" />
            <text x={pad[3] - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill={axis} fontFamily="JB">{t}</text>
          </g>
        )
      })}
      {vline}
      {props.series.map(function (s, k) {
        let width = 2.4
        if (s.width) {
          width = s.width
        }
        let dots = []
        if (s.dots) {
          dots = s.values
        }
        return (
          <g key={k}>
            <path d={line(s.values)} fill="none" stroke={s.color} strokeWidth={width} strokeDasharray={s.dash} />
            {dots.map(function (v, i) {
              return <circle key={i} cx={x(i)} cy={y(v)} r="2.6" fill={s.color} />
            })}
          </g>
        )
      })}
      {props.xLabels.map(function (lab, i) {
        if (lab === "") {
          return null
        }
        return <text key={i} x={x(i)} y={h - 8} textAnchor="middle" fontSize="10" fill={axis} fontFamily="JB">{lab}</text>
      })}
    </svg>
  )
}

export default Lines
