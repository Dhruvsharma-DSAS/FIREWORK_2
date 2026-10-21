import { request } from "./request.js"

export function getMapKit() {
  return request("Loading globe engine…", function () {
    return import("../components/GlobeMap.jsx")
  })
}
