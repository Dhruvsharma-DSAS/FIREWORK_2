let world = null

function getJson(url) {
  return fetch(url).then(function (r) {
    return r.json()
  })
}

export function getWorld() {
  if (world !== null) {
    return Promise.resolve(world)
  }
  return Promise.all([getJson("/data/world-land.json"), getJson("/data/world-borders.json"), getJson("/data/world-india.json")]).then(function (parts) {
    world = { land: parts[0], borders: parts[1], india: parts[2] }
    return world
  })
}
