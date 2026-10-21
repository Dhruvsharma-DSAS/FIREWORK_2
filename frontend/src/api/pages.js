import { fixture } from "./request.js"

export function getSensorLab() {
  return fixture("Fetching sensor comparison…", function () {
    return import("../fixtures/sensorlab.json")
  })
}

export function getStudio() {
  return fixture("Fetching your dataset…", function () {
    return import("../fixtures/studio.json")
  })
}

export function getFormula(id) {
  return fixture("Fetching formula " + id + "…", function () {
    return import("../fixtures/formulas.json")
  })
}

export function getValidation() {
  return fixture("Fetching validation results…", function () {
    return import("../fixtures/validation.json")
  })
}

export function getSources() {
  return fixture("Fetching source evidence…", function () {
    return import("../fixtures/sources.json")
  })
}

export function getBlindSpot() {
  return fixture("Fetching blind-spot data…", function () {
    return import("../fixtures/blindspot.json")
  })
}
