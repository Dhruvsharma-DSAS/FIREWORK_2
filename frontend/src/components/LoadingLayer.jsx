import { useState, useEffect } from "react"
import Loader from "./Loader.jsx"
import { watchLoading, loadingState } from "../api/request.js"

const MIN_MS = 300
const FADE_MS = 240

function LoadingLayer(props) {
  const [base] = useState(loadingState(props.scope).started)
  const [info, setInfo] = useState(loadingState(props.scope))
  const [phase, setPhase] = useState("hidden")
  const [shownAt, setShownAt] = useState(0)
  const [task, setTask] = useState("")

  useEffect(function () {
    return watchLoading(props.scope, setInfo)
  }, [props.scope])

  useEffect(function () {
    if (info.started === base) {
      return
    }
    setPhase("shown")
    setShownAt(0)
  }, [info.started, base])

  useEffect(function () {
    if (phase === "shown" && shownAt === 0) {
      setShownAt(Date.now())
    }
  }, [phase, shownAt])

  useEffect(function () {
    if (info.task !== "") {
      setTask(info.task)
    }
  }, [info.task])

  useEffect(function () {
    if (info.loading || phase !== "shown" || shownAt === 0) {
      return
    }
    const wait = Math.max(0, MIN_MS - (Date.now() - shownAt))
    const t = setTimeout(function () {
      setPhase("fading")
    }, wait)
    return function () {
      clearTimeout(t)
    }
  }, [info.loading, phase, shownAt])

  useEffect(function () {
    if (phase !== "fading") {
      return
    }
    const t = setTimeout(function () {
      setPhase("hidden")
    }, FADE_MS)
    return function () {
      clearTimeout(t)
    }
  }, [phase])

  if (phase === "hidden") {
    return null
  }
  let cls = "ldr-layer " + props.variant
  if (phase === "fading") {
    cls = cls + " out"
  }
  let size = "large"
  if (props.variant === "inline") {
    size = "small"
  }
  return (
    <div className={cls}>
      <Loader size={size} task={task} />
    </div>
  )
}

export default LoadingLayer
