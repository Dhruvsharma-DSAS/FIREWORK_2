import { useState, useEffect } from "react"
import Topbar from "../components/Topbar.jsx"
import { getShell } from "../api/shell.js"

function ComingSoon(props) {
  const [shell, setShell] = useState(null)

  useEffect(function () {
    getShell().then(setShell)
  }, [])

  let chips = []
  if (shell) {
    chips = shell.data.chips
  }
  let note = "Page not found."
  if (props.batch !== "") {
    note = "This page is built in M1 batch " + props.batch + "."
  }
  return (
    <div className="app">
      <Topbar active={props.active} chips={chips} />
      <div className="panel" style={{ position: "absolute", left: 32, top: 96, width: 520, padding: 24 }}>
        <div className="caps dim">Coming soon</div>
        <div className="display" style={{ fontSize: 28, marginTop: 8 }}>{note}</div>
      </div>
    </div>
  )
}

export default ComingSoon
