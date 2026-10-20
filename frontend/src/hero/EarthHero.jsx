import { useState, useEffect } from "react"

const LOOP_MS = 24000
const STILL_T = 0.45
const P0 = [-0.15, 1.75, -4.8]
const P1 = [0.7, 1.5, -4.8]
const P2 = [2.2, 0.95, -4.8]

function bezier(t) {
  const u = 1 - t
  return [0, 1, 2].map(function (i) {
    return u * u * P0[i] + 2 * u * t * P1[i] + t * t * P2[i]
  })
}

function placeOverlay(S, t) {
  S.place(0, bezier(t), [0.75 + 0.25 * Math.sin(t * 3.1), -0.5 + 0.3 * t, -0.62 + 0.1 * t])
  S.render()
  const v = S.sats[0].sat.position.clone().project(S.cam)
  const sx = (v.x + 1) / 2 * 1600
  const sy = (1 - v.y) / 2 * 1000
  const lead = document.getElementById("hero-lead")
  const dot = document.getElementById("hero-leaddot")
  const flare = document.getElementById("hero-flare")
  if (lead) {
    lead.setAttribute("d", "M1352 430 L1320 430 L" + sx.toFixed(0) + " " + sy.toFixed(0))
  }
  if (dot) {
    dot.setAttribute("cx", sx)
    dot.setAttribute("cy", sy)
  }
  if (flare) {
    flare.style.opacity = 0.85 + 0.15 * Math.sin(t * 6.283 * 2)
  }
}

function EarthHero(props) {
  const [ready, setReady] = useState(false)

  useEffect(function () {
    let stopped = false
    let frame = 0
    let S = null
    let elapsed = STILL_T * LOOP_MS
    let last = 0
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const canvas = document.getElementById("hero-canvas")

    function tick(now) {
      if (stopped) {
        return
      }
      if (!document.hidden) {
        if (last !== 0) {
          elapsed = elapsed + (now - last)
        }
        last = now
        placeOverlay(S, (elapsed / LOOP_MS) % 1)
      } else {
        last = 0
      }
      frame = requestAnimationFrame(tick)
    }

    import("./earth3d.js").then(function (kit) {
      const sun = kit.llToVec(5, 78 + 112, 1)
      return kit.scene(canvas, {
        w: 1600, h: 1000, dpr: Math.min(window.devicePixelRatio || 1, 2),
        camLL: [12, 77], camDist: 23, look: [0, 0, 0], shift: [-260, -430],
        sun: [sun.x, sun.y, sun.z], sunCam: [0.62, 0.30, -1], fov: 40, nightBoost: 3.2,
        fires: props.fires, fireSize: 0.12, exposure: 1.15,
        satCam: [{ at: [0.95, 0.55, -4.8], rot: [0.75, -0.5, -0.62], scale: 0.13, tilt: 0.15, env: 0.8 }]
      })
    }).then(function (s) {
      if (stopped) {
        s.renderer.dispose()
        return
      }
      S = s
      placeOverlay(S, STILL_T)
      setReady(true)
      if (!reduce) {
        frame = requestAnimationFrame(tick)
      }
    })

    return function () {
      stopped = true
      cancelAnimationFrame(frame)
      if (S) {
        S.renderer.dispose()
      }
    }
  }, [props.fires])

  let posterOpacity = 1
  if (ready) {
    posterOpacity = 0
  }
  return (
    <div>
      <canvas id="hero-canvas" style={{ position: "absolute", inset: 0, width: 1600, height: 1000 }}></canvas>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/hero/poster.jpg)", backgroundSize: "1600px 1000px", opacity: posterOpacity, transition: "opacity 240ms ease", pointerEvents: "none" }}></div>
      <div id="hero-flare" style={{ position: "absolute", left: 1330, top: 250, width: 0, height: 0, pointerEvents: "none", mixBlendMode: "screen" }}>
        <div style={{ position: "absolute", left: -420, top: -420, width: 840, height: 840, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,236,200,.95) 0%,rgba(255,196,120,.55) 4%,rgba(255,150,70,.22) 14%,rgba(120,170,255,.10) 32%,rgba(0,0,0,0) 60%)" }}></div>
        <div style={{ position: "absolute", left: -700, top: -2, width: 1400, height: 4, background: "linear-gradient(90deg,transparent,rgba(255,230,190,.55),transparent)", filter: "blur(1px)" }}></div>
        <div style={{ position: "absolute", left: -1, top: -120, width: 2, height: 240, background: "linear-gradient(transparent,rgba(255,230,190,.35),transparent)" }}></div>
        <div style={{ position: "absolute", left: -14, top: -14, width: 28, height: 28, borderRadius: "50%", background: "#fff", boxShadow: "0 0 30px 12px rgba(255,240,210,.9)" }}></div>
      </div>
    </div>
  )
}

export default EarthHero
