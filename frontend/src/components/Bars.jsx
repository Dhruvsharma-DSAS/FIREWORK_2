import * as d3 from "d3"

function Bars(props) {
  let pad = [20, 10, 28, 36]
  if (props.pad) {
    pad = props.pad
  }
  const w = props.w
  const h = props.h
  const values = props.values
  let yMax = d3.max(values) * 1.15
  if (props.yMax) {
    yMax = props.yMax
  }
  const x = d3.scaleBand().domain(d3.range(values.length)).range([pad[3], w - pad[1]]).padding(0.28)
  const y = d3.scaleLinear().domain([0, yMax]).range([h - pad[2], pad[0]])
  const axis = "#67728A"
  let title = null
  if (props.title) {
    title = <text x={w / 2} y="14" textAnchor="middle" fill="#9AA6BD" fontSize="11" fontFamily="Inter">{props.title}</text>
  }
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {title}
      {values.map(function (v, i) {
        let color = props.color
        if (props.colors) {
          color = props.colors[i]
        }
        let label = null
        if (props.fmt) {
          label = <text x={x(i) + x.bandwidth() / 2} y={y(v) - 5} textAnchor="middle" fontSize="10.5" fill="#EEF2FA" fontFamily="JB">{props.fmt(v)}</text>
        }
        return (
          <g key={i}>
            <rect x={x(i)} y={y(v)} width={x.bandwidth()} height={y(0) - y(v)} rx="4" fill={color} />
            {label}
            <text x={x(i) + x.bandwidth() / 2} y={h - 9} textAnchor="middle" fontSize="10" fill={axis} fontFamily="Inter">{props.labels[i]}</text>
          </g>
        )
      })}
      <line x1={pad[3]} x2={w - pad[1]} y1={y(0)} y2={y(0)} stroke={axis} />
    </svg>
  )
}

export default Bars
