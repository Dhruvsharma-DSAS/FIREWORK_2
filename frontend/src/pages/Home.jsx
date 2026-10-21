import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import * as d3 from "d3"
import Topbar from "../components/Topbar.jsx"
import DemoBanner from "../components/DemoBanner.jsx"
import EarthHero from "../hero/EarthHero.jsx"
import { getShell } from "../api/shell.js"
import { getHome } from "../api/home.js"
import { getWorld } from "../api/geo.js"
import "../styles/home.css"

function viewport() {
  return { w: Math.max(window.innerWidth, 1280), h: Math.max(window.innerHeight, 620) }
}

function MiniMap(props) {
  const proj = d3.geoMercator().center([76, 29.5]).scale(1300).translate([65, 65])
  const path = d3.geoPath(proj)
  let land = null
  let borders = null
  if (props.world) {
    land = <path d={path(props.world.land)} fill="#18233d" stroke="#2b3a5e" />
    borders = <path d={path(props.world.borders)} fill="none" stroke="#40507a" strokeWidth="0.6" />
  }
  const dots = []
  props.fires.slice(0, 390).forEach(function (f, i) {
    const p = proj([f[1], f[0]])
    if (p[0] > 0 && p[0] < 130 && p[1] > 0 && p[1] < 130) {
      dots.push(<circle key={i} cx={p[0]} cy={p[1]} r="1.4" fill={f[2]} opacity=".85" />)
    }
  })
  return (
    <svg width="130" height="130" style={{ borderRadius: 10, background: "#0a1222" }}>
      {land}
      {borders}
      {dots}
    </svg>
  )
}

function Home() {
  const [shell, setShell] = useState(null)
  const [page, setPage] = useState(null)
  const [world, setWorld] = useState(null)
  const [size, setSize] = useState(viewport())

  useEffect(function () {
    getShell().then(setShell)
    getHome().then(setPage)
    getWorld().then(setWorld)
  }, [])

  useEffect(function () {
    function onResize() {
      setSize(viewport())
    }
    window.addEventListener("resize", onResize)
    return function () {
      window.removeEventListener("resize", onResize)
    }
  }, [])

  const k = size.h / 1000
  const ui = Math.max(0.62, Math.min(1.15, Math.min(size.h / 1000, size.w / 1440)))

  let chips = []
  if (shell) {
    chips = shell.data.home_chips
  }

  let hero = null
  let fires = []
  if (page) {
    fires = page.data.fires
    hero = <EarthHero fires={fires} width={size.w} height={size.h} />
  }

  let content = null
  if (page) {
    const d = page.data
    content = (
      <div>
        <div className="glass tel" style={{ position: "absolute", right: 48 * k, top: 360 * k, width: 200, padding: "14px 16px", transform: "scale(" + ui + ")", transformOrigin: "top right" }}>
          <div className="caps" style={{ fontSize: 10, color: "var(--mint)" }}>● {d.satellite.name}</div>
          {d.satellite.rows.map(function (r, i) {
            let style = undefined
            if (i === d.satellite.rows.length - 1) {
              style = { border: 0 }
            }
            return <div key={r.label} className="kv" style={style}><span className="dim">{r.label}</span><b>{r.value}</b></div>
          })}
        </div>
        <div style={{ position: "absolute", left: 72, bottom: 56 * ui, display: "flex", gap: 14, transform: "scale(" + ui + ")", transformOrigin: "bottom left" }}>
          <div className="glass" style={{ width: 190, height: 150, padding: 16, position: "relative", overflow: "hidden" }}>
            <div className="caps dim" style={{ fontSize: 10 }}>Record</div>
            <div style={{ fontFamily: "Inter", fontSize: 44, fontWeight: 300, letterSpacing: "-.03em", marginTop: 18 }}>{d.record_start}→</div>
            <div className="dim" style={{ fontSize: 12 }}>MODIS + VIIRS, one ruler</div>
          </div>
          <div className="glass" style={{ width: 190, height: 150, padding: 16, position: "relative", overflow: "hidden" }}>
            <div className="caps dim" style={{ fontSize: 10 }}>Every value</div>
            <svg width="160" height="70" style={{ position: "absolute", left: 15, bottom: 16 }}>
              <path d="M10 64 A70 70 0 0 1 150 64" fill="none" stroke="rgba(150,180,255,.2)" strokeWidth="6" />
              <path d="M10 64 A70 70 0 0 1 128 22" fill="none" stroke="var(--ember)" strokeWidth="6" strokeLinecap="round" />
              <text x="80" y="60" textAnchor="middle" fill="#EEF2FA" fontFamily="Inter" fontSize="26" fontWeight="300">± CI</text>
            </svg>
          </div>
        </div>
        <div style={{ position: "absolute", right: 430 * ui, bottom: 64 * ui, transform: "scale(" + ui + ")", transformOrigin: "bottom right" }}>
          <svg width="170" height="170" style={{ display: "block" }}>
            <circle cx="85" cy="85" r="78" fill="none" stroke="rgba(150,180,255,.25)" strokeDasharray="1 5" />
            <circle cx="85" cy="85" r="60" fill="none" stroke="rgba(150,180,255,.12)" />
            <circle cx="85" cy="7" r="3" fill="var(--flame)" />
            <circle cx="163" cy="85" r="3" fill="var(--sky)" />
            <text x="85" y="78" textAnchor="middle" fill="#EEF2FA" fontFamily="Inter" fontSize="30" fontWeight="300">{d.sensors_joined}</text>
            <text x="85" y="94" textAnchor="middle" fill="#9AA6BD" fontFamily="SG" fontSize="8" letterSpacing="1.5">SENSORS JOINED</text>
            <text x="85" y="116" textAnchor="middle" fill="#EEF2FA" fontFamily="Inter" fontSize="16" fontWeight="300">{d.sensors_live} live</text>
            <text x="85" y="129" textAnchor="middle" fill="#9AA6BD" fontFamily="SG" fontSize="7" letterSpacing="1.2">{d.sensors_live_note}</text>
          </svg>
        </div>
        <div className="glass" style={{ position: "absolute", right: 48 * ui, bottom: 56 * ui, width: 340, padding: 14, display: "flex", gap: 12, transform: "scale(" + ui + ")", transformOrigin: "bottom right" }}>
          <div style={{ flex: 1 }}>
            <div className="caps" style={{ fontSize: 10, color: "var(--ember)" }}>Hot-spot cluster flagged</div>
            <div style={{ fontSize: 11.5, lineHeight: 1.75, marginTop: 8 }}>
              <span className="dim">Region</span><br />{d.cluster.region}<br />
              <span className="dim">Calibrated count</span><br />k·n<sub>MODIS</sub> ± {d.cluster.ci_pct}% CI<br />
              <span className="dim">Status</span> <DemoBanner meta={page.meta} style={{ padding: "2px 7px", fontSize: 9 }} />
            </div>
          </div>
          <MiniMap world={world} fires={fires} />
        </div>
      </div>
    )
  }

  return (
    <div className="app fluid" style={{ background: "#03060d" }}>
      {hero}
      <div className="vline" style={{ left: 540 * ui, pointerEvents: "none" }}></div>
      <div className="vline" style={{ left: size.w - 540 * ui, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(3,6,13,.88) 0%,rgba(3,6,13,.55) 30%,rgba(3,6,13,0) 52%)", pointerEvents: "none" }}></div>
      <Topbar variant="home" active="Home" chips={chips} />
      <div style={{ position: "absolute", left: 72, top: 168 * ui, width: 640, transform: "scale(" + ui + ")", transformOrigin: "top left" }}>
        <div className="caps" style={{ color: "var(--flame)" }}>NASA Space Apps 2026 · MODIS ⇄ VIIRS hot-spot harmonization</div>
        <h1 className="hero-h" style={{ marginTop: 26 }}>Operational<br />fire memory<br /><em>for planet Earth.</em></h1>
        <p style={{ fontSize: 18, lineHeight: 1.62, color: "#B9C3D6", marginTop: 28, width: 470, letterSpacing: ".01em" }}>Turning 25 years of satellite hot-spots into one calibrated record — with the source, the uncertainty and the blind spots shown for every number.</p>
        <div className="row" style={{ marginTop: 34, gap: 16 }}>
          <Link className="pill" to="/explore">EXPLORE THE ARCHIVE <i>→</i></Link>
          <Link className="pill" to="/studio" style={{ borderColor: "rgba(255,181,71,.5)", color: "var(--flame)" }}>UPLOAD YOUR DATA <i style={{ background: "var(--flame)" }}>↑</i></Link>
        </div>
      </div>
      {content}
      <div style={{ position: "absolute", left: 72, bottom: 18 * ui, fontSize: 10.5 * ui, pointerEvents: "none" }} className="faint mono">Earth textures: NASA Blue/Black Marble (public domain) · satellite: generic 3-D model · fire points: demo pattern</div>
    </div>
  )
}

export default Home
