import * as d3 from "d3"

const CLASS_COLOR = { crop: "#3DDC97", forest: "#FF4D6D", industrial: "#FFB547", unknown: "#9AA6BD" }

function pointColor(p, colorBy) {
  if (colorBy === "class") {
    return CLASS_COLOR[p.cls]
  }
  if (colorBy === "sensor") {
    if (p.sensor === "VIIRS") {
      return "#FF8A3D"
    }
    return "#8FB8FF"
  }
  return "#FF8A3D"
}

function orbitCoords(t) {
  const coords = []
  for (let a = 0; a <= 360; a += 2) {
    const ar = a * Math.PI / 180
    const inc = t.inc * Math.PI / 180
    const lat = Math.asin(Math.sin(inc) * Math.sin(ar)) * 180 / Math.PI
    const lon = t.node + Math.atan2(Math.cos(inc) * Math.sin(ar), Math.cos(ar)) * 180 / Math.PI - a * 0.25
    coords.push([((lon + 540) % 360) - 180, lat])
  }
  return coords
}

function Globe(props) {
  const o = props.options
  const id = props.id
  let cx = o.w / 2
  let cy = o.h / 2
  if (o.cx !== undefined) {
    cx = o.cx
  }
  if (o.cy !== undefined) {
    cy = o.cy
  }
  const proj = d3.geoOrthographic().scale(o.scale).translate([cx, cy]).rotate(o.rotate).clipAngle(90)
  const path = d3.geoPath(proj)
  const center = [-o.rotate[0], -o.rotate[1]]

  let glow = null
  if (o.glow !== false) {
    glow = <circle cx={cx} cy={cy} r={o.scale * 1.18} fill={"url(#" + id + "gl)"} />
  }

  let land = null
  let borders = null
  if (props.world) {
    land = <path d={path(props.world.land)} fill="#1A2B4D" stroke="#2D4470" strokeWidth="0.5" />
    borders = <path d={path(props.world.borders)} fill="none" stroke="#3A5486" strokeOpacity="0.55" strokeWidth="0.4" />
  }

  let highlight = null
  if (props.highlight) {
    highlight = <path d={path(props.highlight)} fill="rgba(255,106,61,0.18)" stroke="#FF6A3D" strokeWidth="1.2" />
  }

  let points = []
  if (props.points) {
    points = props.points
  }

  let hexes = []
  if (props.hexes) {
    hexes = props.hexes
  }
  let maxC = 1
  hexes.forEach(function (h) {
    if (h.count > maxC) {
      maxC = h.count
    }
  })
  const hexColor = d3.scaleSequential(d3.interpolateRgbBasis(["#3B1D0F", "#C2410C", "#FF6A3D", "#FFD08A"])).domain([0, Math.log(maxC + 1)])

  const visible = []
  points.forEach(function (p) {
    const xy = proj([p.lon, p.lat])
    if (!xy) {
      return
    }
    if (d3.geoDistance([p.lon, p.lat], center) >= Math.PI / 2) {
      return
    }
    const r = o.pointSize * (0.7 + Math.min(p.frp, 25) / 30)
    visible.push({ x: xy[0], y: xy[1], r: r, color: pointColor(p, o.colorBy) })
  })

  let terminator = null
  if (props.terminator) {
    let lon = -props.terminator.sunLon + 180
    if (lon > 180) {
      lon = lon - 360
    }
    const circle = d3.geoCircle().center([lon, -props.terminator.sunLat]).radius(90)()
    terminator = <path d={path(circle)} fill="#000814" fillOpacity="0.55" />
  }

  let orbits = []
  if (props.orbits) {
    orbits = props.orbits
  }

  return (
    <svg width={o.w} height={o.h} viewBox={"0 0 " + o.w + " " + o.h} style={props.style}>
      <defs>
        <radialGradient id={id + "oc"} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#0D1B36" />
          <stop offset="100%" stopColor="#050A16" />
        </radialGradient>
        <radialGradient id={id + "gl"} cx="50%" cy="50%" r="50%">
          <stop offset="84%" stopColor="#49C7F5" stopOpacity="0" />
          <stop offset="90%" stopColor="#49C7F5" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#49C7F5" stopOpacity="0" />
        </radialGradient>
        <filter id={id + "blur"} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <radialGradient id={id + "sh"} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
        </radialGradient>
      </defs>
      {glow}
      <path d={path({ type: "Sphere" })} fill={"url(#" + id + "oc)"} />
      <path d={path(d3.geoGraticule().step([15, 15])())} fill="none" stroke="#5D7BB8" strokeOpacity="0.16" strokeWidth="0.6" />
      {land}
      {borders}
      {highlight}
      {hexes.map(function (h) {
        return <path key={h.id} d={path({ type: "Polygon", coordinates: [h.ring] })} fill={hexColor(Math.log(h.count + 1))} fillOpacity="0.85" stroke="#060A13" strokeWidth="0.6" />
      })}
      <g>
        {visible.map(function (p, i) {
          return <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.color} opacity="0.95" />
        })}
      </g>
      <g filter={"url(#" + id + "blur)"}>
        {visible.map(function (p, i) {
          return <circle key={i} cx={p.x} cy={p.y} r={p.r * 2.6} fill={p.color} opacity="0.35" />
        })}
      </g>
      {terminator}
      {orbits.map(function (t, i) {
        const coords = orbitCoords(t)
        let sat = null
        if (t.satA !== undefined) {
          const xy = proj(coords[Math.round(t.satA / 2)])
          if (xy) {
            sat = (
              <g>
                <circle cx={xy[0]} cy={xy[1]} r="6" fill={t.color} />
                <circle cx={xy[0]} cy={xy[1]} r="14" fill="none" stroke={t.color} strokeOpacity="0.5" />
              </g>
            )
          }
        }
        return (
          <g key={i}>
            <path d={path({ type: "LineString", coordinates: coords })} fill="none" stroke={t.color} strokeWidth="1.6" strokeDasharray="6 5" opacity="0.9" />
            {sat}
          </g>
        )
      })}
      <path d={path({ type: "Sphere" })} fill={"url(#" + id + "sh)"} stroke="#49C7F5" strokeOpacity="0.25" strokeWidth="1" />
    </svg>
  )
}

export default Globe
