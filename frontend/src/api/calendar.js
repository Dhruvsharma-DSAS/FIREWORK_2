import { fixture } from "./request.js"

export function getCalendar(region) {
  return fixture("Fetching calendar…", function () {
    return import("../fixtures/calendar.json")
  }).then(function (body) {
    if (body.data.region !== region) {
      return { data: null, meta: { ...body.meta, error: "No calendar for region " + region } }
    }
    return body
  })
}
