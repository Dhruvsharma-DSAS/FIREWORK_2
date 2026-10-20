export function getCalendar(region) {
  return import("../fixtures/calendar.json").then(function (m) {
    if (m.default.data.region !== region) {
      return { data: null, meta: { ...m.default.meta, error: "No calendar for region " + region } }
    }
    return m.default
  })
}
