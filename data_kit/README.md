# FIREWORK data kit

What is in this folder and how to use it.

- `data_sources.json` — the source registry. For every formula input (x) it lists the primary source and the backups in order.
- `fx_engine.py` — the resolver. It tries sources in order, skips ones that failed in the last 10 minutes, checks quality, caches the answer and returns `{data, meta}` with the source used.
- `fetch_samples.py` — run on your laptop to save REAL responses into `real_samples/`. Set `FIRMS_MAP_KEY` and `OPENAQ_API_KEY` first.
- `samples/` — what each API returns. Shapes follow the official docs; values are illustrative. Only `geoboundaries_IND_ADM2_REAL.json` is a real response (20 Oct 2026).

## Run

```bash
pip install requests
export FIRMS_MAP_KEY=your_key
export OPENAQ_API_KEY=your_key
python fetch_samples.py
python fx_engine.py
```

## Inputs (x) and sources

### x_fire_points — Active-fire detections (MODIS + VIIRS)
Used by: F01, F02, F03, F05, F06, F07, F08, F13, F20, F21, F44. Unit: rows (one per hot pixel). Changes over time: NRT rows appear within ~3 h; Standard Processing (SP) replaces NRT after ~2-3 months; archive versions (MODIS C6.1, VIIRS 002) can be reprocessed.
1. **FIRMS Area API** — key: FIRMS_MAP_KEY — limit: 5000 transactions / 10 min, 1-5 days per call — recent days, small areas — https://firms.modaps.eosdis.nasa.gov/api/area/
2. **FIRMS archive download (Download Request)** — key: Earthdata login — limit: emailed CSV/SHP, years at once — 2000->today history — https://firms.modaps.eosdis.nasa.gov/download/
3. **LAADS DAAC / earthaccess (MCD14ML, VNP14IMG, VJ114IMG)** — key: Earthdata login — limit: bulk files — raw product files when FIRMS is down — https://ladsweb.modaps.eosdis.nasa.gov/
4. **GEE community catalog FIRMS vectors** — key: Earth Engine project — limit: EE quota — server-side aggregation — https://gee-community-catalog.org/projects/firms_vector/

### x_clear_days — Days each cell was visible (not cloud) - daily FireMask
Used by: F09, F25. Unit: clear cell-days. Changes over time: daily product; fixed after processing; new collection versions rare.
1. **Google Earth Engine MOD14A1 / MYD14A1 / VNP14A1** — key: Earth Engine project — limit: Community tier 150 EECU-h/month — monthly clear-day counts per cell — https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD14A1
2. **Microsoft Planetary Computer modis-14A1-061** — key: none for read — limit: fair use — backup, STAC + COG — https://planetarycomputer.microsoft.com/dataset/modis-14A1-061
3. **NASA AppEEARS area request** — key: Earthdata login — limit: queued jobs — small-area subsets — https://appeears.earthdatacloud.nasa.gov/

### x_burned_area — Burned area per month (blind-spot check)
Used by: F46. Unit: km2 or burned pixels. Changes over time: monthly; available ~2-3 months after the month ends.
1. **GEE MODIS/061/MCD64A1** — key: Earth Engine project — limit: EE quota — monthly burned km2 per district — https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MCD64A1
2. **ORNL DAAC MODIS subsets (MCD64A1)** — key: none — limit: point/small box — backup for single sites — https://modis.ornl.gov/
3. **ESA FireCCI** — key: none — limit: file download — independent cross-check — https://climate.esa.int/en/projects/fire/

### x_land_cover — Cropland / tree / built-up class around a fire
Used by: F08, F42, F43. Unit: class code. Changes over time: static snapshot (WorldCover 2020, 2021); MCD12Q1 yearly.
1. **ESA WorldCover 10 m (GEE)** — key: Earth Engine project — limit: EE quota — cropland share per cell — https://developers.google.com/earth-engine/datasets/catalog/ESA_WorldCover_v200
2. **ESA WorldCover on AWS S3** — key: none — limit: free download — offline backup — https://registry.opendata.aws/esa-worldcover-vito/
3. **MODIS MCD12Q1 yearly land cover** — key: Earth Engine or Earthdata — limit: EE quota — years before 2020 — https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MCD12Q1

### x_industry — Industrial sites, kilns, flares near a fire
Used by: F08, F42, F43. Unit: points/polygons. Changes over time: OSM edited daily by volunteers; flare lists yearly.
1. **OSM Overpass API** — key: none — limit: fair use, ~2 slots per IP — industrial landuse, kilns — https://overpass-api.de/api/interpreter
2. **Overpass mirror (private.coffee / maps.mail.ru)** — key: none — limit: fair use — when main server is busy — https://wiki.openstreetmap.org/wiki/Overpass_API#Public_Overpass_API_instances
3. **Geofabrik India extract (.osm.pbf)** — key: none — limit: daily file — offline, no rate limit — https://download.geofabrik.de/asia/india.html
4. **VIIRS Nightfire / EOG gas flares** — key: free EOG account — limit: file download — flare masks — https://eogdata.mines.edu/products/vnf/

### x_weather — Wind, humidity, rain, temperature for context
Used by: context panels. Unit: hourly/daily values. Changes over time: forecast changes every hour; archive (ERA5) final after ~5 days.
1. **Open-Meteo Forecast + Archive** — key: none (non-commercial) — limit: about 10,000 calls/day non-commercial — fast JSON, no key — https://open-meteo.com/en/docs
2. **NASA POWER daily point** — key: none — limit: fair use — long daily history — https://power.larc.nasa.gov/docs/services/api/
3. **Copernicus CDS ERA5** — key: CDS API key — limit: queued jobs — research-grade grids — https://cds.climate.copernicus.eu

### x_air_quality — PM2.5 near the burning (impact panel)
Used by: impact panel. Unit: ug/m3. Changes over time: hourly; stations go offline; values can be corrected later.
1. **OpenAQ API v3** — key: X-API-Key (free) — limit: 60/min, 2000/hour — ground stations — https://docs.openaq.org
2. **Open-Meteo Air Quality (CAMS model)** — key: none — limit: non-commercial fair use — model values everywhere — https://open-meteo.com/en/docs/air-quality-api
3. **CPCB / WAQI** — key: WAQI token — limit: token quota — India backup — https://aqicn.org/data-platform/token/

### x_orbits — Satellite orbit elements -> overpass times
Used by: F01, F45. Unit: OMM/TLE. Changes over time: updated several times a day; old elements drift - refresh daily.
1. **CelesTrak GP API** — key: none — limit: fair use; cache 2 h+ — JSON elements — https://celestrak.org/NORAD/documentation/gp-data-formats.php
2. **Space-Track** — key: free account — limit: account limits — official backup — https://www.space-track.org
3. **Derive from FIRMS acq_time** — key: none — limit: - — offline estimate — -

### x_boundaries — District / state boundaries for regions and briefs
Used by: F04 (areas), region totals. Unit: GeoJSON polygons. Changes over time: static; new districts appear a few times a year.
1. **geoBoundaries API** — key: none — limit: fair use — ADM1/ADM2 GeoJSON — https://www.geoboundaries.org/api.html
2. **Natural Earth** — key: none — limit: download — light world maps — https://www.naturalearthdata.com
3. **GADM** — key: none (non-commercial) — limit: download — detailed backup — https://gadm.org

### x_ndvi — Vegetation greenness / harvest timing
Used by: season context (F29). Unit: NDVI -1..1. Changes over time: 16-day composites.
1. **GEE MODIS/061/MOD13Q1** — key: Earth Engine project — limit: EE quota — 250 m NDVI — https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD13Q1
2. **ORNL MODIS subsets** — key: none — limit: small areas — backup — https://modis.ornl.gov/
3. **Sentinel-2 via Earth Search STAC** — key: none — limit: fair use — 10 m detail — https://earth-search.aws.element84.com/v1

### x_granule_index — Which product files exist for a date (health + archive)
Used by: pipeline / health page. Unit: file metadata. Changes over time: new granules every orbit.
1. **NASA CMR Search API** — key: none for search — limit: fair use — list files — https://cmr.earthdata.nasa.gov/search/site/docs/search/api.html
2. **earthaccess Python library** — key: Earthdata login — limit: - — search + download in Python — https://earthaccess.readthedocs.io

## Sample files

- `samples/celestrak_gp_noaa20.json`
- `samples/cmr_granules.json`
- `samples/embeddings_openai_compatible.json`
- `samples/firework_api_cell.json`
- `samples/firms_archive_extra_columns.txt`
- `samples/firms_data_availability.csv`
- `samples/firms_mapkey_status.json`
- `samples/firms_modis_area.csv`
- `samples/firms_viirs_area.csv`
- `samples/gee_firemask_classes.json`
- `samples/gee_firemask_month_reduce.json`
- `samples/gee_mcd64a1_district.json`
- `samples/gee_mod13q1_ndvi.json`
- `samples/gee_worldcover_cell.json`
- `samples/gemini_generate_content.json`
- `samples/geoboundaries_IND_ADM2_REAL.json`
- `samples/groq_whisper_transcription.json`
- `samples/llm_chat_openai_compatible.json`
- `samples/nasa_power_daily.json`
- `samples/open_meteo_air_quality.json`
- `samples/open_meteo_archive.json`
- `samples/open_meteo_forecast.json`
- `samples/openaq_locations.json`
- `samples/openaq_measurements.json`
- `samples/overpass_industrial.json`