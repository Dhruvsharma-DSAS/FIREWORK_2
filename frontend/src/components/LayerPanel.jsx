function Toggle(props) {
  let cls = "toggle"
  if (props.on) {
    cls = "toggle on"
  }
  return <span className={cls} role="switch" aria-checked={props.on} aria-label={props.label} tabIndex={0} onClick={props.onClick}></span>
}

function LayerRow(props) {
  let swatch = null
  if (props.swatch) {
    swatch = <span className="legend-swatch" style={{ background: props.swatch }}></span>
  }
  let label = props.label
  if (props.swatch) {
    label = " " + props.label
  }
  return (
    <div className="kv">
      <span>{swatch}{label}</span>
      <Toggle on={props.layers[props.name]} label={props.label} onClick={function () { props.onToggle(props.name) }} />
    </div>
  )
}

function LayerPanel(props) {
  const modes = [
    { key: "heat", label: "Heat" },
    { key: "sensor", label: "Sensor" },
    { key: "class", label: "Source" }
  ]
  return (
    <div className="panel" style={{ position: "absolute", left: 20, top: 84, width: 270, bottom: 118 }}>
      <div className="panel-h"><span className="caps">Layers</span><span className="faint mono" style={{ fontSize: 11 }}>{props.activeCount} active</span></div>
      <div className="panel-b" style={{ fontSize: 13 }}>
        <div className="caps dim" style={{ margin: "6px 0 8px" }}>Fire observations</div>
        <LayerRow name="viirs" label="VIIRS 375 m hotspots" swatch="#FF8A3D" layers={props.layers} onToggle={props.onToggle} />
        <LayerRow name="modis" label="MODIS 1 km hotspots" swatch="#8FB8FF" layers={props.layers} onToggle={props.onToggle} />
        <LayerRow name="hex" label="H3 density (res 2)" layers={props.layers} onToggle={props.onToggle} />
        <div className="caps dim" style={{ margin: "14px 0 8px" }}>Context</div>
        <LayerRow name="burned" label="Burned area (MCD64A1)" layers={props.layers} onToggle={props.onToggle} />
        <LayerRow name="landcover" label="Land cover (WorldCover)" layers={props.layers} onToggle={props.onToggle} />
        <LayerRow name="clear" label="Clear-sky coverage" layers={props.layers} onToggle={props.onToggle} />
        <LayerRow name="terminator" label="Day / night terminator" layers={props.layers} onToggle={props.onToggle} />
        <LayerRow name="tracks" label="Satellite ground tracks" layers={props.layers} onToggle={props.onToggle} />
        <div className="caps dim" style={{ margin: "14px 0 8px" }}>Colour by</div>
        <div className="seg">
          {modes.map(function (m) {
            let cls = ""
            if (m.key === props.colorBy) {
              cls = "on"
            }
            return <span key={m.key} className={cls} onClick={function () { props.onColorBy(m.key) }}>{m.label}</span>
          })}
        </div>
        <div className="caps dim" style={{ margin: "16px 0 6px" }}>Confidence ≥</div>
        <div className="slider"><i style={{ width: props.confidence.slider_pct + "%" }}></i><b style={{ left: (props.confidence.slider_pct - 3) + "%" }}></b></div>
        <div className="mono faint" style={{ fontSize: 11 }}>{props.confidence.label} ({props.confidence.value}) · same rule both sensors</div>
      </div>
    </div>
  )
}

export default LayerPanel
