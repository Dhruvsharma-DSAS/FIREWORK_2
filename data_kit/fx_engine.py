import json
import time
import requests

REGISTRY = json.load(open("data_sources.json"))

CACHE = {}
HEALTH = {}


def is_healthy(source_name):
    if source_name in HEALTH:
        last = HEALTH[source_name]
        if last["ok"] == False and time.time() - last["time"] < 600:
            return False
    return True


def mark(source_name, ok):
    HEALTH[source_name] = {"ok": ok, "time": time.time()}


def passes_quality(rows, rule):
    if rows is None:
        return False
    if len(rows) < rule.get("min_rows", 1):
        return False
    return True


def resolve(input_id, fetchers, rule):
    entry = None
    for item in REGISTRY["inputs"]:
        if item["id"] == input_id:
            entry = item
    if entry is None:
        return {"data": None, "meta": {"error": "unknown input " + input_id}}

    key = input_id + json.dumps(rule, sort_keys=True)
    if key in CACHE:
        return CACHE[key]

    tried = []
    sources = entry["sources"]
    for source in sources:
        name = source["name"]
        if name not in fetchers:
            continue
        if is_healthy(name) == False:
            tried.append(name + " (skipped, unhealthy)")
            continue
        try:
            rows = fetchers[name](rule)
        except Exception as e:
            mark(name, False)
            tried.append(name + " (error: " + str(e)[:60] + ")")
            continue
        if passes_quality(rows, rule):
            mark(name, True)
            result = {"data": rows, "meta": {"data_source": name, "fallback_used": len(tried) > 0, "tried": tried, "unit": entry["unit"]}}
            CACHE[key] = result
            return result
        tried.append(name + " (failed quality)")
    return {"data": None, "meta": {"data_source": None, "fallback_used": True, "tried": tried, "error": "all sources failed"}}


def fetch_open_meteo(rule):
    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {"latitude": rule["lat"], "longitude": rule["lon"], "start_date": rule["start"], "end_date": rule["end"], "daily": "wind_speed_10m_max,relative_humidity_2m_mean"}
    r = requests.get(url, params=params, timeout=30)
    r.raise_for_status()
    d = r.json()["daily"]
    rows = []
    for i in range(len(d["time"])):
        rows.append({"date": d["time"][i], "wind": d["wind_speed_10m_max"][i], "rh": d["relative_humidity_2m_mean"][i]})
    return rows


def fetch_nasa_power(rule):
    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = {"parameters": "WS2M,RH2M", "community": "AG", "latitude": rule["lat"], "longitude": rule["lon"], "start": rule["start"].replace("-", ""), "end": rule["end"].replace("-", ""), "format": "JSON"}
    r = requests.get(url, params=params, timeout=60)
    r.raise_for_status()
    p = r.json()["properties"]["parameter"]
    rows = []
    for day in p["WS2M"]:
        rows.append({"date": day[:4] + "-" + day[4:6] + "-" + day[6:], "wind": p["WS2M"][day] * 3.6, "rh": p["RH2M"][day]})
    return rows


if __name__ == "__main__":
    fetchers = {
        "Open-Meteo Forecast + Archive": fetch_open_meteo,
        "NASA POWER daily point": fetch_nasa_power,
    }
    rule = {"lat": 30.9, "lon": 75.85, "start": "2024-11-01", "end": "2024-11-03", "min_rows": 3}
    out = resolve("x_weather", fetchers, rule)
    print(json.dumps(out["meta"], indent=2))
    print(out["data"])
