export function getHome() {
  return import("../fixtures/home.json").then(function (m) {
    return m.default
  })
}
