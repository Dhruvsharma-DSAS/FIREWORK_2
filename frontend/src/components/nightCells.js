function terminatorLat(lon, sun) {
  const dec = sun.sunLat * Math.PI / 180
  const dl = (lon - sun.sunLon) * Math.PI / 180
  return Math.atan(-Math.cos(dl) / Math.tan(dec)) * 180 / Math.PI
}

export function nightCells(sun) {
  const cells = []
  const lonStep = 2
  const latStep = 4
  let sign = 1
  if (sun.sunLat > 0) {
    sign = -1
  }
  for (let lon = -180; lon < 180; lon += lonStep) {
    const a = terminatorLat(lon, sun)
    const b = terminatorLat(lon + lonStep, sun)
    let edge = Math.ceil(Math.max(a, b) / latStep) * latStep
    if (sign === -1) {
      edge = Math.floor(Math.min(a, b) / latStep) * latStep
    }
    cells.push({ polygon: [[lon, a], [lon + lonStep, b], [lon + lonStep, edge], [lon, edge], [lon, a]] })
    while ((sign === 1 && edge < 89.9) || (sign === -1 && edge > -89.9)) {
      const next = Math.max(-89.9, Math.min(89.9, edge + sign * latStep))
      cells.push({ polygon: [[lon, edge], [lon + lonStep, edge], [lon + lonStep, next], [lon, next], [lon, edge]] })
      edge = next
    }
  }
  return cells
}
