import StatusChip from "./StatusChip.jsx"

function DemoBanner(props) {
  if (!props.meta || props.meta.demo !== true) {
    return null
  }
  let label = "DEMO"
  if (props.label) {
    label = props.label
  }
  return <StatusChip kind="demo" label={label} style={props.style} />
}

export default DemoBanner
