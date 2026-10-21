import { fixture } from "./request.js"

export function getHome() {
  return fixture("Fetching hero data…", function () {
    return import("../fixtures/home.json")
  })
}
