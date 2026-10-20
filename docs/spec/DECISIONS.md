# Decisions

Decisions made during the build that change or clarify the spec. Newest last.

| Date | Decision | Why |
|---|---|---|
| 2026-10-21 | Build in the new repo FIREWORK_2. The old FIREWORK repo (PyroSentinel, SIH) stays untouched. | The old repo is a different project. |
| 2026-10-21 | Endpoint names follow chapter 9 everywhere: `GET /api/calib/{region}`, `POST /api/studio/upload`, `GET /api/source/{cell}`. The page sections' alternatives (`/api/calibration/{region}`, `/api/uploads`, `/api/sites/{id}`) are not used. | The spec used two names for the same endpoints; chapter 9 is the API contract. |
| 2026-10-21 | The SpaceApps test files are assert scripts; `tests/test_spaceapps_scripts.py` runs each one as a pytest test. Pipeline deps live in `.venv`, pinned in `requirements-pipeline.txt`. | pytest collected 0 tests from the scripts. |
| 2026-10-21 | graphify runs on a scoped corpus (own code, spec, APIs PDF, READMEs, data_sources.json). Vendored bundles, textures, screenshots and duplicate pages are excluded. Run `/graphify . --update` after each batch. | Same graph value at a fraction of the cost. |
