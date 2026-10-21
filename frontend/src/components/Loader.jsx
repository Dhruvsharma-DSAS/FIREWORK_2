function Loader(props) {
  let cls = "ldr"
  if (props.size === "small") {
    cls = "ldr small"
  }
  let title = null
  if (props.size !== "small") {
    title = <div className="caps dim ldr-title">Loading · FIREWORK CHRONOS</div>
  }
  let task = null
  if (props.task) {
    task = <div className="mono faint ldr-task">{props.task}</div>
  }
  return (
    <div className={cls} role="status" aria-live="polite">
      <div className="ldr-stage">
        <div className="ldr-ring a">
          <div className="ldr-orbit"><span className="ldr-sat"></span></div>
        </div>
        <div className="ldr-globe"><span className="ldr-dot"></span></div>
        <div className="ldr-ring b">
          <div className="ldr-orbit"><span className="ldr-sat"></span></div>
        </div>
      </div>
      {title}
      {task}
    </div>
  )
}

export default Loader
