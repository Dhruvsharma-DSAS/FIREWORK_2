# Graph Report - .  (2026-10-21)

## Corpus Check
- Large corpus: 132 files · ~1,209,816 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 457 nodes · 878 edges · 12 communities detected
- Extraction: 79% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 178 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Data Sources & Fallbacks|Data Sources & Fallbacks]]
- [[_COMMUNITY_Accuracy Formulas (Spec)|Accuracy Formulas (Spec)]]
- [[_COMMUNITY_Formulas, Inputs & Deployment|Formulas, Inputs & Deployment]]
- [[_COMMUNITY_Design System & Components|Design System & Components]]
- [[_COMMUNITY_API Endpoints & AI|API Endpoints & AI]]
- [[_COMMUNITY_Project Rules|Project Rules]]
- [[_COMMUNITY_Harmonize Code|Harmonize Code]]
- [[_COMMUNITY_Design Reference Files|Design Reference Files]]
- [[_COMMUNITY_Source Resolver (fx_engine)|Source Resolver (fx_engine)]]
- [[_COMMUNITY_Home Hero Earth Scene|Home Hero Earth Scene]]
- [[_COMMUNITY_Fusion & Clustering Formulas|Fusion & Clustering Formulas]]
- [[_COMMUNITY_FIRMS Fetcher|FIRMS Fetcher]]

## God Nodes (most connected - your core abstractions)
1. `FIREWORK CHRONOS` - 34 edges
2. `M4 Science` - 33 edges
3. `{data, meta} response envelope` - 30 edges
4. `Mission Atlas design system` - 27 edges
5. `FIREWORK APIs, Keys and Datasets (Doc 2 of 2)` - 22 edges
6. `M1 Exact look (fixture data)` - 19 edges
7. `fx_engine.resolve()` - 18 edges
8. `Page C Historical Fire Calendar (/calendar/:region)` - 15 edges
9. `FIREWORK design reference README` - 15 edges
10. `samples/ (25 API response examples)` - 15 edges

## Surprising Connections (you probably didn't know these)
- `harmonize.mann_kendall()` --implements--> `F31 Hamed-Rao autocorrelation correction`  [INFERRED]
  pipeline/harmonize.py → docs/spec/CLAUDE_BUILD_SPEC.md
- `services/resolver.py (source fallback resolver)` --calls--> `fx_engine.resolve()`  [EXTRACTED]
  docs/spec/CLAUDE_BUILD_SPEC.md → data_kit/fx_engine.py
- `fx_engine.resolve()` --implements--> `Remember source failure for 10 minutes`  [EXTRACTED]
  data_kit/fx_engine.py → docs/spec/FIREWORK_APIs_Keys_Datasets.pdf
- `fx_engine.resolve()` --implements--> `When a source fails: failure drill table`  [INFERRED]
  data_kit/fx_engine.py → docs/spec/FIREWORK_APIs_Keys_Datasets.pdf
- `M2 Data engine` --references--> `health_check.run_checks()`  [EXTRACTED]
  docs/spec/CLAUDE_BUILD_SPEC.md → pipeline/health_check.py

## Hyperedges (group relationships)
- **Cross-sensor calibration and harmonisation chain** — claude_build_spec_f10_monthly_overlap_ratio, claude_build_spec_f11_median_of_ratios, claude_build_spec_f14_poisson_glm_with_exposure_offset, claude_build_spec_f18_empirical_bayes_shrinkage_of_log_k, claude_build_spec_f12_harmonised_modis_value, claude_build_spec_f24_block_bootstrap_over_years, claude_build_spec_f25_monte_carlo_error_propagation [EXTRACTED 0.90]
- **Blind-spot detection flow** — claude_build_spec_f45_diurnal_fraction_seen_by_overpasses, claude_build_spec_f46_blind_spot_ratio_b, claude_build_spec_x_burned_area, claude_build_spec_x_orbits, claude_build_spec_page_i, claude_build_spec_punjab_haryana_story [INFERRED 0.85]
- **Data provenance and honesty system** — claude_build_spec_api_envelope, claude_build_spec_status_chips, claude_build_spec_resolver_py, claude_build_spec_ep_get_api_health, claude_build_spec_page_m, claude_build_spec_rule_data_honesty [INFERRED 0.85]
- **Resolver fallback flow: registry -> resolve -> quality check -> {data, meta}** — data_sources_registry, fx_engine_resolve, data_sources_health_quality_check, data_sources_failure_memory_10min, data_sources_data_meta_contract [EXTRACTED 1.00]
- **x_fire_points fallback chain** — data_sources_x_fire_points, data_sources_firms_area_api, data_sources_firms_archive_download, data_sources_laads_daac_earthaccess, data_sources_gee_firms_vectors [EXTRACTED 1.00]
- **Home hero 3D stack** — design_hero_photo, design_earth3d_js, design_three_module, design_tex [EXTRACTED 1.00]

## Communities

### Community 0 - "Data Sources & Fallbacks"
Cohesion: 0.04
Nodes (101): Stack: React 19+Vite, FastAPI, Supabase PostGIS, Python pipeline, Parquet on R2, FIREWORK data kit README, samples/ (25 API response examples), NASA AppEEARS area request, Blind-spot warning, Air quality: 1 h, flag stale stations, Fire points NRT: cache 1 h, store version column, Fire archive SP: refresh monthly, keep checksums (+93 more)

### Community 1 - "Accuracy Formulas (Spec)"
Cohesion: 0.07
Nodes (44): GET /api/validation/{region}, F10 Monthly overlap ratio, F11 Median of ratios, F12 Harmonised MODIS value, F13 Separate day and night factors, F14 Poisson GLM with exposure offset, F15 Negative-binomial variance, F16 Delta-method CI for a ratio (+36 more)

### Community 2 - "Formulas, Inputs & Deployment"
Cohesion: 0.07
Nodes (52): data_sources.json (input registry), Deployment: Cloudflare Pages + HF Spaces/Render + Supabase + R2, GET /api/lineage/{value_id}, F01 Local solar time of an overpass, F02 Pixel growth with scan angle, F03 Grid cell index, F04 Area of a grid cell on the sphere, F05 Fire cell-day indicator (+44 more)

### Community 3 - "Design System & Components"
Cohesion: 0.06
Nodes (53): atlas.css shared stylesheet, Responsive breakpoints, MODIS blue / VIIRS orange colour rule, Component CalendarGrid, Component CellInspector, Component DemoBanner, Component EarthHero, Component EmptyState (+45 more)

### Community 4 - "API Endpoints & AI"
Cohesion: 0.05
Nodes (52): services/ai_router.py (Groq->OpenRouter->Gemini->GitHub Models->template), {data, meta} response envelope, Ask helper (RAG + tools), GET /api/blindspot/{region}, GET /api/brief/{region}, GET /api/calendar/{region}, GET /api/calib/{region}, GET /api/calibration/{region} (+44 more)

### Community 5 - "Project Rules"
Cohesion: 0.09
Nodes (27): Beginner-readable React rules (no ternaries, no custom hooks, no comments), Full files, not snippets, Read graphify-out/GRAPH_REPORT.md and DATA_INDEX.json before raw files, Look must match docs/design exactly; fixture data first (M1), Milestone-by-milestone, one branch each, stop for review, Never invent numbers; LLM writes words only, CLAUDE.md project rules, real_samples/ folder (+19 more)

### Community 6 - "Harmonize Code"
Cohesion: 0.15
Nodes (2): cell_id(), to_cell_days()

### Community 8 - "Design Reference Files"
Cohesion: 0.24
Nodes (13): atlas.css (design tokens + components), earth3d.js realistic Home hero (three.js), fonts/ (Fraunces, Inter, JetBrains Mono, Space Grotesk, Caveat), head.html shared head, hero_photo.html (Home page), kit.js (d3 globe/region/chart helpers), preview/*.html ready-to-open pages, FIREWORK design reference README (+5 more)

### Community 9 - "Source Resolver (fx_engine)"
Cohesion: 0.43
Nodes (4): is_healthy(), mark(), passes_quality(), resolve()

### Community 10 - "Home Hero Earth Scene"
Cohesion: 0.48
Nodes (5): buildSatellite(), foilTexture(), llToVec(), panelTexture(), scene()

### Community 11 - "Fusion & Clustering Formulas"
Cohesion: 0.33
Nodes (5): F38 Kalman fusion of two sensors, F39 Split conformal prediction, F40 Haversine distance, F41 DBSCAN fire clustering, Formula family: fusion ai

### Community 14 - "FIRMS Fetcher"
Cohesion: 1.0
Nodes (2): fetch_chunk(), fetch_range()

## Ambiguous Edges - Review These
- `GET /api/calib/{region}` → `GET /api/calibration/{region}`  [AMBIGUOUS]
  docs/spec/CLAUDE_BUILD_SPEC.md · relation: semantically_similar_to
- `GET /api/source/{cell}` → `GET /api/sites/{id}`  [AMBIGUOUS]
  docs/spec/CLAUDE_BUILD_SPEC.md · relation: semantically_similar_to
- `POST /api/studio/upload` → `POST /api/uploads`  [AMBIGUOUS]
  docs/spec/CLAUDE_BUILD_SPEC.md · relation: semantically_similar_to

## Knowledge Gaps
- **34 isolated node(s):** `VIIRS-equivalent fire cell-days (unit)`, `Judging criteria (Influence, Creativity, Validity, Relevance, Presentation)`, `Competitor: FireCal`, `Competitor: Kiln Watch`, `Google Antigravity (backup IDE)` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Harmonize Code`** (14 nodes): `cell_id()`, `harmonise_modis()`, `l_context()`, `mann_kendall()`, `monthly_counts()`, `normalise_firms()`, `overlap_ratio()`, `persistence()`, `harmonize.py`, `robust_z()`, `seam_ratio()`, `sen_slope()`, `shrink_ratio()`, `to_cell_days()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `FIRMS Fetcher`** (3 nodes): `fetch_chunk()`, `fetch_range()`, `fetch_firms.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `GET /api/calib/{region}` and `GET /api/calibration/{region}`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `GET /api/source/{cell}` and `GET /api/sites/{id}`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `POST /api/studio/upload` and `POST /api/uploads`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `services/resolver.py (source fallback resolver)` connect `Formulas, Inputs & Deployment` to `Data Sources & Fallbacks`, `API Endpoints & AI`?**
  _High betweenness centrality (0.333) - this node is a cross-community bridge._
- **Why does `fx_engine.resolve()` connect `Data Sources & Fallbacks` to `Formulas, Inputs & Deployment`?**
  _High betweenness centrality (0.332) - this node is a cross-community bridge._
- **Why does `{data, meta} response envelope` connect `API Endpoints & AI` to `Accuracy Formulas (Spec)`, `Formulas, Inputs & Deployment`, `Design System & Components`?**
  _High betweenness centrality (0.156) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `FIREWORK CHRONOS` (e.g. with `Competitor: FireCal` and `Competitor: Kiln Watch`) actually correct?**
  _`FIREWORK CHRONOS` has 2 INFERRED edges - model-reasoned connections that need verification._