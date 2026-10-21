import * as d3 from "d3"

const CLASS_COLOR = { crop: "#3DDC97", forest: "#FF4D6D", industrial: "#FFB547", unknown: "#9AA6BD" }
const HIGHLIGHT_STATES = ["Punjab", "Haryana"]

function pointColor(p, colorBy) {
  if (colorBy === "class") {
    return CLASS_COLOR[p.cls]
  }
  if (colorBy === "heat") {
    return "#FF8A3D"
  }
  if (p.sensor === "VIIRS") {
    return "#FF8A3D"
  }
  return "#8FB8FF"
}

function gridLines(b, step) {
  const lines = []
  for (let x = Math.floor(b[0] / step) * step; x <= b[2]; x += step) {
    lines.push({ type: "LineString", coordinates: [[x, b[1] - 1], [x, b[3] + 1]] })
  }
  for (let y = Math.floor(b[1] / step) * step; y <= b[3]; y += step) {
    lines.push({ type: "LineString", coordinates: [[b[0] - 1, y], [b[2] + 1, y]] })
  }
  return lines
}

function RegionMap(props) {
  const b = props.bbox
  const box = { type: "Feature", geometry: { type: "Polygon", coordinates: [[[b[0], b[1]], [b[0], b[3]], [b[2], b[3]], [b[2], b[1]], [b[0], b[1]]]] } }
  const proj = d3.geoMercator().fitSize([props.w, props.h], box)
  const path = d3.geoPath(proj)
  let countries = null
  let states = []
  if (props.base) {
    countries = <path d={path(props.base.countries)} fill="#16233F" stroke="#2D4470" strokeWidth="0.8" />
    states = props.base.states.features
  }
  let grid = []
  if (props.grid > 0) {
    grid = gridLines(b, props.grid)
  }
  let shown = props.points
  if (props.sensorFilter) {
    shown = props.points.filter(function (p) {
      return p.sensor === props.sensorFilter
    })
  }
  const dots = shown.map(function (p) {
    const xy = proj([p.lon, p.lat])
    let r = props.pointSize
    if (p.sensor === "MODIS") {
      r = props.pointSize * 1.5
    }
    return { x: xy[0], y: xy[1], r: r, color: pointColor(p, props.colorBy) }
  })
  return (
    <svg width={props.w} height={props.h} style={props.style}>
      <rect width={props.w} height={props.h} fill="#0A1326" />
      {countries}
      {states.map(function (f, i) {
        let fill = "#16233F"
        if (HIGHLIGHT_STATES.indexOf(f.properties.name) !== -1) {
          fill = "#1E2E52"
        }
        return <path key={i} d={path(f)} fill={fill} stroke="#3A5486" strokeWidth="0.9" />
      })}
      {grid.map(function (g, i) {
        return <path key={i} d={path(g)} stroke="#49C7F5" strokeOpacity="0.16" fill="none" />
      })}
      {dots.map(function (d, i) {
        return (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r={d.r * 2.4} fill={d.color} opacity="0.18" />
            <circle cx={d.x} cy={d.y} r={d.r} fill={d.color} opacity="0.95" />
          </g>
        )
      })}
    </svg>
  )
}

export default RegionMap
