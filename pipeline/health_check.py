import os
import httpx

CHECKS = [
    ("FIRMS area API", "https://firms.modaps.eosdis.nasa.gov/api/area/", None),
    ("NASA CMR", "https://cmr.earthdata.nasa.gov/search/collections.json?short_name=MOD14A1&version=061", None),
    ("ORNL MODIS subsets", "https://modis.ornl.gov/rst/api/v1/products", None),
    ("Planetary Computer STAC", "https://planetarycomputer.microsoft.com/api/stac/v1/collections/modis-14A1-061", None),
    ("Earth Search STAC", "https://earth-search.aws.element84.com/v1/collections", None),
    ("Open-Meteo archive", "https://archive-api.open-meteo.com/v1/archive?latitude=30.7&longitude=75.8&start_date=2024-11-01&end_date=2024-11-01&hourly=temperature_2m&timezone=UTC", None),
    ("NASA POWER", "https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M&community=AG&longitude=75.8&latitude=30.7&start=20241101&end=20241101&format=JSON", None),
    ("Overpass main", "https://overpass-api.de/api/status", None),
    ("Overpass private.coffee", "https://overpass.private.coffee/api/status", None),
    ("Overpass VK", "https://maps.mail.ru/osm/tools/overpass/api/status", None),
    ("geoBoundaries", "https://www.geoboundaries.org/api/current/gbOpen/IND/ADM1/", None),
    ("NASA GIBS", "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml", None),
    ("CelesTrak", "https://celestrak.org/NORAD/elements/gp.php?CATNR=37849&FORMAT=TLE", None),
    ("OpenAQ v3", "https://api.openaq.org/v3/locations?limit=1", "OPENAQ_API_KEY"),
]


def run_checks():
    results = []
    for name, url, key_env in CHECKS:
        headers = {"User-Agent": "FIREWORK-healthcheck/1.0"}
        if key_env is not None:
            key = os.environ.get(key_env, "")
            if key == "":
                results.append((name, "SKIP (no " + key_env + ")"))
                continue
            headers["X-API-Key"] = key
        try:
            response = httpx.get(url, headers=headers, timeout=20, follow_redirects=True)
            if response.status_code < 400:
                results.append((name, "OK " + str(response.status_code)))
            else:
                results.append((name, "FAIL " + str(response.status_code)))
        except httpx.HTTPError as exc:
            results.append((name, "FAIL " + type(exc).__name__))
    return results


if __name__ == "__main__":
    for name, status in run_checks():
        print(name.ljust(26), status)
