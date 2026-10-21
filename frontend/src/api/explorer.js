import { fixture } from "./request.js"

export function getExplorer() {
  return fixture("Fetching explorer layers…", function () {
    return import("../fixtures/explorer.json")
  })
}

export function getCell(id) {
  return fixture("Fetching cell " + id.slice(0, 7) + "…", function () {
    return import("../fixtures/explorer_cells.json")
  }, "cell").then(function (body) {
    const cell = body.data[id]
    if (!cell) {
      return { data: null, meta: { ...body.meta, error: "No data for cell " + id } }
    }
    return { data: cell, meta: body.meta }
  })
}
