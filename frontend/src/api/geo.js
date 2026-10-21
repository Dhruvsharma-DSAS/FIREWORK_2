import { request } from "./request.js"

let world = null
let countries = null
let states = null

function getJson(url) {
  return fetch(url).then(function (r) {
    return r.json()
  })
}

export function getWorld(scope) {
  if (world !== null) {
    return Promise.resolve(world)
  }
  return request("Fetching coastlines…", function () {
    return Promise.all([getJson("/data/world-land.json"), getJson("/data/world-borders.json"), getJson("/data/world-india.json")])
  }, scope).then(function (parts) {
    world = { land: parts[0], borders: parts[1], india: parts[2] }
    return world
  })
}

export function getRegionBase() {
  if (countries !== null && states !== null) {
    return Promise.resolve({ countries: countries, states: states })
  }
  return request("Fetching boundaries…", function () {
    return Promise.all([getJson("/data/world-countries.json"), getJson("/data/india_states.json")])
  }).then(function (parts) {
    countries = parts[0]
    states = parts[1]
    return { countries: countries, states: states }
  })
}
