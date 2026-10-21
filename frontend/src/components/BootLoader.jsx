import { useState, useEffect } from "react"
import Loader from "./Loader.jsx"
import { watchLoading, loadingState } from "../api/request.js"

const MIN_MS = 300
const FADE_MS = 240

function BootLoader(props) {
  const [startedAt] = useState(Date.now())
  const [fonts, setFonts] = useState(false)
  const [info, setInfo] = useState(loadingState("page"))
  const [phase, setPhase] = useState("shown")

  useEffect(function () {
    let alive = true
    document.fonts.ready.then(function () {
      if (alive) {
        setFonts(true)
      }
    })
    const stop = watchLoading("page", setInfo)
    setInfo(loadingState("page"))
    return function () {
      alive = false
      stop()
    }
  }, [])

  useEffect(function () {
    if (phase !== "shown") {
      return
    }
    if (!fonts || info.loading || info.started === 0) {
      return
    }
    const wait = Math.max(0, MIN_MS - (Date.now() - startedAt))
    const t = setTimeout(function () {
      setPhase("fading")
    }, wait)
    return function () {
      clearTimeout(t)
    }
  }, [fonts, info.loading, info.started, phase, startedAt])

  useEffect(function () {
    if (phase !== "fading") {
      return
    }
    const t = setTimeout(function () {
      setPhase("done")
      props.onDone()
    }, FADE_MS)
    return function () {
      clearTimeout(t)
    }
  }, [phase, props])

  if (phase === "done") {
    return null
  }
  let task = "Loading fonts…"
  if (fonts) {
    task = info.task
  }
  if (fonts && task === "") {
    task = "Starting…"
  }
  let cls = "ldr-layer boot"
  if (phase === "fading") {
    cls = "ldr-layer boot out"
  }
  return (
    <div className={cls}>
      <Loader size="large" task={task} />
    </div>
  )
}

export default BootLoader
