import { useState, useEffect } from "react"
import * as maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url"
import * as d3 from "d3"
import { MapLibreOverlay, ScatterplotLayer, PathLayer, PolygonLayer, SolidPolygonLayer } from "deck.gl"

const NEAR_ZOOM = 7
const LIFT = { night: 1000, hex: 2000, points: 3000, tracks: 6000 }
const NO_DEPTH_WRITE = { depthWriteEnabled: false }
const CLASS_COLOR = { crop: [61, 220, 151], forest: [255, 77, 109], industrial: [255, 181, 71], unknown: [154, 166, 189] }
const VIIRS_COLOR = [255, 138, 61]
const MODIS_COLOR = [143, 184, 255]
const HEX_RAMP = d3.interpolateRgbBasis(["#3B1D0F", "#C2410C", "#FF6A3D", "#FFD08A"])

let shared = null

maplibregl.setWorkerUrl(workerUrl)

function lift(coords, z) {
  return coords.map(function (c) {
    return [c[0], c[1], z]
  })
}

function hexToRgb(hex) {
  const c = d3.rgb(hex)
  return [c.r, c.g, c.b]
}

function graticule() {
  const lines = []
  for (let lon = -180; lon <= 180; lon += 15) {
    const coords = []
    for (let lat = -90; lat <= 90; lat += 2) {
      coords.push([lon, lat])
    }
    lines.push(coords)
  }
  for (let lat = -75; lat <= 75; lat += 15) {
    const coords = []
    for (let lon = -180; lon <= 180; lon += 2) {
      coords.push([lon, lat])
    }
    lines.push(coords)
  }
  return { type: "Feature", properties: {}, geometry: { type: "MultiLineString", coordinates: lines } }
}

function orbitCoords(t) {
  const coords = []
  for (let a = 0; a <= 360; a += 0.5) {
    const ar = a * Math.PI / 180
    const inc = t.inc * Math.PI / 180
    const lat = Math.asin(Math.sin(inc) * Math.sin(ar)) * 180 / Math.PI
    const lon = t.node + Math.atan2(Math.cos(inc) * Math.sin(ar), Math.cos(ar)) * 180 / Math.PI - a * 0.25
    coords.push([((lon + 540) % 360) - 180, lat])
  }
  return coords
}

function dashes(coords, color) {
  const out = []
  for (let i = 0; i < coords.length - 1; i += 2) {
    const a = coords[i]
    const b = coords[i + 1]
    if (Math.abs(a[0] - b[0]) < 180) {
      out.push({ path: [a, b], color: color })
    }
  }
  return out
}

function globeRadius(map) {
  const z = map.getZoom()
  const lat = map.getCenter().lat
  return 512 * Math.pow(2, z) / (2 * Math.PI) * Math.cos(lat * Math.PI / 180)
}

function syncDecor(map) {
  const glow = document.getElementById("globe-glow")
  const shade = document.getElementById("globe-shade")
  if (!glow || !shade) {
    return
  }
  const r = globeRadius(map)
  const c = map.project(map.getCenter())
  let fade = 1
  const z = map.getZoom()
  if (z > 4) {
    fade = Math.max(0, 1 - (z - 4) / 1.2)
  }
  if (map.getPitch() > 4) {
    fade = fade * Math.max(0, 1 - (map.getPitch() - 4) / 10)
  }
  const gr = r * 1.18
  glow.style.left = (c.x - gr) + "px"
  glow.style.top = (c.y - gr) + "px"
  glow.style.width = (gr * 2) + "px"
  glow.style.height = (gr * 2) + "px"
  glow.style.opacity = fade
  shade.style.left = (c.x - r) + "px"
  shade.style.top = (c.y - r) + "px"
  shade.style.width = (r * 2) + "px"
  shade.style.height = (r * 2) + "px"
  shade.style.opacity = fade
}

function createShared(host, world, view) {
  const el = document.createElement("div")
  el.style.position = "absolute"
  el.style.inset = "0"
  host.appendChild(el)
  const map = new maplibregl.Map({
    container: el,
    attributionControl: false,
    renderWorldCopies: false,
    center: view.center,
    zoom: view.zoom,
    minZoom: 1.2,
    maxZoom: 10,
    maxPitch: 60,
    pitchWithRotate: true,
    dragRotate: true,
    touchPitch: true,
    fadeDuration: 0,
    style: {
      version: 8,
      projection: { type: "globe" },
      sources: {
        grat: { type: "geojson", data: graticule() },
        land: { type: "geojson", data: world.land },
        borders: { type: "geojson", data: world.borders },
        india: { type: "geojson", data: world.india }
      },
      layers: [
        { id: "ocean", type: "background", paint: { "background-color": "#0B1832" } },
        { id: "grat", type: "line", source: "grat", paint: { "line-color": "#5D7BB8", "line-opacity": 0.16, "line-width": 0.6 } },
        { id: "land", type: "fill", source: "land", paint: { "fill-color": "#1A2B4D" } },
        { id: "land-edge", type: "line", source: "land", paint: { "line-color": "#2D4470", "line-width": 0.5 } },
        { id: "borders", type: "line", source: "borders", paint: { "line-color": "#3A5486", "line-opacity": 0.55, "line-width": 0.4 } },
        { id: "india", type: "fill", source: "india", paint: { "fill-color": "rgba(255,106,61,0.18)" } },
        { id: "india-edge", type: "line", source: "india", paint: { "line-color": "#FF6A3D", "line-width": 1.2 } }
      ]
    }
  })
  const overlay = new MapLibreOverlay({ interleaved: true, layers: [] })
  map.addControl(overlay)
  const s = { el: el, map: map, overlay: overlay, onPick: null, onNear: null, near: false }
  map.on("move", function () {
    syncDecor(map)
  })
  map.on("zoom", function () {
    const near = map.getZoom() > NEAR_ZOOM
    if (near !== s.near) {
      s.near = near
      if (s.onNear) {
        s.onNear(near)
      }
    }
  })
  map.on("load", function () {
    syncDecor(map)
  })
  map.on("click", function (e) {
    const info = overlay.pickObject({ x: e.point.x, y: e.point.y, radius: 2, layerIds: ["hexes"] })
    if (info && info.object && s.onPick) {
      s.onPick(info.object.id)
    }
  })
  map.on("mousemove", function (e) {
    const info = overlay.pickObject({ x: e.point.x, y: e.point.y, radius: 2, layerIds: ["hexes"] })
    let cursor = ""
    if (info && info.object) {
      cursor = "pointer"
    }
    map.getCanvas().style.cursor = cursor
  })
  return s
}

function pointColor(p, colorBy) {
  if (colorBy === "class") {
    return CLASS_COLOR[p.cls]
  }
  if (colorBy === "sensor") {
    if (p.sensor === "VIIRS") {
      return VIIRS_COLOR
    }
    return MODIS_COLOR
  }
  return VIIRS_COLOR
}

function buildLayers(props, near) {
  const g = props.globe
  const layers = []
  let maxC = 1
  g.hexes.forEach(function (h) {
    if (h.count > maxC) {
      maxC = h.count
    }
  })
  const logMax = Math.log(maxC + 1)
  const showHex = props.layers.hex && !near
  layers.push(new SolidPolygonLayer({
    id: "terminator",
    data: props.night,
    visible: props.layers.terminator,
    getPolygon: function (c) { return lift(c.polygon, LIFT.night) },
    getFillColor: [0, 8, 20, 140],
    parameters: NO_DEPTH_WRITE
  }))
  layers.push(new PolygonLayer({
    id: "hexes",
    data: g.hexes,
    visible: showHex,
    pickable: true,
    stroked: true,
    filled: true,
    getPolygon: function (h) { return lift(h.ring, LIFT.hex) },
    getFillColor: function (h) { return hexToRgb(HEX_RAMP(Math.log(h.count + 1) / logMax)).concat([217]) },
    getLineColor: function (h) {
      if (h.id === props.selected) {
        return [238, 242, 250, 255]
      }
      return [6, 10, 19, 255]
    },
    getLineWidth: function (h) {
      if (h.id === props.selected) {
        return 2
      }
      return 0.6
    },
    lineWidthUnits: "pixels",
    updateTriggers: { getLineColor: props.selected, getLineWidth: props.selected }
  }))
  const points = g.points.filter(function (p) {
    if (p.sensor === "VIIRS") {
      return props.layers.viirs
    }
    return props.layers.modis
  })
  let scale = 1.6
  if (near) {
    scale = 3.4
  }
  layers.push(new ScatterplotLayer({
    id: "points-glow",
    data: points,
    radiusUnits: "pixels",
    getPosition: function (p) { return [p.lon, p.lat, LIFT.points] },
    getRadius: function (p) { return scale * (0.7 + Math.min(p.frp, 25) / 30) * 3.2 },
    getFillColor: function (p) { return pointColor(p, props.colorBy).concat([46]) },
    parameters: NO_DEPTH_WRITE,
    updateTriggers: { getFillColor: props.colorBy, getRadius: scale }
  }))
  layers.push(new ScatterplotLayer({
    id: "points",
    data: points,
    radiusUnits: "pixels",
    getPosition: function (p) { return [p.lon, p.lat, LIFT.points] },
    getRadius: function (p) { return scale * (0.7 + Math.min(p.frp, 25) / 30) },
    getFillColor: function (p) { return pointColor(p, props.colorBy).concat([242]) },
    updateTriggers: { getFillColor: props.colorBy, getRadius: scale }
  }))
  const dashData = []
  const sats = []
  g.orbits.forEach(function (t) {
    const coords = orbitCoords(t)
    const rgb = hexToRgb(t.color)
    dashes(coords, rgb).forEach(function (d) {
      dashData.push(d)
    })
    if (t.satA !== undefined) {
      sats.push({ position: coords[Math.round(t.satA * 2)], color: rgb })
    }
  })
  layers.push(new PathLayer({
    id: "tracks",
    data: dashData,
    visible: props.layers.tracks,
    widthUnits: "pixels",
    getWidth: 1.6,
    getPath: function (d) { return lift(d.path, LIFT.tracks) },
    getColor: function (d) { return d.color.concat([230]) }
  }))
  layers.push(new ScatterplotLayer({
    id: "sat-ring",
    data: sats,
    visible: props.layers.tracks,
    radiusUnits: "pixels",
    stroked: true,
    filled: false,
    lineWidthUnits: "pixels",
    getLineWidth: 1,
    getPosition: function (d) { return [d.position[0], d.position[1], LIFT.tracks] },
    getRadius: 14,
    getLineColor: function (d) { return d.color.concat([128]) }
  }))
  layers.push(new ScatterplotLayer({
    id: "sat-dot",
    data: sats,
    visible: props.layers.tracks,
    radiusUnits: "pixels",
    getPosition: function (d) { return [d.position[0], d.position[1], LIFT.tracks] },
    getRadius: 6,
    getFillColor: function (d) { return d.color.concat([255]) }
  }))
  return layers
}

function GlobeMap(props) {
  const globe = props.globe
  const layers = props.layers
  const colorBy = props.colorBy
  const selected = props.selected
  const night = props.night
  const [near, setNear] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(function () {
    const host = document.getElementById("globe-host")
    if (shared === null) {
      shared = createShared(host, props.world, props.view)
    }
    shared.onNear = setNear
    if (shared.el.parentNode !== host) {
      host.appendChild(shared.el)
    }
    shared.map.resize()
    setNear(shared.near)
    setReady(true)
    syncDecor(shared.map)
    function onResize() {
      shared.map.resize()
    }
    window.addEventListener("resize", onResize)
    return function () {
      window.removeEventListener("resize", onResize)
      shared.onNear = null
      shared.onPick = null
      if (shared.el.parentNode === host) {
        host.removeChild(shared.el)
      }
    }
  }, [props.world, props.view])

  useEffect(function () {
    if (shared !== null) {
      shared.onPick = props.onPick
    }
  }, [props.onPick])

  useEffect(function () {
    if (!ready || shared === null) {
      return
    }
    shared.overlay.setProps({ layers: buildLayers({ globe: globe, layers: layers, colorBy: colorBy, selected: selected, night: night }, near) })
  }, [ready, near, globe, layers, colorBy, selected, night])

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: props.view.frame.left, top: props.view.frame.top, right: props.view.frame.right, bottom: props.view.frame.bottom }}>
        <div id="globe-glow" style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(73,199,245,0) 84%, rgba(73,199,245,0.22) 90%, rgba(73,199,245,0) 100%)" }}></div>
        <div id="globe-host" style={{ position: "absolute", inset: 0 }}></div>
        <div id="globe-shade" style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", border: "1px solid rgba(73,199,245,0.25)", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.45) 80%)" }}></div>
      </div>
      <div className="map-attrib" style={props.attribStyle}>© OpenStreetMap / Natural Earth</div>
    </div>
  )
}

export default GlobeMap
