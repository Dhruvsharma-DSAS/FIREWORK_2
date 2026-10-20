export function getShell() {
  return import("../fixtures/shell.json").then(function (m) {
    return m.default
  })
}
