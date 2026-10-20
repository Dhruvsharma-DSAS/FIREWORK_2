function StatusChip(props) {
  return (
    <span className={"chip " + props.kind} style={props.style}>
      <span className="dot"></span>
      {props.label}
    </span>
  )
}

export default StatusChip
