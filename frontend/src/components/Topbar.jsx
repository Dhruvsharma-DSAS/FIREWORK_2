import { Link } from "react-router-dom"
import Logo from "./Logo.jsx"
import StatusChip from "./StatusChip.jsx"
import DemoBanner from "./DemoBanner.jsx"

const NAV = [
  { label: "Home", to: "/" },
  { label: "Explorer", to: "/explore" },
  { label: "Calendar", to: "/calendar/punjab" },
  { label: "Sensor Lab", to: "/sensors" },
  { label: "Data Studio", to: "/studio" },
  { label: "Formulas", to: "/formulas/F08" },
  { label: "Validation", to: "/validation" },
  { label: "Sources", to: "/sources" },
  { label: "Blind Spot", to: "/blind-spot" },
  { label: "Learn", to: "/learn" }
]

const HOME_NAV = ["Home", "Explorer", "Calendar", "Sensor Lab", "Data Studio", "Formulas", "Validation", "Learn"]

function Topbar(props) {
  let items = NAV
  let style = undefined
  if (props.variant === "home") {
    items = NAV.filter(function (n) {
      return HOME_NAV.indexOf(n.label) !== -1
    })
    style = { background: "rgba(3,6,13,.35)" }
  }
  let chips = []
  if (props.chips) {
    chips = props.chips
  }
  let search = null
  if (props.variant !== "home") {
    search = <span className="btn ghost" style={{ padding: "7px 10px" }}>⌘K Search</span>
  }
  return (
    <div className="topbar" style={style}>
      <Link className="brand" to="/">
        <Logo size={34} />
        <div>FIREWORK CHRONOS<small>EARTH INTELLIGENCE ATLAS</small></div>
      </Link>
      <nav className="nav">
        {items.map(function (n) {
          let cls = ""
          if (n.label === props.active) {
            cls = "on"
          }
          return <Link key={n.label} className={cls} to={n.to}>{n.label}</Link>
        })}
      </nav>
      <div className="spacer"></div>
      <div className="row">
        <DemoBanner meta={props.meta} />
        {chips.map(function (c) {
          return <StatusChip key={c.label} kind={c.kind} label={c.label} />
        })}
      </div>
      {search}
    </div>
  )
}

export default Topbar
