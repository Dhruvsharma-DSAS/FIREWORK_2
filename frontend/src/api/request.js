const pending = {}
const started = {}
const lastTask = {}
let listeners = []

function snapshot(scope) {
  let list = pending[scope]
  if (!list) {
    list = []
  }
  let task = ""
  if (lastTask[scope]) {
    task = lastTask[scope]
  }
  if (list.length > 0) {
    task = list[list.length - 1].task
  }
  let count = started[scope]
  if (!count) {
    count = 0
  }
  return { loading: list.length > 0, task: task, started: count }
}

function notify(scope) {
  const info = snapshot(scope)
  listeners.forEach(function (l) {
    if (l.scope === scope) {
      l.fn(info)
    }
  })
}

export function request(task, load, scope) {
  let s = "page"
  if (scope) {
    s = scope
  }
  if (!pending[s]) {
    pending[s] = []
  }
  const entry = { task: task }
  pending[s].push(entry)
  lastTask[s] = task
  started[s] = snapshot(s).started + 1
  notify(s)
  function done() {
    pending[s] = pending[s].filter(function (e) {
      return e !== entry
    })
    notify(s)
  }
  return load().then(function (result) {
    done()
    return result
  }, function (err) {
    done()
    throw err
  })
}

export function loadingState(scope) {
  return snapshot(scope)
}

export function watchLoading(scope, fn) {
  const l = { scope: scope, fn: fn }
  listeners.push(l)
  return function () {
    listeners = listeners.filter(function (x) {
      return x !== l
    })
  }
}

export function fixture(task, importer, scope) {
  return request(task, function () {
    return importer().then(function (m) {
      return m.default
    })
  }, scope)
}
