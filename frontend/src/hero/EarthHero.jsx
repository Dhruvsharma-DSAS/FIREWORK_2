import { useState, useEffect } from "react"

function EarthHero(props) {
  const [hero, setHero] = useState(null)

  useEffect(function () {
    let stopped = false
    let S = null
    let raf = 0
    let running = false
    let last = 0
    let dragging = false
    let px = 0
    let py = 0
    let pt = 0
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const canvas = document.getElementById("hero-canvas")

    function tick(now) {
      if (stopped || document.hidden) {
        running = false
        return
      }
      if (last === 0) {
        last = now
      }
      const dt = (now - last) / 1000
      last = now
      S.frame(dt)
      if (reduce && !dragging) {
        running = false
        return
      }
      raf = requestAnimationFrame(tick)
    }

    function start() {
      if (running || stopped || S === null) {
        return
      }
      running = true
      last = 0
      raf = requestAnimationFrame(tick)
    }

    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf)
        running = false
        return
      }
      if (!reduce) {
        start()
      }
    }

    function onDown(e) {
      if (S === null) {
        return
      }
      dragging = true
      px = e.clientX
      py = e.clientY
      pt = performance.now()
      canvas.setPointerCapture(e.pointerId)
      canvas.style.cursor = "grabbing"
      S.startDrag()
      start()
    }

    function onMove(e) {
      if (!dragging) {
        return
      }
      const now = performance.now()
      S.drag(e.clientX - px, e.clientY - py, (now - pt) / 1000)
      px = e.clientX
      py = e.clientY
      pt = now
    }

    function onUp(e) {
      if (!dragging) {
        return
      }
      dragging = false
      canvas.style.cursor = "grab"
      if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId)
      }
      S.endDrag(performance.now() - pt)
    }

    canvas.addEventListener("pointerdown", onDown)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerup", onUp)
    canvas.addEventListener("pointercancel", onUp)
    document.addEventListener("visibilitychange", onVisibility)

    import("./earth3d.js").then(function (kit) {
      return kit.createHero(canvas, { dpr: Math.min(window.devicePixelRatio || 1, 1.5), fires: props.fires })
    }).then(function (s) {
      if (stopped) {
        s.dispose()
        return
      }
      S = s
      if (reduce) {
        S.setAuto(false)
      }
      setHero(s)
      if (!reduce) {
        start()
      }
    })

    return function () {
      stopped = true
      cancelAnimationFrame(raf)
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointercancel", onUp)
      document.removeEventListener("visibilitychange", onVisibility)
      if (S) {
        S.dispose()
      }
    }
  }, [props.fires])

  useEffect(function () {
    if (hero === null) {
      return
    }
    hero.setSize(props.width, props.height)
    hero.frame(0)
  }, [hero, props.width, props.height])

  const k = props.height / 1000
  let posterOpacity = 1
  if (hero !== null) {
    posterOpacity = 0
  }
  return (
    <div>
      <canvas id="hero-canvas" aria-label="Rotating Earth with an orbiting satellite. Drag to rotate." style={{ position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "grab", touchAction: "pan-y" }}></canvas>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/hero/poster.jpg)", backgroundSize: "auto 100%", backgroundPosition: "right top", backgroundRepeat: "no-repeat", opacity: posterOpacity, transition: "opacity 240ms ease", pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", left: props.width - 270 * k, top: 250 * k, width: 0, height: 0, pointerEvents: "none", mixBlendMode: "screen", transform: "scale(" + k + ")" }}>
        <div style={{ position: "absolute", left: -420, top: -420, width: 840, height: 840, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,236,200,.95) 0%,rgba(255,196,120,.55) 4%,rgba(255,150,70,.22) 14%,rgba(120,170,255,.10) 32%,rgba(0,0,0,0) 60%)" }}></div>
        <div style={{ position: "absolute", left: -700, top: -2, width: 1400, height: 4, background: "linear-gradient(90deg,transparent,rgba(255,230,190,.55),transparent)", filter: "blur(1px)" }}></div>
        <div style={{ position: "absolute", left: -1, top: -120, width: 2, height: 240, background: "linear-gradient(transparent,rgba(255,230,190,.35),transparent)" }}></div>
        <div style={{ position: "absolute", left: -14, top: -14, width: 28, height: 28, borderRadius: "50%", background: "#fff", boxShadow: "0 0 30px 12px rgba(255,240,210,.9)" }}></div>
      </div>
    </div>
  )
}

export default EarthHero
