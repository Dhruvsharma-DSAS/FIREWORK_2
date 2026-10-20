# FIREWORK CHRONOS

NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots.

One calibrated burning calendar from 25 years of MODIS and VIIRS fire detections, on a single scale (VIIRS-equivalent fire cell-days), with an uncertainty band on every value, a fire-source label, and a blind-spot warning where satellites probably missed burning.

## Status

Milestone M0 (setup) done. No page shows real results yet. Every number in the design mock-ups is a demo value.

## Layout

| Folder | What |
|---|---|
| docs/spec | build spec (PDF + text copy), APIs and datasets PDF |
| docs/design | exact-look HTML/CSS mock-ups, screenshots, fonts |
| data_kit | source registry, fallback resolver, sample API responses |
| pipeline | harmonisation, calendar and accuracy code |
| tests | pytest suite for the pipeline |
| backend | FastAPI app (from M2) |
| frontend | React + Vite site; Home hero kit in public/hero |

## Run

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements-pipeline.txt
.venv/bin/pytest
cd frontend && npm install && npm run build
```

API keys go in `.env` (copy `.env.example`). Never commit `.env`.
