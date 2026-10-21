import { fixture } from "./request.js"

export function getShell() {
  return fixture("Fetching status…", function () {
    return import("../fixtures/shell.json")
  })
}
