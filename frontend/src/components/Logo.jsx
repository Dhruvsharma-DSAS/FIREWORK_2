function Logo(props) {
  const ring = "#EEF2FA"
  const ticks = []
  for (let i = 0; i < 12; i++) {
    const a = i * 30 * Math.PI / 180
    let r1 = 33
    let width = 1.6
    if (i % 3 === 0) {
      r1 = 30
      width = 3
    }
    ticks.push({ x1: 50 + Math.sin(a) * r1, y1: 50 - Math.cos(a) * r1, x2: 50 + Math.sin(a) * 36, y2: 50 - Math.cos(a) * 36, width: width })
  }
  const dotAngle = 1.5 * 30 * Math.PI / 180
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="none" stroke={ring} strokeWidth="4" />
      {ticks.map(function (t, i) {
        return <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={ring} strokeWidth={t.width} strokeLinecap="round" />
      })}
      <ellipse cx="50" cy="50" rx="14" ry="40" fill="none" stroke={ring} strokeOpacity="0.55" strokeWidth="1.6" />
      <ellipse cx="50" cy="50" rx="46" ry="13" transform="rotate(-28 50 50)" fill="none" stroke="#49C7F5" strokeWidth="2.6" />
      <circle cx={50 + Math.sin(dotAngle) * 40} cy={50 - Math.cos(dotAngle) * 40} r="7.5" fill="#FF6A3D" />
      <circle cx="50" cy="50" r="3.2" fill={ring} />
    </svg>
  )
}

export default Logo
