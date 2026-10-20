export function getExplorer() {
  return import("../fixtures/explorer.json").then(function (m) {
    return m.default
  })
}
