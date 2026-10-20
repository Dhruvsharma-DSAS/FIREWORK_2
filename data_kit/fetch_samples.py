import os
import json
import requests

OUT = "real_samples"
os.makedirs(OUT, exist_ok=True)

FIRMS_KEY = os.environ.get("FIRMS_MAP_KEY", "")
OPENAQ_KEY = os.environ.get("OPENAQ_API_KEY", "")

CALLS = [
    ["open_meteo_forecast.json", "https://api.open-meteo.com/v1/forecast?latitude=30.9&longitude=75.85&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&forecast_days=1", {}],
    ["open_meteo_archive.json", "https://archive-api.open-meteo.com/v1/archive?latitude=30.9&longitude=75.85&start_date=2024-11-01&end_date=2024-11-02&daily=temperature_2m_max,precipitation_sum,wind_speed_10m_max&timezone=Asia/Kolkata", {}],
    ["open_meteo_air_quality.json", "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=30.9&longitude=75.85&hourly=pm2_5,pm10,carbon_monoxide&forecast_days=1", {}],
    ["nasa_power_daily.json", "https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,RH2M,WS2M,PRECTOTCORR&community=AG&longitude=75.85&latitude=30.9&start=20241101&end=20241103&format=JSON", {}],
    ["celestrak_gp_noaa20.json", "https://celestrak.org/NORAD/elements/gp.php?CATNR=43013&FORMAT=json", {}],
    ["geoboundaries_IND_ADM2.json", "https://www.geoboundaries.org/api/current/gbOpen/IND/ADM2/", {}],
    ["cmr_granules.json", "https://cmr.earthdata.nasa.gov/search/granules.json?short_name=VNP14IMG&temporal=2024-11-12T00:00:00Z,2024-11-12T23:59:59Z&bounding_box=73,29,77,32&page_size=3", {}],
]

if FIRMS_KEY != "":
    CALLS.append(["firms_viirs_area.csv", "https://firms.modaps.eosdis.nasa.gov/api/area/csv/" + FIRMS_KEY + "/VIIRS_NOAA20_NRT/73,29,77,32/2", {}])
    CALLS.append(["firms_mapkey_status.json", "https://firms.modaps.eosdis.nasa.gov/mapserver/mapkey_status/?MAP_KEY=" + FIRMS_KEY, {}])
    CALLS.append(["firms_data_availability.csv", "https://firms.modaps.eosdis.nasa.gov/api/data_availability/csv/" + FIRMS_KEY + "/all", {}])
else:
    print("skip FIRMS: set FIRMS_MAP_KEY")

if OPENAQ_KEY != "":
    CALLS.append(["openaq_locations.json", "https://api.openaq.org/v3/locations?coordinates=30.9,75.85&radius=25000&limit=5", {"X-API-Key": OPENAQ_KEY}])
else:
    print("skip OpenAQ: set OPENAQ_API_KEY")

query = '[out:json][timeout:60];(way["landuse"="industrial"](30.7,75.6,31.1,76.1);node["man_made"="kiln"](30.7,75.6,31.1,76.1););out center tags 20;'

for item in CALLS:
    name = item[0]
    url = item[1]
    headers = item[2]
    try:
        r = requests.get(url, headers=headers, timeout=60)
        open(OUT + "/" + name, "w", encoding="utf-8").write(r.text)
        print(r.status_code, name, len(r.text), "bytes")
    except Exception as e:
        print("FAILED", name, e)

try:
    r = requests.post("https://overpass-api.de/api/interpreter", data={"data": query}, timeout=90)
    open(OUT + "/overpass_industrial.json", "w", encoding="utf-8").write(r.text)
    print(r.status_code, "overpass_industrial.json", len(r.text), "bytes")
except Exception as e:
    print("FAILED overpass", e)
