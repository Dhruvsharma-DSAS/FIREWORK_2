# FIREWORK CHRONOS
NASA Space Apps 2026 - Harmonization of MODIS and VIIRS Hot Spots.
Spec: docs/spec/CLAUDE_BUILD_SPEC.md (+ PDF with images in docs/spec/).

## Stack
frontend/ React 19 + Vite, MapLibre GL, deck.gl, Recharts, d3, three.js (Home hero only)
backend/  FastAPI, SQLModel/SQLAlchemy + GeoAlchemy2, Supabase Postgres + PostGIS
pipeline/ Python: pandas/polars, duckdb, earthengine-api, earthaccess; Parquet on Cloudflare R2
data_kit/ data_sources.json + fx_engine.py (source fallback resolver)

## Rules
- Beginner-readable: React only useState/useEffect/useParams/useNavigate/props/.map/.filter/.find, if/else before return, no ternaries for branching, no comments, no custom hooks, no new packages without asking.
- Full files, not snippets.
- Every API response = {data, meta}; meta.data_source always set; meta.demo drives the DEMO chip.
- Never invent numbers. LLM writes words only.
- Keys only in .env / platform secrets. Never commit .env or data/raw.
- The look must match docs/design (HTML mock-ups + screenshots) exactly. Build the look first with fixture data (M1), then real data.
- Read graphify-out/GRAPH_REPORT.md and DATA_INDEX.json before opening raw files; never load full data into context.
- Work milestone by milestone (spec chapter 12); one branch per milestone; stop after each for review.

## Commands
python:   python3 -m venv .venv && .venv/bin/pip install -r requirements-pipeline.txt
tests:    .venv/bin/pytest
backend:  uvicorn app.main:app --reload
frontend: cd frontend && npm run dev ; npm run build
design:   cd docs/design && python3 -m http.server 8765  (open /preview/hero_photo.html)
pipeline: python -m pipeline.run --region punjab_haryana
