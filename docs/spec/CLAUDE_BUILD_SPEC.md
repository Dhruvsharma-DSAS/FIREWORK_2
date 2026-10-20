# FIREWORK CHRONOS — Claude Code Build Spec (text copy)

Plain-text extraction of docs/spec/FIREWORK_Claude_Code_Build_Spec.pdf for fast search. Tables and equations lose formatting here; open the PDF for images and exact layout.


<!-- page 1 -->

FIREWORK CHRONOS · FOR CLAUDE CODE
Claude Code
Build Spec
Everything needed to build the website exactly as designed: rules, design reference,
memory setup, data sources, APIs, 46 formulas, page-by-page specs with images,
API contract, database schema and milestones.
Dhruv Sharma and team · 20 October 2026
Free tiers change often — each limit carries the date it was checked.


<!-- page 2 -->

Contents
1
How to use this document with Claude Code
5
1.1
Files to put in the repository before starting . . . . . . . . . . . . . . . . . . . . . . . . . . .
5
1.2
What you must provide (Claude Code cannot do these) . . . . . . . . . . . . . . . . . . . . .
5
1.3
Prompt to paste into Claude Code . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
6
2
What we are building and why
7
2.1
The project in one paragraph . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
7
2.2
Why now . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
7
2.3
Local story: Punjab and Haryana
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
7
2.4
Judging criteria (equal weight) and how we answer them
. . . . . . . . . . . . . . . . . . .
7
2.5
Competitors (self-reported, unreviewed) . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
8
3
Rules Claude Code must follow
9
3.1
Code style (the team’s preference) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
9
3.2
Data honesty . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
9
3.3
Security and git
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
9
3.4
Starter CLAUDE.md . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
9
4
Exact look first: the design reference is the ground truth
11
4.1
How Claude Code checks it matches . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
11
4.2
Page →reference file
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
11
4.3
Shared stylesheet (atlas.css) — copy exactly
. . . . . . . . . . . . . . . . . . . . . . . . . . .
12
5
Keeping the AI’s memory small and correct: graphify, data index, Antigravity
14
5.1
graphify: a knowledge graph of the whole repository . . . . . . . . . . . . . . . . . . . . . .
14
5.2
DATA_INDEX.json: one file that describes all data . . . . . . . . . . . . . . . . . . . . . . . .
14
5.3
Files the AI reads first (in this order)
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
15
5.4
If Claude Code is stuck or out of limit: Google Antigravity . . . . . . . . . . . . . . . . . . .
15
6
Repository, folders and technology
16
6.1
What already exists (FIREWORK repo)
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
16
6.2
Target folder structure
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
16
6.3
Approved technology (all free) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
16
7
Data sources, keys, pipeline and database
18
7.1
Environment variables (.env.example)
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
18
7.2
Where to get the keys . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
18
7.3
Formula inputs (x) and their sources, in fallback order . . . . . . . . . . . . . . . . . . . . .
18


<!-- page 3 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
Contents
7.4
What the main APIs return . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
19
7.5
Pipeline (pipeline/run.py)
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
20
7.6
Database schema (Supabase / Neon, PostGIS)
. . . . . . . . . . . . . . . . . . . . . . . . . .
20
8
All 46 formulas to implement
22
8.1
Time, space and counting . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
22
8.2
Calibration between sensors . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
22
8.3
Uncertainty . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
23
8.4
Anomalies and seasons . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
23
8.5
Trends and seam tests . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
23
8.6
Fusion and AI . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
24
8.7
Source attribution and blind spot . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
24
9
Backend API contract
26
10 Design system and the 13 pages
27
10.1 Design tokens (frontend/src/styles/tokens.css) . . . . . . . . . . . . . . . . . . . . . . . . . .
27
10.2 Page A · Cinematic Homepage (/)
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
29
10.3 Page B · Earth Explorer (Globe Workspace) (/explore) . . . . . . . . . . . . . . . . . . . . . .
32
10.4 Page C · Historical Fire Calendar (/calendar/:region)
. . . . . . . . . . . . . . . . . . . . . .
35
10.5 Page D · Satellite Comparison Lab (/sensors) . . . . . . . . . . . . . . . . . . . . . . . . . . .
37
10.6 Page E · User Data Studio (/studio) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
39
10.7 Page F · Scientific Formula Explorer (/formulas/:id) . . . . . . . . . . . . . . . . . . . . . . .
42
10.8 Page G · Accuracy & Validation Dashboard (/validation)
. . . . . . . . . . . . . . . . . . . .
44
10.9 Page H · Fire Source Intelligence (/sources) . . . . . . . . . . . . . . . . . . . . . . . . . . . .
46
10.10Page I · Blind Spot Observatory (/blind-spot) . . . . . . . . . . . . . . . . . . . . . . . . . . .
48
10.11Page J · Research & Education Center (/learn)
. . . . . . . . . . . . . . . . . . . . . . . . . .
50
10.12Page K · Personalized Workspace (/me) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
52
10.13Page L · Impact & Decision Briefing (/brief/:id) . . . . . . . . . . . . . . . . . . . . . . . . . .
54
10.14Page M · Data Sources & System Health (/sources/health) . . . . . . . . . . . . . . . . . . . .
56
11 AI features: router, RAG and tools
58
11.1 AI router (backend/app/services/ai_router.py) . . . . . . . . . . . . . . . . . . . . . . . . . .
58
11.2 RAG (backend/app/services/rag.py) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
58
11.3 Voice (optional)
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
58
12 Milestones for Claude Code, with done-when checks
59
12.1 M0 Setup
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
59
12.2 M1 Exact look (all pages, fixture data) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
59
12.3 M2 Data engine . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
59
12.4 M3 Pipeline . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
60
12.5 M4 Science . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
60
12.6 M5 API . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
60
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
3


<!-- page 4 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
Contents
12.7 M6 Connect pages to real data . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
60
12.8 M7 Studio + AI
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
60
12.9 M8 Ship . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
61
13 Testing, deployment, open items
62
13.1 Testing
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
62
13.2 Deployment
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
62
13.3 Open items (decide or provide)
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
62
13.4 Related documents
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
62
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
4


<!-- page 5 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
1 How to use this document with Claude Code
START HERE
1
How to use this document with
Claude Code
This single document is the full build specification for the FIREWORK CHRONOS website, backend, data
pipeline and AI features for NASA Space Apps 2026 (challenge: Harmonization of MODIS and VIIRS Hot
Spots). It collects the research, data sources, APIs, formulas, page designs with images, API contracts,
database schema, build order and rules from all earlier documents. Give it to Claude Code together with
the files listed below, and Claude Code has everything except your keys and your data files.
1.1 Files to put in the repository before starting
FILE
WHERE TO PUT IT
WHY
This PDF (and CLAUDE_BUILD_
SPEC.md)
docs/spec/
the specification Claude Code follows
CLAUDE.md (section 'Starter
CLAUDE.md' below)
repository root
Claude Code reads it automatically in every
session
FIREWORK_data_kit.zip (unzipped)
data_kit/
data_sources.json, fx_engine.py, make_data_
index.py, sample API responses
SpaceApps_code.zip (unzipped)
pipeline/ and tests/
tested harmonisation and accuracy code
Home_hero_kit.zip (unzipped)
frontend/public/hero/
three.js Earth scene, textures
FIREWORK_design_reference.zip (
unzipped)
docs/design/
EXACT look: HTML/CSS mock-ups of every
page, tokens, fonts, screenshots
.env (you create it, never commit)
repository root
your API keys
1.2 What you must provide (Claude Code cannot do
these)
1. API keys and accounts: NASA Earthdata, FIRMS MAP_KEY, Google Earth Engine noncommercial
project, OpenAQ key, Supabase project URL and keys, Groq / OpenRouter / Gemini keys (see chapter
7).
2. The FIRMS archive download for India (MODIS 2000→, VIIRS 2012→), requested from the FIRMS
download page and saved as CSV in data/raw/.
3. Earth Engine authentication on your machine (earthengine authenticate) — this needs your Google
login.
4. Decisions marked OPEN in chapter 13 (2026 rules on pre-built code, final region list).
5. Review of every number before the demo: nothing synthetic may be shown as a result.
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
5


<!-- page 6 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
1 How to use this document with Claude Code
1.3 Prompt to paste into Claude Code
Read CLAUDE.md, docs/spec/CLAUDE_BUILD_SPEC.md (and the PDF in docs/spec/ for images) and docs/d
esign/README.md.
Work milestone by milestone from chapter 12 (M0 to M8). Build the exact look first (M1) from doc
s/design, then the data. For each milestone:
1. Restate the tasks and the 'done when' checks.
2. Implement them, following the rules in chapter 3 exactly. Pages must match docs/design/previe
w/*.html and screenshots/*.jpg exactly.
3. Run the tests and show me the result.
4. Stop and wait for my OK before the next milestone.
Never invent data. If a key or data file is missing, stop and tell me which one.
Which Claude model to choose in Claude Code
Use the most capable Opus model your plan offers (switch with /model) for planning, the exact-look
pages (M1), the pipeline and the science (M2–M4): these need careful reading of the spec and images. A
Sonnet model is fine for routine follow-ups (small UI fixes, tests, docs) and uses less of your limit. Turn on
extended thinking or plan mode for each milestone, and ask Claude Code to show a plan before editing.
Tip
Claude Code reads PDFs in parts (about 20 pages at a time) and sees the images. The Markdown copy
(CLAUDE_BUILD_SPEC.md) has the same text and is faster for it to search, so keep both in docs/spec/.
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
6


<!-- page 7 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
2 What we are building and why
BRIEF
2
What we are building and why
2.1 The project in one paragraph
FIREWORK CHRONOS turns 25 years of satellite fire detections from two instrument families — MODIS
(Terra 2000→, Aqua 2002→) and VIIRS (Suomi NPP 2012→, NOAA-20 2018→, NOAA-21 2023→) — into
one calibrated burning calendar on a single scale (VIIRS-equivalent fire cell-days), with an uncertainty
band on every value, a label for the type of fire source, and a warning where satellites probably missed
burning. Users can explore it on a globe, read a month-by-year calendar, check every formula, and
upload their own data to compare.
2.2 Why now
FACT
DATE
SOURCE
Suomi NPP observations stop
2 Nov 2026
NASA Earthdata alert
Terra MODIS data collection ends
Jan 2027
CAMS / LAADS
Aqua MODIS ends
∼Sep 2027
CAMS / LAADS
Challenge statements + datasets released
28 Oct 2026
Space Apps
Hackathon
14–15 Nov 2026
Space Apps
Judging starts
16 Nov 2026
Space Apps
2.3 Local story: Punjab and Haryana
iFOREST’s 2025 report says more than 90% of large Punjab farm fires in 2024–25 happened after 3 PM
(about 3% in 2021), and burnt area fell much more slowly (about 31,447 km2 in 2022 to about 20,000 km2
in 2025) than fire counts. Satellites pass at about 10:30 and 13:30 local time, so late burning is missed. A
count-only calendar would wrongly say burning collapsed; our blind-spot flag (F45, F46) exists for this.
2.4 Judging criteria (equal weight) and how we an-
swer them
CRITERION
OUR EVIDENCE
PAGE
Influence
Punjab–Haryana air-quality story, one-page briefs for officials
Home, Brief (L)
Creativity
blind-spot flag, source attribution, user data studio
I, H, E
Validity
tested formulas, leave-one-year-out, seam test, honest bands
G, F
Relevance
harmonised 2000→calendar is the core ask
C
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
7


<!-- page 8 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
2 What we are building and why
CRITERION
OUR EVIDENCE
PAGE
Presentation
2-minute demo, clean UI, realistic Home hero
A, video
2.5 Competitors (self-reported, unreviewed)
REPO
WHAT IT DOES
OUR GAP
FireCal
global 0.1◦cell-days, per-area monthly ratio, LOYO
validation
no industrial separation, no diurnal bias, no
burned-area check
Kiln Watch
Bangladesh, cloud-normalised cell-days with 95%
bands, seam test
one country, weak source classifier
Chronofire /
TerraHarmonia
plans / early stage
not built
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
8


<!-- page 9 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
3 Rules Claude Code must follow
RULES
3
Rules Claude Code must follow
3.1 Code style (the team's preference)
• Beginner-readable code. React: only useState, useEffect, useParams, useNavigate, props, .map(),
.filter(), .find() and if/else blocks.
• No custom hooks, no ternaries for major branching (use if/else before return), no comments in code,
no heavy abstractions.
• No new npm/pip packages without asking first. The approved list is in chapter 6.
• Always output full files, not snippets.
• Python: plain functions, if/else, loops; type hints welcome; pandas/polars allowed.
3.2 Data honesty
• Never invent, hard-code or ’example’ a number in the UI. Every number comes from the API.
• Every API response is {data, meta}. meta has data_source, version, generated_at, units, demo.
• If meta.demo is true the UI shows a DEMO chip. Synthetic numbers are never presented as results.
• If a source fails, show CACHED or ’unavailable’ — never zero.
• The LLM may write sentences but never numbers; numbers are inserted from the API JSON.
3.3 Security and git
• Keys only in .env (local) and platform secrets. .env is in .gitignore. The browser never sees a key.
• Do not commit data/raw or large files; use Cloudflare R2 for Parquet.
• Never push to main without the user’s OK; one branch per milestone.
• Validate every upload (size ≤25 MB, type allow-list); never execute uploaded content.
3.4 Starter CLAUDE.md
# FIREWORK CHRONOS
NASA Space Apps 2026 - Harmonization of MODIS and VIIRS Hot Spots.
Spec: docs/spec/CLAUDE_BUILD_SPEC.md (+ PDF with images).
Ɖ## Stack
frontend/ React 19 + Vite, MapLibre GL, deck.gl, Recharts, d3, three.js (Home hero only)
backend/
FastAPI, SQLModel/SQLAlchemy + GeoAlchemy2, Supabase Postgres + PostGIS
pipeline/ Python: pandas/polars, duckdb, earthengine-api, earthaccess; Parquet on Cloudflare R2
data_kit/ data_sources.json + fx_engine.py (source fallback resolver)
Ɖ## Rules
- Beginner-readable: React only useState/useEffect/useParams/useNavigate/props/.map/.filter/.fin
d, if/else before return, no ternaries for branching, no comments, no custom hooks, no new p
ackages without asking.
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
9


<!-- page 10 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
3 Rules Claude Code must follow
- Full files, not snippets.
- Every API response = {data, meta}; meta.data_source always set; meta.demo drives the DEMO chip
.
- Never invent numbers. LLM writes words only.
- Keys only in .env / platform secrets. Never commit .env or data/raw.
- The look must match docs/design (HTML mock-ups + screenshots) exactly. Build the look first wi
th fixture data (M1), then real data.
- Read graphify-out/GRAPH_REPORT.md and DATA_INDEX.json before opening raw files; never load ful
l data into context.
- Work milestone by milestone (spec chapter 12); stop after each for review.
Ɖ## Commands
backend:
uvicorn app.main:app --reload ; pytest
frontend: npm run dev ; npm run build
pipeline: python -m pipeline.run --region punjab_haryana
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
10


<!-- page 11 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
4 Exact look first: the design reference is the ground truth
DESIGN
4
Exact look first: the design refer-
ence is the ground truth
The website must look exactly like the mock-ups in this document — same layout, spacing, colours,
fonts, panels, chips and globe style. The mock-ups were built as real HTML/CSS pages, so nothing has to
be guessed: FIREWORK_design_reference.zip contains the source of every page (preview/*.html), the
shared stylesheet atlas.css with every token and component class, the fonts, and a screenshot of each
page. Claude Code must open these files and rebuild each page in React with the same structure.
Build order follows your wish: the full website look comes first. In milestone M1 every page is built
pixel-faithfully using fixture JSON (copied from the mock-up values and marked demo:true, so the
DEMO chip shows). Real data replaces the fixtures later, page by page, without changing the look.
4.1 How Claude Code checks it matches
1. Serve docs/design (python3 -m http.server 8765) and open preview/<page>.html.
2. Build the React page with the same class names from atlas.css (copy atlas.css into frontend/sr-
c/styles/).
3. Take a Playwright screenshot of the React page at 1600 × 1000 and compare it with screen-
shots/<page>.jpg.
4. Differences may only be data values; fix any layout, spacing, colour or font difference.
5. Mobile pages: compare at 390 px width with m_*.jpg.
4.2 Page →reference file
PAGE
ROUTE
REFERENCE HTML
SCREENSHOT
A Home (use v2)
/
preview/hero_photo.html
screenshots/hero_photo.jpg
B Explorer
/explore
preview/explorer.html
screenshots/explorer.jpg
C Calendar
/calendar/:region
preview/calendar.html
screenshots/calendar.jpg
D Sensor Lab
/sensors
preview/sensorlab.html
screenshots/sensorlab.jpg
E Data Studio
/studio
preview/studio.html
screenshots/studio.jpg
F Formula Lab
/formulas/:id
preview/formulas.html
screenshots/formulas.jpg
G Validation
/validation
preview/validation.html
screenshots/validation.jpg
H Source
/sources
preview/source.html
screenshots/source.jpg
I Blind Spot
/blind-spot
preview/blindspot.html
screenshots/blindspot.jpg
J Learn
/learn
preview/learn.html
screenshots/learn.jpg
K Workspace
/me
preview/workspace.html
screenshots/workspace.jpg
L Brief
/brief/:id
preview/brief.html
screenshots/brief.jpg
M Health
/sources/health
preview/health.html
screenshots/health.jpg
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
11


<!-- page 12 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
4 Exact look first: the design reference is the ground truth
PAGE
ROUTE
REFERENCE HTML
SCREENSHOT
Mobile
all
preview/m_*.html
screenshots/m_*.jpg
4.3 Shared stylesheet (atlas.css) — copy exactly
:root {
--space: #060A13;
--ink: #0A1020;
--panel: rgba(16, 24, 44, 0.74);
--panel-solid: #111A2E;
--line: rgba(150, 180, 255, 0.14);
--line-strong: rgba(150, 180, 255, 0.28);
--text: #EEF2FA;
--dim: #9AA6BD;
--faint: #67728A;
--ember: #FF6A3D;
--flame: #FFB547;
--sky: #49C7F5;
--modis: #8FB8FF;
--viirs: #FF8A3D;
--mint: #3DDC97;
--rose: #FF4D6D;
--violet: #9B8CFF;
--paper: #F5F1E8;
--paper-ink: #1B2233;
--paper-line: #DCD3C2;
--r-lg: 18px;
--r-md: 12px;
--r-sm: 8px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--space); color: var(--text); font-family: "Inter", sans-serif; -we
bkit-font-smoothing: antialiased; }
body.paper { background: var(--paper); color: var(--paper-ink); }
.mono { font-family: "JB", monospace; }
.caps { font-family: "SG", sans-serif; text-transform: uppercase; letter-spacing: 0.14em; font-s
ize: 11px; font-weight: 700; }
.display { font-family: "Fraunces", serif; font-weight: 600; letter-spacing: -0.01em; }
.dim { color: var(--dim); }
.faint { color: var(--faint); }
.app { width: 1600px; height: 1000px; position: relative; overflow: hidden; background: radial-g
radient(1200px 800px at 70% 40%, #0F1A33 0%, var(--space) 60%); }
.topbar { position: absolute; left: 0; right: 0; top: 0; height: 64px; display: flex; align-item
s: center; padding: 0 24px; gap: 28px; border-bottom: 1px solid var(--line); background: rgb
a(6, 10, 19, 0.6); backdrop-filter: blur(10px); z-index: 10; }
.brand { display: flex; align-items: center; gap: 12px; font-weight: 800; letter-spacing: 0.02em
; }
.brand small { display: block; font-family: "SG"; font-size: 10px; letter-spacing: 0.22em; color
: var(--dim); font-weight: 500; }
.nav { display: flex; gap: 22px; font-size: 13.5px; color: var(--dim); }
.nav .on { color: var(--text); position: relative; }
.nav .onƉ::after { content: ""; position: absolute; left: 0; right: 0; bottom: -22px; height: 2px
; background: var(--ember); border-radius: 2px; }
.spacer { flex: 1; }
.chip { display: inline-flex; align-items: center; gap: 6px; font-family: "SG"; font-size: 10.5p
x; font-weight: 700; letter-spacing: 0.12em; padding: 5px 10px; border-radius: 999px; border
: 1px solid var(--line-strong); color: var(--text); }
.chip .dot { width: 7px; height: 7px; border-radius: 50%; }
.chip.live .dot { background: var(--mint); box-shadow: 0 0 8px var(--mint); }
.chip.archive .dot { background: var(--sky); }
.chip.demo { border-color: rgba(255, 181, 71, 0.6); color: var(--flame); }
.chip.demo .dot { background: var(--flame); }
.chip.user .dot { background: var(--violet); }
.chip.cached .dot { background: var(--dim); }
.panel { background: var(--panel); border: 1px solid var(--line); border-radius: var(--r-lg); ba
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
12


<!-- page 13 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
4 Exact look first: the design reference is the ground truth
ckdrop-filter: blur(14px); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35); }
.panel-h { display: flex; align-items: center; justify-content: space-between; padding: 14px 16p
x 10px; }
.panel-b { padding: 0 16px 16px; }
.btn { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px; p
adding: 10px 16px; border-radius: 10px; border: 1px solid var(--line-strong); color: var(--t
ext); background: rgba(255, 255, 255, 0.04); }
.btn.primary { background: var(--ember); border-color: var(--ember); color: #1A0A04; }
.btn.ghost { background: transparent; }
.seg { display: inline-flex; border: 1px solid var(--line-strong); border-radius: 10px; overflow
: hidden; }
.seg span { font-family: "SG"; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; padding
: 7px 12px; color: var(--dim); }
.seg span.on { background: var(--text); color: var(--ink); }
.row { display: flex; align-items: center; gap: 10px; }
.kv { display: flex; justify-content: space-between; font-size: 12.5px; padding: 7px 0; border-b
ottom: 1px dashed var(--line); }
.kv b { font-family: "JB"; font-weight: 700; }
.tile { padding: 14px 16px; border-radius: var(--r-md); border: 1px solid var(--line); backgroun
d: rgba(255, 255, 255, 0.03); }
.tile .big { font-family: "Fraunces"; font-size: 34px; font-weight: 600; line-height: 1.1; }
.toggle { width: 34px; height: 19px; border-radius: 999px; background: var(--line-strong); posit
ion: relative; flex: none; }
.toggleƉ::after { content: ""; position: absolute; top: 3px; left: 3px; width: 13px; height: 13px
; border-radius: 50%; background: var(--dim); }
.toggle.on { background: rgba(255, 106, 61, 0.35); }
.toggle.onƉ::after { left: 18px; background: var(--ember); }
.slider { height: 4px; border-radius: 4px; background: var(--line-strong); position: relative; m
argin: 10px 0; }
.slider i { position: absolute; left: 0; top: 0; bottom: 0; background: var(--ember); border-rad
ius: 4px; }
.slider b { position: absolute; top: -6px; width: 16px; height: 16px; border-radius: 50%; backgr
ound: var(--text); border: 3px solid var(--ember); }
.legend-swatch { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }
table.grid { border-collapse: collapse; width: 100%; font-size: 12.5px; }
table.grid th { text-align: left; font-family: "SG"; font-size: 10.5px; letter-spacing: 0.12em;
text-transform: uppercase; color: var(--dim); padding: 8px 10px; border-bottom: 1px solid va
r(--line-strong); }
table.grid td { padding: 9px 10px; border-bottom: 1px solid var(--line); }
.warn { border: 1px solid rgba(255, 181, 71, 0.45); background: rgba(255, 181, 71, 0.08); color:
#FFD9A0; border-radius: 10px; padding: 10px 12px; font-size: 12.5px; }
.err { border: 1px solid rgba(255, 77, 109, 0.45); background: rgba(255, 77, 109, 0.08); color:
#FFB3C1; border-radius: 10px; padding: 10px 12px; font-size: 12.5px; }
.ok { border: 1px solid rgba(61, 220, 151, 0.45); background: rgba(61, 220, 151, 0.08); color: #
B5F5D8; border-radius: 10px; padding: 10px 12px; font-size: 12.5px; }
.mobile { width: 390px; min-height: 844px; position: relative; overflow: hidden; background: rad
ial-gradient(500px 500px at 60% 30%, #0F1A33 0%, var(--space) 70%); }
.m-top { height: 56px; display: flex; align-items: center; padding: 0 16px; gap: 10px; border-bo
ttom: 1px solid var(--line); }
.m-tabs { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; display: flex; justify
-content: space-around; align-items: center; border-top: 1px solid var(--line); background:
rgba(6, 10, 19, 0.92); font-size: 10.5px; color: var(--dim); }
.m-tabs div { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.m-tabs .on { color: var(--ember); }
.sheet { position: absolute; left: 0; right: 0; bottom: 70px; border-radius: 22px 22px 0 0; back
ground: var(--panel-solid); border-top: 1px solid var(--line-strong); padding: 10px 16px 16p
x; }
.sheet .grab { width: 40px; height: 4px; border-radius: 4px; background: var(--line-strong); mar
gin: 0 auto 10px; }
Do not
Do not redesign, restyle or ’improve’ the look. Do not swap fonts or colours. Do not replace the flat data
globe with the realistic Earth (that is Home only). Do not use a UI kit that changes the look.
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
13


<!-- page 14 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
5 Keeping the AI's memory small and correct: graphify, data index, Antigravity
MEMORY
5
Keeping the AI's memory small
and correct: graphify, data index,
Antigravity
A big project does not fit in an AI’s working memory at once. If Claude Code reads every data file and
every document each session, it wastes its context and forgets details. Three tools fix this: a knowledge
graph of the repository (graphify), one small index file that describes all data (DATA_INDEX.json), and
short summary files the AI reads first. The rule for the AI is simple: read the index and the graph first,
and open a raw file only when a task needs it.
5.1 graphify: a knowledge graph of the whole repos-
itory
graphify is an open-source skill for Claude Code. It reads code (with tree-sitter), Markdown docs, PDFs
and images, and builds a graph of concepts and how they connect. It saves graph.json and a short
GRAPH_REPORT.md, so later questions are answered from the graph without re-reading the sources.
Re-runs only process changed files.
pip install graphifyy Ɖ&& graphify install
# package name has two y's; command is graphify
# macOS 'externally-managed-environment' error -> pipx install graphifyy
# inside Claude Code, at the repo root:
/graphify .
# build the graph (code + docs/spec + docs/design screenshots)
/graphify . --update
# after changes: re-extract only changed files
/graphify query "which endpoint feeds the calendar page?"
/graphify path "resolver" "CalendarGrid"
graphify hook install
# rebuild after every git commit
Output goes to graphify-out/: graph.json (persistent graph), GRAPH_REPORT.md (main nodes and sug-
gested questions), graph.html (interactive view), cache/. Add graphify-out/cache/ to .gitignore; keep
GRAPH_REPORT.md committed so every session can read it.
5.2 DATA_INDEX.json: one file that describes all
data
Raw data (millions of fire rows) must never be pasted into the AI. Instead data_kit/make_data_index.py
(tested) scans data/ and writes DATA_INDEX.json with, for every CSV/Parquet file: path, size, columns
and types, row count, date range and three sample rows. The AI reads this one small file to understand
the data, then writes SQL (DuckDB) or code that runs on the real files. Run it after every pipeline run.
pip install duckdb
python data_kit/make_data_index.py
# writes DATA_INDEX.json
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
14


<!-- page 15 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
5 Keeping the AI's memory small and correct: graphify, data index, Antigravity
5.3 Files the AI reads first (in this order)
1. CLAUDE.md — rules and commands (short).
2. graphify-out/GRAPH_REPORT.md — map of the code and docs.
3. DATA_INDEX.json — what data exists, its columns and ranges.
4. data_kit/data_sources.json — every input x and its fallback sources.
5. docs/spec/CLAUDE_BUILD_SPEC.md — this spec; open the chapter for the current milestone only.
6. docs/design/preview/<page>.html + screenshots/<page>.jpg — only for the page being built.
5.4 If Claude Code is stuck or out of limit: Google
Antigravity
Google Antigravity is an agent-first IDE (a VS Code fork) with a free preview tier for personal Gmail
accounts (reported: Gemini Flash, about 50 completions a day, weekly limits; heavy users hit limits
in a few hours — check current terms). It can also run Claude and Gemini Pro models and has built-
in browser testing, which is useful for checking that pages match the screenshots. Use it as a backup,
with the same files: open the repository, give it the same CLAUDE.md text as workspace rules, point it to
docs/spec and docs/design, and ask it to continue the current milestone. graphify’s README documents
Claude Code; for other assistants, give them GRAPH_REPORT.md and DATA_INDEX.json as plain files.
Avoid
Do not let two agents edit the same files at the same time. Finish a milestone in one tool, commit, then
switch. Always re-run tests after switching tools.
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
15


<!-- page 16 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
6 Repository, folders and technology
STACK
6
Repository, folders and technol-
ogy
6.1 What already exists (FIREWORK repo)
Repository https://github.com/Dhruvsharma-DSAS/FIREWORK, live site https://firework-green.vercel.app/.
Reuse: FIRMS live client (clients/firms.py), column and confidence normalisation, per-detection clas-
sifier (pipeline/classify.py), API with {data, meta.data_source}, React + Vite frontend with MapLibre
globe, deck.gl and Recharts, 16 pytest files. Fix before judges: remove seed/evaluation_metrics.json
(impossible F1 values), update README status, never show the synthetic seed corpus as results.
6.2 Target folder structure
FIREWORK/
CLAUDE.md
.env.example
docs/spec/
this spec (PDF + MD)
data_kit/
data_sources.json, fx_engine.py, samples/
pipeline/
sources/
firms.py, gee.py, overpass.py, weather.py, orbits.py
harmonize.py
(from SpaceApps_code.zip)
accuracy_tools.py
(from SpaceApps_code.zip)
calendar_build.py
(from SpaceApps_code.zip)
failover.py, health_check.py
run.py
orchestrates the nightly job
backend/app/
main.py
FastAPI app, CORS, routers
db.py
SQLModel engine (Supabase / Neon)
models.py
tables (chapter 7)
routers/
summary.py cells.py calendar.py calib.py validation.py studio.py br
ief.py health.py ask.py
services/
resolver.py (uses data_kit), ai_router.py, rag.py
frontend/src/
pages/
Home Explorer Calendar SensorLab Studio FormulaLab Validation Sourc
e BlindSpot Learn Workspace Brief Health
components/
StatusChip LayerPanel CellInspector Timeline ValueWithBand FormulaC
hip DemoBanner EmptyState
hero/
EarthHero (three.js, Home only)
api/
one file per endpoint
styles/
tokens.css
tests/
pytest + Playwright
.github/workflows/
nightly.yml, test.yml
6.3 Approved technology (all free)
LAYER
CHOICE
BACKUP / NOTE
Frontend host
Cloudflare Pages
Vercel Hobby (non-commercial)
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
16


<!-- page 17 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
6 Repository, folders and technology
LAYER
CHOICE
BACKUP / NOTE
Frontend
React 19, Vite, React Router, MapLibre GL, deck.
gl, Recharts, d3, satellite.js, three.js (hero only)
already in FIREWORK except three.js,
satellite.js
Backend
FastAPI, Uvicorn, Pydantic, SQLModel/
SQLAlchemy, GeoAlchemy2, httpx, tenacity
Hugging Face Spaces (Docker) or Render
free (sleeps after 15 min)
Database
Supabase Postgres + PostGIS (500 MB free,
pauses after 7 days idle)
Neon (1 GB/project) with same schema
Files
Parquet on Cloudflare R2 (10 GB, no egress fee),
queried with DuckDB
GitHub Releases for small files
Pipeline
Python, pandas/polars, duckdb, earthengine-api,
earthaccess, h3
runs on GitHub Actions cron or laptop
AI
router: Groq →OpenRouter free →Gemini
Flash-Lite →GitHub Models →template
LiteLLM optional
RAG
pgvector in Supabase; local
sentence-transformers or Gemini Embedding
Qdrant Cloud free (1 GB)
Monitoring
/api/health + uptime checker + Sentry free
-
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
17


<!-- page 18 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
7 Data sources, keys, pipeline and database
DATA
7
Data sources, keys, pipeline and
database
7.1 Environment variables (.env.example)
FIRMS_MAP_KEY=
EARTHDATA_USERNAME=
EARTHDATA_PASSWORD=
EE_PROJECT=
OPENAQ_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
DATABASE_URL=postgresql:Ɖ//ƉƉ...
NEON_DATABASE_URL=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=firework-data
GROQ_API_KEY=
OPENROUTER_API_KEY=
GEMINI_API_KEY=
GITHUB_MODELS_TOKEN=
7.2 Where to get the keys
KEY
SIGN-UP
FREE LIMIT
FIRMS_MAP_KEY
https:
//firms.modaps.eosdis.nasa.gov/api/map_key/
5,000 transactions / 10 min; 1–5 days per
call
Earthdata
https://urs.earthdata.nasa.gov/users/new
bulk downloads
EE_PROJECT
https://earthengine.google.com/noncommercial/
Community tier 150 EECU-hours/month (
since 27 Apr 2026)
OPENAQ_API_KEY
https://explore.openaq.org/register
60/min, 2,000/hour
Supabase
https://supabase.com
500 MB DB, 1 GB files, 5 GB egress
Groq
https://console.groq.com/keys
e.g. 1,000 requests/day on 70B models
OpenRouter
https://openrouter.ai
free models: 20/min, 50/day
Gemini
https://aistudio.google.com/apikey
Flash/Flash-Lite only; limits shown in AI
Studio
7.3 Formula inputs (x) and their sources, in fallback
order
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
18


<!-- page 19 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
7 Data sources, keys, pipeline and database
INPUT
MEANING
FORMULAS
SOURCES (PRIMARY →BACKUPS)
x_fire_points
Active-fire detections (
MODIS + VIIRS)
F01, F02, F03,
F05, F06, F07,
F08, F13, F20,
F21, F44
FIRMS Area API →FIRMS archive download (Download
Request) →LAADS DAAC / earthaccess (MCD14ML,
VNP14IMG, VJ114IMG) →GEE community catalog FIRMS
vectors
x_clear_days
Days each cell was
visible (not cloud) -
daily FireMask
F09, F25
Google Earth Engine MOD14A1 / MYD14A1 / VNP14A1 →
Microsoft Planetary Computer modis-14A1-061 →NASA
AppEEARS area request
x_burned_area
Burned area per month
(blind-spot check)
F46
GEE MODIS/061/MCD64A1 →ORNL DAAC MODIS subsets
(MCD64A1) →ESA FireCCI
x_land_cover
Cropland / tree /
built-up class around a
fire
F08, F42, F43
ESA WorldCover 10 m (GEE) →ESA WorldCover on AWS
S3 →MODIS MCD12Q1 yearly land cover
x_industry
Industrial sites, kilns,
flares near a fire
F08, F42, F43
OSM Overpass API →Overpass mirror (private.coffee /
maps.mail.ru) →Geofabrik India extract (.osm.pbf) →
VIIRS Nightfire / EOG gas flares
x_weather
Wind, humidity, rain,
temperature for context
context panels
Open-Meteo Forecast + Archive →NASA POWER daily
point →Copernicus CDS ERA5
x_air_quality
PM2.5 near the burning
(impact panel)
impact panel
OpenAQ API v3 →Open-Meteo Air Quality (CAMS model)
→CPCB / WAQI
x_orbits
Satellite orbit elements
-> overpass times
F01, F45
CelesTrak GP API →Space-Track →Derive from FIRMS
acq_time
x_boundaries
District / state
boundaries for regions
and briefs
F04 (areas),
region totals
geoBoundaries API →Natural Earth →GADM
x_ndvi
Vegetation greenness /
harvest timing
season context
(F29)
GEE MODIS/061/MOD13Q1 →ORNL MODIS subsets →
Sentinel-2 via Earth Search STAC
x_granule_index
Which product files
exist for a date (health
+ archive)
pipeline /
health page
NASA CMR Search API →earthaccess Python library
The registry file data_kit/data_sources.json holds the same list with keys, limits and URLs. backend/ap-
p/services/resolver.py must use data_kit/fx_engine.py logic: try sources in order, skip a source that
failed in the last 10 minutes, run quality gates, cache, and return {data, meta} with data_source, fall-
back_used and tried.
7.4 What the main APIs return
API
CALL
FIELDS WE USE
FIRMS VIIRS CSV
/api/area/csv/{KEY}/VIIRS_NOAA20_NRT/W,S,E,
N/{1-5}
latitude, longitude, bright_ti4, bright_ti5, scan,
track, acq_date, acq_time, satellite,
confidence (l/n/h), version, frp, daynight
FIRMS MODIS CSV
/api/area/csv/{KEY}/MODIS_NRT/W,S,E,N/{1-5}
brightness, bright_t31, confidence (0–100),
satellite Terra/Aqua; archive adds type (0
veg, 1 volcano, 2 static, 3 offshore)
GEE MYD14A1/
MOD14A1/VNP14A1
FireMask band, monthly reduceRegions over cells
FireMask 4 cloud, 5 clear land, 7–9 fire →
clear_days, fire_days
GEE MCD64A1
BurnDate band, monthly
BurnDate > 0 →burned pixels × 0.25 km2
GEE WorldCover
v200
frequencyHistogram per cell
40 cropland, 50 built-up, 10 trees
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
19


<!-- page 20 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
7 Data sources, keys, pipeline and database
API
CALL
FIELDS WE USE
Overpass
landuse=industrial, man_made=kiln in bbox
elements[].center lat/lon, tags
Open-Meteo archive
daily wind, humidity, rain
daily.time[], daily.<var>[]
OpenAQ v3
/v3/locations?coordinates=lat,lon&radius=25000
sensors[].parameter pm25, measurements
value
CelesTrak GP JSON
gp.php?CATNR=43013&FORMAT=json
EPOCH, MEAN_MOTION, INCLINATION ... (
NORAD 37849 S-NPP, 43013 N20, 54234
N21, 25994 Terra, 27424 Aqua)
Full field-by-field responses are in FIREWORK_APIs_Keys_Datasets.pdf and data_kit/samples/. Sample
values there are illustrative; data_kit/fetch_samples.py saves real responses with your keys.
7.5 Pipeline (pipeline/run.py)
1. Ingest FIRMS archive CSVs (data/raw) + NRT via API →normalise columns (harmonize.normalise_firms).
2. Filter: equal confidence (MODIS ≥30, VIIRS n/h), scan ≤2 km (F02, F07).
3. Mask static sources: persistence over 3 years > 0.20 (F08) + flare list.
4. Grid to 0.1◦cells and cell-days (F03, F05) →Parquet data/cell_day/sensor=*/year=*.
5. Earth Engine: monthly clear_days and fire_days per cell per sensor (F09) →Parquet.
6. Monthly counts and rates (F06, F09); overlap ratios 2012–2025 (F10).
7. Calibration k per region × month × day/night with CI: median (F11), Poisson GLM (F14), EB shrinkage
(F18); store in table calib.
8. Harmonise MODIS years (F12) + bands (F24 bootstrap, F25 Monte Carlo).
9. Calendar: baselines, robust z, season dates, MK + Sen trend, BH correction (F27–F32, F37).
10. Validation: LOYO, Pettitt, PELT, seam ratio, Bland–Altman (F33–F36, F23) →table validation.
11. Flags: burned-area blind-spot ratio (F46), diurnal fraction (F45), source context (F42–F44).
12. Upload Parquet to R2; upsert small tables to Supabase; write lineage row.
7.6 Database schema (Supabase / Neon, PostGIS)
create extension if not exists postgis;
create extension if not exists vector;
create table cell (
cell text primary key,
-- '1209_2558' (0.1 deg)
geom geometry(Polygon, 4326),
area_km2 real,
district text, state text
);
create table cell_month (
cell text references cell(cell),
month date,
sensor text,
-- MODIS_T, MODIS_A, VIIRS_SNPP, VIIRS_N20, VIIRS_N21
dn char(1),
-- D or N
fire_days int, clear_days int, rate real,
primary key (cell, month, sensor, dn)
);
create table calendar (
region text, month date,
h real, lo real, hi real,
-- harmonised VIIRS-eq cell-days + 90% band
raw_modis real, raw_viirs real,
z real, flags text[],
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
20


<!-- page 21 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
7 Data sources, keys, pipeline and database
version text,
primary key (region, month, version)
);
create table calib (
region text, month int, dn char(1),
k real, k_lo real, k_hi real, n int, method text, aic real, version text,
primary key (region, month, dn, version)
);
create table validation (region text, test text, value real, passed boolean, version text, detai
l jsonb);
create table lineage (run_id text primary key, started timestamptz, inputs jsonb, code_sha text,
params jsonb, sources_used jsonb);
create table user_dataset (id uuid primary key, owner uuid, name text, rows int, mapping jsonb,
created timestamptz);
create table doc_chunk (id bigserial primary key, source text, heading text, body text, embeddin
g vector(384));
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
21


<!-- page 22 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
8 All 46 formulas to implement
FORMULAS
8
All 46 formulas to implement
Each formula has a full page (purpose, derivation, Hinglish explanation, worked example) in the A4
atlas. Here is what Claude Code needs: the equation, the inputs and where it lives. Status: E = existing
code in SpaceApps_code.zip, T = tested there, P = to write.
8.1 Time, space and counting
NO
FORMULA
EQUATION
CODE HOOK
ST
F01
Local solar time of an
overpass
tLST = tUTC +
λ
15◦h−1
lst = (utc_h + lon/15) % 24
E
F02
Pixel growth with scan
angle
s(θ)
s0
≈
1
cos2 θ (along scan),
t(θ)
t0
≈
1
cos θ (along track)
keep = df.scan <= 2.0
P
F03
Grid cell index
i =
⌊φ + 90
∆
⌋
,
j =
⌊λ + 180
∆
⌋
harmonize.cell_id(lat, lon, 0.1)
E
F04
Area of a grid cell on
the sphere
A = R2 ∆λ (sin φ2 −sin φ1)
R*R*dlon*(sin(p2)-sin(p1))
P
F05
Fire cell-day indicator
cg,d = 1
[
ng,d ≥1
]
harmonize.to_cell_days(df, 0.
1)
E
F06
Monthly cell-day count
Cg,m = ∑
d∈m
cg,d
harmonize.monthly_counts
E
F07
Equal-confidence filter
keepi = 1 [qi ≥τs] ,
τMODIS = 30, τVIIRS = nominal
normalise_firms(df, sensor)
P
F08
Persistence (
static-source mask)
pg =
active daysg
total days
harmonize.persistence(a, t)
E
F09
Clear-sky fire rate
rg,m = Fg,m
Kg,m
clear_sky_rate(F, K)
T
8.2 Calibration between sensors
NO
FORMULA
EQUATION
CODE HOOK
ST
F10
Monthly overlap ratio
km = Vm
Mm
(m ∈overlap 2012–2025)
harmonize.overlap_ratio
E
F11
Median of ratios
ˆk = median{km}
statistics.median(ratios)
ET
F12
Harmonised MODIS
value
Hg,m = ˆk · Mg,m
for m < 2012
harmonise_modis(m, k)
E
F13
Separate day and
night factors
ˆkday = median VD
m
MD
m
,
ˆknight = median VN
m
MN
m
df.groupby('daynight')
P
F14
Poisson GLM with
exposure offset
log E[Vm] = log Mm + β,
ˆk = e ˆβ
sm.GLM(V, ones,
family=Poisson(), offset=log(
M))
T
F15
Negative-binomial
variance
Var(V) = µ + µ2
θ
sm.families.NegativeBinomial
P
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
22


<!-- page 23 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
8 All 46 formulas to implement
NO
FORMULA
EQUATION
CODE HOOK
ST
F16
Delta-method CI for a
ratio
Var
(
log V
M
)
≈1
V + 1
M
se = sqrt(1/V + 1/M)
P
F17
Shrink local factor
toward global
˜k = n kloc + n0 kglob
n + n0
shrink_ratio(k, n, kg, n0)
E
F18
Empirical Bayes
shrinkage of log k
[
log kr = wr log kr + (1 −wr) µ,
wr =
τ2
τ2 + s2r /nr
empirical_bayes_log_ratio
T
F19
Power law vs ratio (
AIC)
V = a Mb
vs
V = kM,
AIC = n ln RSS
n
+ 2p
fit_power_law, aic_gaussian
T
F20
Detection-probability
curve (FRP50)
P(MODIS detects | FRP) =
1
1 + e−(FRP−FRP50)/s
detection_curve
T
F21
Log transform of FRP
y = ln(1 + FRP)
np.log1p(frp)
P
F22
Quantile mapping
x′ = F−1
V (FM(x))
quantile_map
T
F23
Bland–Altman
agreement
¯d = a −b,
LoA = ¯d ± 1.96 SD(a −b)
bland_altman(a, b)
T
8.3 Uncertainty
NO
FORMULA
EQUATION
CODE HOOK
ST
F24
Block bootstrap over
years
ˆθ∗(b) = T(years resampled with replacement) , CI = [q2.5, q97.5]
block_bootstrap_years
T
F25
Monte Carlo error
propagation
H(s) = k(s)M(s),
k(s) ∼N (ˆk, σ2
k ), M(s) ∼Poisson(M)
numpy.random.default_rng(0)
T
F26
Exact Poisson CI (
Garwood)
[
1
2 χ2
2n, α/2, 1
2 χ2
2(n+1), 1−α/2
]
scipy.stats.chi2.ppf
P
8.4 Anomalies and seasons
NO
FORMULA
EQUATION
CODE HOOK
ST
F27
Robust z-score
z =
ln(1 + x) −med
max(1.4826 MAD, σmin)
harmonize.robust_z
ET
F28
Month baseline and
spread
basem = mediany Hy,m,
spreadm = 1.4826 MADy Hy,m
calendar_build.month_
baseline
E
F29
Season start and end (
10% / 90%)
tstart = min{t : S(t) ≥0.10 Stot},
tend = min{t : S(t) ≥0.90 Stot}
season_dates
E
8.5 Trends and seam tests
NO
FORMULA
EQUATION
CODE HOOK
ST
F30
Mann–Kendall trend
statistic
S = ∑
i<j
sgn(xj −xi)
pymannkendall.hamed_rao_
modification_test
T
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
23


<!-- page 24 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
8 All 46 formulas to implement
NO
FORMULA
EQUATION
CODE HOOK
ST
F31
Hamed–Rao
autocorrelation
correction
Var∗(S) = Var(S) · n
n∗s
,
n
n∗s
= 1 +
2
n(n −1)(n −2) ∑
k
(n −k)(n −k −1)(n −k −2)ρk
pymannkendall
T
F32
Sen's slope
β = mediani<j
xj −xi
j −i
harmonize.sen_slope
E
F33
Pettitt change-point
test
Ut = ∑
i≤t ∑
j>t
sgn(xj −xi),
K = max
t
|Ut|,
p ≈2e−6K2/(n3+n2)
accuracy_tools.pettitt
T
F34
PELT multiple change
points
min
τ
∑
i
C
(
x(τi−1+1):τi
)
+ β |τ|
rpt.Pelt(model='rbf').fit(x).
predict(pen)
P
F35
Seam ratio
Rseam =
|Hafter −Hbefore|
|Vafter,raw −Mbefore|
seam_ratio
E
F36
Leave-one-year-out (
LOYO) error
MAPELOYO = 1
Y ∑
y
|ˆk−yMy −Vy|
Vy
for y in years: fit(exclude=y)
P
F37
Benjamini–Hochberg
FDR
reject H(i) for i ≤max
{
i : p(i) ≤
i
m α
}
benjamini_hochberg
T
8.6 Fusion and AI
NO
FORMULA
EQUATION
CODE HOOK
ST
F38
Kalman fusion of two
sensors
ˆx = ˆx−+ K(z −ˆx−),
K =
P−
P−+ R
kalman_fuse
T
F39
Split conformal
prediction
ˆq = Quantile⌈(n+1)(1−α)⌉/n{1 −ˆpyi(xi)},
C(x) = {y : 1 −ˆpy(x) ≤ˆq}
split_conformal_sets
T
F40
Haversine distance
d = 2R arcsin
√
sin2 ∆φ
2 + cos φ1 cos φ2 sin2 ∆λ
2
sklearn haversine metric
P
F41
DBSCAN fire
clustering
core(p) ⇐⇒|Nε(p)| ≥minPts,
Nε(p) = {q : d(p, q) ≤ε}
DBSCAN(eps=...,
metric='haversine')
P
8.7 Source attribution and blind spot
NO
FORMULA
EQUATION
CODE HOOK
ST
F42
Distance-decay
exposure (IE / AE)
IEg =
∑
f ∈industry
e−dg,f /L,
AEg = ∑
c∈crop
e−dg,c/L
np.exp(-d/L).sum()
P
F43
Context log-ratio L
Lg = ln IEg + 1
AEg + 1
harmonize.l_context
E
F44
Night fraction
νg =
Nnight
g
Nday
g
+ Nnight
g
(dn=='N').mean()
P
F45
Diurnal fraction seen
by overpasses
fseen = ∑
o
∫to+w
to−w
1
σ
√
2π
e−(t−µ)2/2σ2 dt
diurnal_fraction_seen
T
F46
Blind-spot ratio B
Bg,y =
BAg,y/Cg,y
mediany′<2021
(
BAg,y′/Cg,y′
)
ba/c / median(ba/c pre2021)
P
Must-pass tests
clear_sky_rate(30,600)=0.05 and (5,0)=None; EB gives the 2-month region the lowest weight; robust z beats
classic z on an outlier history; Pettitt finds the synthetic break at year 10 and not after harmonisation;
BH reduces 94 to 53 on the synthetic set; diurnal fraction 31.6% (peak 13:00) vs 3.3% (peak 16:18). These
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
24


<!-- page 25 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
8 All 46 formulas to implement
are synthetic checks, not results.
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
25


<!-- page 26 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
9 Backend API contract
API
9
Backend API contract
Every endpoint returns JSON {data, meta}. meta always contains data_source (string or object per input),
version, generated_at (ISO UTC), units, demo (bool) and fallback_used (bool). Errors return {data: null,
meta: {..., error}} with a proper HTTP status.
METHOD + PATH
RETURNS
PAGE
GET /api/summary/global
hex counts last 7 days
Home
GET /api/cells?bbox=W,S,E,
N&date=YYYY-MM&res=5
aggregated cells for map
Explorer
GET /api/cells/{cell}?month=YYYY-MM
inspector: fire_days, clear_days, rate, h, lo, hi,
source mix, flags, overpasses
Explorer
GET /api/calendar/
{region}?mode=raw|harmonised
matrix years × months with lo/hi, z, flags
Calendar
GET /api/calib/{region}
k, CI, method, AIC, day/night
Sensor Lab
GET /api/validation/{region}
LOYO, seam, BA, coverage results + pass rules
Validation
GET /api/formulas/{id}
formula metadata + live example inputs
Formula Lab
GET /api/source/{cell}
persistence, night fraction, L, land cover, class +
conformal set
Source
GET /api/blindspot/{region}
diurnal curve, overpass windows, B ratio
Blind Spot
POST /api/studio/upload
schema guess + preview rows
Studio
POST /api/studio/compare
match table + map + lineage
Studio
GET /api/brief/{region}?season=YYYY
numbers JSON + plain-language text
Brief
POST /api/ask
RAG + tools answer with citations
Ask helper
GET /api/health
status per data source + last update
Health
{
"data": {"cell": "1209_2558", "month": "2024-11", "fire_days_viirs_eq": 14, "lo": 12, "hi": 16
,
"clear_days": 22, "rate": 0.64, "unit": "VIIRS-equivalent fire cell-days", "flags": [
"blind_spot"]},
"meta": {"data_source": {"fire_points": "FIRMS archive VNP14IMG + MCD14ML", "clear_days": "GEE
MYD14A1",
"burned_area": "GEE MCD64A1"}, "fallback_used": false, "version": "calib-0.3",
"generated_at": "2026-10-20T06:00:00Z", "units": "VIIRS-eq cell-days", "demo": true}
}
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
26


<!-- page 27 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
WEBSITE
10
Design system and the 13 pages
10.1 Designtokens (frontend/src/styles/tokens.css)
:root {
--space: #060A13; --panel: rgba(16,24,44,0.74); --line: rgba(150,180,255,0.14);
--text: #EEF2FA; --dim: #9AA6BD;
--ember: #FF6A3D; --flame: #FFB547; --sky: #49C7F5;
--modis: #8FB8FF; --viirs: #FF8A3D; --mint: #3DDC97; --rose: #FF4D6D; --violet: #9B8CFF;
--paper: #F5F1E8;
--r-lg: 18px; --r-md: 12px; --r-sm: 8px;
}
Ɖ/* fonts: Fraunces (display), Inter (UI), JetBrains Mono (numbers), Space Grotesk (labels), Cave
at (hand notes) Ɖ*/
• Status chips: LIVE (mint), ARCHIVE (sky), CACHED (grey), DEMO (flame), USER (violet) — driven by
meta.
• MODIS is always blue, VIIRS always orange; never colour-only (add labels/shapes).
• Motion: 120 ms hover, 240 ms panels, 600 ms timeline step, 1,200 ms camera flights; respect prefers-
reduced-motion.
• Breakpoints: ≥1440 three columns; 1024–1439 panel collapses; 768–1023 inspector drawer; <768 bot-
tom sheet + 5-tab bar.
• Realistic three.js Earth ONLY on the Home hero. All data pages use the flat MapLibre + deck.gl globe.
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
27


<!-- page 28 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
Design directions studied; chosen system 'Mission Atlas' = dark mission-control canvas + editorial type.
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
28


<!-- page 29 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
10.2 Page A · Cinematic Homepage (/)
Objective: Give a first-time visitor the purpose, the honesty promise and three clear ways in, within 10
seconds. Audience: Everyone: judges, students, journalists, officials, researchers.
The Home page is the front door of FIREWORK CHRONOS. A first-time visitor — a judge, a student, a
pollution-board officer — should understand in about ten seconds what the site does, why it matters
now, and where to click next. The headline states the promise (25 years of fire on one honest ruler),
the kicker names the NASA challenge, and three buttons lead to the three main jobs: explore the Earth,
open the burning calendar, or upload your own data.
Two small chips in the top bar, LIVE and ARCHIVE, are always visible. They are read from the API’s meta
field, so if the live FIRMS feed is down the chip turns grey and says CACHED instead of pretending. The
’Why now’ panel gives the three mission end dates with sources, because the urgency of the project
comes from those dates: once MODIS stops, the morning view and the older half of the record can no
longer be checked against a second instrument.
1
2
3
4
5
6
7
8
Hi-fi mock-up (1600 × 1000). Numbers on mock-ups are demo values. Orange numbers = marked elements listed below.
Version 2 (use this for Home): realistic night Earth (NASA Blue/Black Marble textures), sunrise flare at
the limb, satellite moving on a 24 s orbit loop, original top bar with LIVE/ARCHIVE chips kept. Code:
Home_hero_kit.zip (earth3d.js). Path: quadratic Bézier in camera space P0(−0.15,1.75) →P1(0.70,1.50)
→P2(2.20,0.95), depth −4.8; pause when tab hidden; poster image for LCP and reduced motion.
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
29


<!-- page 30 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
Home v2 hero (three.js render).
Marked elements
1. Brand: chrono-orbit mark + name
2. Primary navigation (10 sections)
3. Data status chips: LIVE, ARCHIVE (always visible)
4. Challenge kicker
5. Three entry points: explore, calendar, upload
6. Record facts: length, sensors, the 3 tags every value carries
7. Why now: mission end dates with sources
8. Honesty label: demo pattern, Natural Earth
Components
• Hero globe (MapLibre globe or WebGL hero layer)
• Headline in Fraunces, tagline in Inter
• CTA group
• Stat tiles
• Why-now panel
• Status chips
Data
• Last NRT fetch time (FIRMS)
• Archive coverage years
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
30


<!-- page 31 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
• Mission dates (static, cited)
• Lightweight global hex summary (pre-computed JSON, ∼200 kB)
Interactions
• Globe auto-rotates 3.5◦/s; pauses on hover or drag; resumes after 10 s
• CTA hover: 120 ms lift
• Reduced motion: static globe image
States
• Loading: static globe poster + skeleton tiles
• Live feed down: LIVE chip turns grey CACHED with timestamp
• Hex summary missing: globe without fires + note
Frontend notes
• Route ‘/‘; reuse existing MapLibre v6 globe in MapCanvas (already supports projection globe + rota-
tion)
• Lazy-load the map after first paint; poster image for LCP
Backend
• GET /api/summary/global →hex counts last 7 days + meta.data\_source
• GET /api/health →chip states
Limits
• Fire points on the hero are a summary, not every detection
• Never animate demo data as if live
Done when (acceptance)
• LCP < 2.5 s on 4G laptop profile
• Status chips always match /api/health
• Keyboard can reach all 3 CTAs in order
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
31


<!-- page 32 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
10.3 Page B · Earth Explorer (Globe Workspace)
(/explore)
Objective: Let users find any place, see where and when burning was observed, and inspect one cell
with its evidence. Audience: Researchers, officials, journalists, students.
The Explorer is the main working screen. It shows the globe with fire detections and lets the user move
from the whole planet down to one 0.1◦cell (about 106 km2 in Punjab). On the left, the layer panel
decides what is drawn: VIIRS and MODIS hot-spots, H3 density hexagons, burned area, land cover, clear-
sky coverage, the day/night line and satellite ground tracks. One confidence rule is applied to both
sensors, so switching sensors never changes the strictness of the filter.
Clicking a cell opens the inspector on the right. It shows the fire cell-days for the chosen month, how
many days the cell was actually visible (clear-sky), the rate, the harmonised value with its 90% band,
the source mix and, if needed, a blind-spot warning. Below it, a small card lists which satellites pass
over the cell and at what local time, next to the hour when burning usually peaks. The timeline at the
bottom plays day by day, month by month or year by year and marks the 2012 seam where VIIRS begins.
1
2
3
4
5
Hi-fi mock-up (1600 × 1000). Numbers on mock-ups are demo values. Orange numbers = marked elements listed below.
Marked elements
1. Layer panel: fire, context, colour mode, same confidence rule for both sensors
2. Place search with bbox (W,S,E,N)
3. Cell inspector: counts, clear-sky, rate, harmonised value with band, source mix, blind-spot warning
4. Sensors over this cell: overpass times vs burning peak
5. Timeline: play by day/month/year; MODIS era vs VIIRS era; 2012 seam marked
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
32


<!-- page 33 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
Components
• Globe/map canvas (MapLibre v6 + deck.gl overlay)
• Layer panel
• Search
• Inspector
• Overpass card
• Timeline scrubber
Data
• Hex/cell aggregates per day or month (vector tiles)
• Raw detections only when zoomed in (≤5,000 features per request)
• Clear-sky counts
• Burned area raster tiles
• TLE for ground tracks (CelesTrak)
Interactions
• Zoom thresholds: z<4 H3 res 2–3 hexes; 4–7 res 5; >7 raw points
• Click cell →camera eases 1,200 ms; inspector slides 240 ms
• Timeline play: 1 step / 600 ms; cross-fade 250 ms
States
• Loading tiles: shimmer on hex layer, inspector skeleton
• Empty: ’No detections in this window’ with nearest active month
• Unavailable layer: toggle disabled + reason
• Too many points: auto-switch to hex mode
Frontend notes
• Extend existing MapCanvas.jsx and LayerPanel.jsx
• deck.gl H3HexagonLayer for density; ScatterplotLayer (already used) for points
• URL state: /explore?bbox=…&date=…&layers=…
Backend
• GET /api/cells?bbox&date&res →aggregated cells
• GET /api/cells/{id} →inspector payload with meta
• Vector tiles via ST\_AsMVT (FIREWORK rule)
Limits
• A hotspot is a pixel centre, not a fire outline
• Rate needs clear-sky data; shown as ’—’ if missing
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
33


<!-- page 34 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
Done when (acceptance)
• 60 fps pan at 100k aggregated cells on a mid laptop
• Inspector numbers equal the calendar value for the same cell-month
• All layers list source + version on hover
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
34


<!-- page 35 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
10.4 Page C · Historical Fire Calendar (/calen-
dar/:region)
Objective: Show 25 years × 12 months of burning on one consistent scale, with unusual months, seasons
and uncertainty. Audience: Officials, scientists, journalists.
The Historical Fire Calendar is the answer to the core of the challenge: a table of years by months that
shows how much burning happened in a region, on one consistent scale from 2000 to today. Every cell
is a colour; darker means more VIIRS-equivalent fire cell-days. The user can switch between Raw (what
each sensor counted) and Harmonised (MODIS converted with the factor k), and the visible jump at 2012
in Raw mode disappears in Harmonised mode — that is the ’aha’ moment of the demo.
Clicking a month shows its value with an uncertainty band, how unusual it is compared with the same
month in other years (robust z-score), how it was converted, and how well the method predicted that
kind of year in leave-one-year-out tests. A small chart under the calendar shows the season shape for
November, the start of the VIIRS era and the long-term trend with its significance. Values built from
demo data carry a DEMO label until real archive numbers replace them.
1
2
3
4
5
Hi-fi mock-up (1600 × 1000). Numbers on mock-ups are demo values. Orange numbers = marked elements listed below.
Marked elements
1. Toggles: Raw ↔Harmonised; source split; DEMO label on mock values
2. Calendar heatmap (years × months)
3. Legend: unusual month (robust z > 2) and blind-spot flag
4. Selected cell: value, band, z, how it was converted, LOYO error
5. Season shape: November totals with band, VIIRS start line, trend and warning
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
35


<!-- page 36 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
Components
• Heatmap (D3 or custom SVG)
• Mode toggles
• Detail panel
• Mini line chart (Recharts, already in repo)
Data
• Harmonised matrix H[y,m] with lo/hi
• Raw matrix
• z-scores
• Season dates
• Trend test results
• Flags
Interactions
• Raw→Harmonised: 600 ms colour tween so the 2012 step visibly disappears
• Hover: tooltip with value and band
• Click: detail panel
States
• Region with few fires: grey cells + ’indicative only’
• Archive not processed: calendar locked with ETA
• Loading: grey grid skeleton
Frontend notes
• New page Calendar.jsx (CalendarGrid component drafted in Book 4)
• Colour scale single hue; colour-blind safe
Backend
• GET /api/calendar/{region} with mode = raw or harmonised, source = all, crop, …
• Response carries unit, years, validation, flags
Limits
• Counts̸ = burned area̸ = emissions
• A trend with p > 0.05 is ’not shown’, not ’no change’
Done when (acceptance)
• Toggle changes only colours, not layout
• Every cell tooltip shows unit and band
• Same numbers as API and CSV export
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
36


<!-- page 37 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
10.5 Page D · Satellite Comparison Lab (/sensors)
Objective: Make the MODIS vs VIIRS difference visible and show how the calibration ratio is learned.
Audience: Researchers, technical reviewers, students.
The Sensor Lab explains why MODIS and VIIRS disagree and how we correct it. It is the page a scientist
or a curious student opens to see the evidence behind the conversion factor. The same fires are shown
through both sensors side by side, with a swipe handle, so the user sees with their own eyes that VIIRS
draws many small dots where MODIS draws a few large ones.
Under the map, a scatter plot compares monthly VIIRS and MODIS cell-days in the overlap period, with
the fitted ratio and, if chosen, the power-law curve. Controls let the user split day and night, change
the confidence threshold, or see the detection curve that shows at what fire power MODIS starts to miss
fires. Every chart links to its formula page, so nothing is a black box.
1
2
3
4
5
6
Hi-fi mock-up (1600 × 1000). Numbers on mock-ups are demo values. Orange numbers = marked elements listed below.
Marked elements
1. Swipe map: MODIS left, VIIRS right, same day
2. Swipe handle
3. Calibration ratio k by month (overlap 2012–2025)
4. Detection probability curve and FRP50
5. Raw vs harmonised series with day/night switch
6. Model fit panel: k day, k night, overdispersion, AIC
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
37


<!-- page 38 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
Components
• Swipe compare (two synced maps)
• Bar chart
• Logistic curve
• Line chart
• Model panel
Data
• Same-day detections by sensor
• k by region-month with CI
• Matched-pair FRP table
• GLM outputs
Interactions
• Swipe handle drag; keyboard arrows move 5%
• Day/Night/Both switch re-draws in 300 ms
States
• Night k not computed: ’— needs archive run’
• No matched pairs: curve hidden + explanation
Frontend notes
• Two MapLibre instances with synced camera, or one map + clip mask
• Recharts for bars/lines
Backend
• GET /api/calibration/{region}
• GET /api/detection-curve/{region}
Limits
• Matched pairs need near-simultaneous overpasses (≤15 min)
• Terra drift years excluded
Done when (acceptance)
• k shown with CI, never alone
• All synthetic numbers labelled until real run
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
38


<!-- page 39 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
10.6 Page E · User Data Studio (/studio)
Objective: Let anyone bring their own data (file, table, paste or plain words) and run the same trans-
parent analysis. Audience: Researchers, field teams, students, NGOs.
The User Data Studio lets anyone bring their own data and check it against the satellite record. A re-
searcher may have a field survey of burnt farms, an NGO may have a list of complaints, a student may
have a spreadsheet from a news report. The Studio accepts CSV, Excel, JSON, GeoJSON, KML, zipped
shapefiles, a pasted table, or even rows typed in a chat box.
After upload, the Studio guesses which columns hold latitude, longitude, date and value, and shows
them in an editable sheet so the user can correct mistakes. A validation step flags impossible coordi-
nates, bad dates and duplicates, and converts times to UTC. The user then sets the parameters — cell
size, date window, sensors, confidence, day or night — and runs a comparison. The result is a match
table and a map, exported with a lineage note and tagged USER so it is never mixed into the public
calendar.
1
2
3
4
5
6
Hi-fi mock-up (1600 × 1000). Numbers on mock-ups are demo values. Orange numbers = marked elements listed below.
Marked elements
1. 10-step workflow: Upload →… →Export
2. Dataset card: type, coordinates, time-zone guess, duplicates, missing values; Beginner/Researcher/-
Custom mode
3. Plain-words assistant: builds a plan only; numbers always from the pipeline
4. Column mapping with live validation (impossible latitude, ambiguous date, unit conversion)
5. Parameter panel with consequences explained
6. Live preview before/after cleaning
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
39


<!-- page 40 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
Components
• Stepper
• File inspector
• Spreadsheet grid (editable)
• Mapping dropdowns
• Validation list
• Parameter form
• Chat panel
• Preview chart
• Config download
Data
• Uploaded file (CSV, TSV, XLSX, JSON, GeoJSON)
• Schema guess
• Validation report
• Archive detections for comparison
• config.json
Interactions
• Every parameter change re-runs preview in a Web Worker (debounced 400 ms)
• Errors link to the exact row
• Before/after toggle
States
• Unsupported file: explain accepted types
• Schema unknown: manual mapping mode
• Too large (> 50 MB): suggest chunking or API import
• Server busy: job queued with position
Frontend notes
• New route; spreadsheet grid component (e.g. a lightweight data-grid) and Web Worker for parsing
• Never send files to the LLM; send only the schema summary
Backend
• POST /api/uploads (virus/size checks) →upload\_id
• POST /api/jobs {upload\_id, config} →job\_id
• GET /api/jobs/{id} →status, result, warnings
• Files stored with TTL; user data tagged USER-UPLOADED
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
40


<!-- page 41 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
Limits
• Arbitrary data cannot always produce valid science; the studio says why
• Matching distance/time choices change results — shown side by side
Done when (acceptance)
• Impossible values are always caught (lat /∈[−90,90], lon /∈[−180,180], future dates)
• Same config + same data →same result (reproducible)
• LLM output never contains a number not present in the job result
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
41


<!-- page 42 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
10.7 Page F · Scientific Formula Explorer (/formu-
las/:id)
Objective: Teach every formula with inputs you can change, step-by-step reasoning and honest com-
parisons. Audience: Students, reviewers, curious public.
The Formula Lab turns the mathematics of Part V into interactive cards. Each card shows one formula
with its symbols, a short derivation, the data it uses, a live example with sliders, and a link to the code. It
exists because judges reward scientific validity, and validity is easier to believe when people can change
an input and watch the output move.
The page is also a teaching tool. Next to each English explanation there is a Hinglish note in plain words,
and common doubts are answered under the card. Formulas that are tested carry a TESTED tag, ideas
that are not yet built carry PROPOSED, and anything that uses synthetic numbers is clearly marked.
1
2
3
4
5
Hi-fi mock-up (1600 × 1000). Numbers on mock-ups are demo values. Orange numbers = marked elements listed below.
Marked elements
1. 46 methods in 8 families
2. Formula card with symbol legend
3. Try-it table: edit inputs, see k and the converted value
4. Step-by-step in English or Hinglish
5. Why this, not that: alternatives compared, common doubts, link to code
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
42


<!-- page 43 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
Components
• Method index
• Formula renderer (KaTeX)
• Editable mini table
• Stepper
• Comparison chart
• Doubts accordion
Data
• Formula metadata (this Atlas, Part V)
• Small example datasets
• Links to code and references
Interactions
• Edit a value →result animates (number count-up 400 ms)
• Language toggle keeps scroll position
States
• Invalid input (e.g. MODIS = 0): explain the skip rule
Frontend notes
• KaTeX for math; content from a JSON file generated from this Atlas
• Shareable URL per formula
Backend
• Static JSON; no server needed
Limits
• Toy examples are teaching aids, not results
Done when (acceptance)
• Every formula page shows: problem, intuition, definition, example, limits, code link
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
43


<!-- page 44 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
10.8 Page G · Accuracy & Validation Dashboard
(/validation)
Objective: Show how far each result can be trusted, where it fails, and what is still unproven. Audience:
Technical reviewers, judges, scientists.
The Validation page shows how much the harmonised record can be trusted, region by region. It reports
the leave-one-year-out error (how well MODIS predicts a hidden VIIRS year), the 2012 seam test before
and after harmonisation, the Bland–Altman bias and limits of agreement, the model choice between a
simple ratio and a power law, and whether the 90% bands really contain the truth about 90% of the time.
Pass rules are written on the page before any results are shown, so the team cannot move the goalposts.
Regions that fail are not hidden: they are labelled ’indicative only’. This page is where a sceptical judge
should end up, and it is designed to answer the question ’how do you know?’ in under a minute.
1
2
3
4
5
Hi-fi mock-up (1600 × 1000). Numbers on mock-ups are demo values. Orange numbers = marked elements listed below.
Marked elements
1. Scorecard tiles: seam, LOYO, Pettitt, band coverage, FDR
2. Leave-one-year-out chart
3. Bland–Altman agreement
4. Region reliability table with status
5. Known limitations
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
44


<!-- page 45 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
Components
• KPI tiles
• Line chart
• Scatter
• Table
• Limitations list
Data
• Validation outputs per region
• Residuals
• Coverage tests
Interactions
• Click a region row →charts filter
• Hover tile →definition popover
States
• Real run pending: tiles show ’—’ and a SYNTHETIC banner, never fake values
Frontend notes
• Recharts; tiles with tooltips linking to Formula Explorer
Backend
• GET /api/validation/{region}
Limits
• No significant change point̸ = no bias
• Targets are goals, not achievements
Done when (acceptance)
• Banner visible whenever any number is synthetic
• Each tile links to its formula
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
45


<!-- page 46 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
10.9 Page H · Fire Source Intelligence (/sources)
Objective: Separate crop residue, forest fire, industrial heat and unknown — with evidence for and
against. Audience: Officials, researchers.
The Fire Source page tries to tell what is burning in a cell: crop residue, forest or wildland, an industrial
or static source such as a brick kiln or gas flare, or unknown. It combines several clues — how many
days a year the place is hot (persistence), how close it is to mapped industry versus cropland, how often
it burns at night, the fire power, and land cover.
The answer is shown as a probability with an honest ’unknown’ when the clues disagree. This matters
because factories and flares burn all year and would otherwise inflate the agricultural season and distort
the calibration between sensors.
1
2
3
Hi-fi mock-up (1600 × 1000). Numbers on mock-ups are demo values. Orange numbers = marked elements listed below.
Marked elements
1. Map coloured by source class with legend; unknown is a valid answer
2. Site evidence card: persistence, night share, ∆T, OSM context, L value
3. Calendar split by source
Components
• Map
• Evidence card
• Stacked bars
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
46


<!-- page 47 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
Data
• Site features (persistence, night fraction, ∆T, IE, AE, L)
• Classifier probabilities
• OSM features
Interactions
• Click site →evidence card; ’why’ expands each feature
• Filter by class
States
• Abstain (< 0.55): UNKNOWN with top-2 classes shown
• OSM missing: AE/IE shown as ’no data’, not 0
Frontend notes
• Reuse SiteDossier.jsx and classify.py outputs from FIREWORK
Backend
• GET /api/sites?bbox
• GET /api/sites/{id}
Limits
• OSM coverage of kilns in India is incomplete
• Weather never used for class decisions (FIREWORK rule)
Done when (acceptance)
• Every class shows evidence for and against
• UNKNOWN never hidden
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
47


<!-- page 48 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
10.10 Page I · Blind Spot Observatory (/blind-spot)
Objective: Explain when satellites under-detect burning and quantify it with burned area and timing.
Audience: Officials, journalists, scientists.
The Blind Spot Observatory shows what the satellites cannot see. Polar-orbiting satellites pass over a
place only at fixed local times (around 10:30 and 13:30, plus night passes). If farmers burn at 4 PM, the
fire may be over before the next look. The page draws a 24-hour clock with the overpass windows and
the estimated burning curve, and computes the share of burning that falls inside those windows.
It also compares burned area (from MCD64A1) with the number of counted fire days. If the burnt area
stays high while counts fall, the ratio B rises and the page flags that the counts are probably too low.
This is our answer to the Punjab story, where reported fire counts fell sharply while burnt area fell
much more slowly.
1
2
3
4
Hi-fi mock-up (1600 × 1000). Numbers on mock-ups are demo values. Orange numbers = marked elements listed below.
Marked elements
1. 24-hour clock: satellite passes vs burning window
2. Counts vs burned area (reported values)
3. Blind-spot ratio B timeline with flag threshold
4. Four causes of hidden fire
Components
• Radial clock
• Bar chart
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
48


<!-- page 49 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
• Ratio line
• Cause cards
Data
• Burned area (MCD64A1/VNP64A1)
• Harmonised counts
• Geostationary hourly FRP if available
• Published reports (iFOREST) as context
Interactions
• Scrub the clock to see what each satellite saw
States
• No geostationary data: diurnal curve marked ’scenario, not measurement’
Frontend notes
• D3 radial clock component
Backend
• GET /api/blindspot/{region}
Limits
• Diurnal shapes are assumptions until fitted to hourly data
Done when (acceptance)
• Reported values carry source and year
• Scenario values visually different from measured
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
49


<!-- page 50 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
10.11 Page J · Research & Education Center (/learn)
Objective: Teach the science step by step and keep every claim linked to its source. Audience: Students,
teachers, public.
The Learn page is a short course for students and newcomers. In six steps it explains how a satellite
detects fire, why pixels have different sizes, why clouds hide fires, why the 2012 jump is not real, how
harmonisation works, and how to read an uncertainty band. Each step has a small animation and a
one-line quiz.
It reuses the same components and data as the rest of the site, so a student who finishes the course can
open the Explorer and recognise every control.
1
2
3
4
5
Hi-fi mock-up (1600 × 1000). Numbers on mock-ups are demo values. Orange numbers = marked elements listed below.
Marked elements
1. Six-lesson path + language toggle
2. Lesson card with diagram and hand note
3. Glossary
4. Most misunderstood ideas
5. Research library
Components
• Lesson path
• Lesson reader
• Glossary
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
50


<!-- page 51 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
• Myth cards
• Reference table
Data
• Lesson content (from Book 1 and this Atlas)
• Bibliography
Interactions
• Progress saved locally
• Each lesson ends with a 3-question check
States
• Offline: cached lessons
Frontend notes
• MDX or JSON content; paper style surfaces
Backend
• Static
Limits
• Simplified teaching diagrams are labelled as schematic
Done when (acceptance)
• Every lesson cites at least one source
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
51


<!-- page 52 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
10.12 Page K · Personalized Workspace (/me)
Objective: Save regions and analyses, compare them side by side and reproduce any result. Audience:
Returning users, researchers, officials.
The Workspace is the personal area of a logged-in user. It keeps saved regions, saved views of the Ex-
plorer and Calendar, uploaded datasets from the Studio and previous comparisons. A user can return a
week later and find their Punjab analysis exactly as they left it, with the parameters and data versions
recorded.
Saved items are private by default. Sharing creates a read-only link that includes the full URL state, so
a colleague sees the same map, the same month and the same layers.
1
2
3
Hi-fi mock-up (1600 × 1000). Numbers on mock-ups are demo values. Orange numbers = marked elements listed below.
Marked elements
1. Saved regions
2. Analyses with data type, algorithm version, run time, status
3. Side-by-side comparison and exports
Components
• Region cards
• Analyses table
• Compare panel
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
52


<!-- page 53 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
Data
• User regions (GeoJSON)
• Job history with config + data versions
Interactions
• Select two analyses →compare
• Outdated algorithm →’re-run’ button
States
• Not signed in: local-only workspace with warning
Frontend notes
• Simple auth (magic link) optional; local storage fallback
Backend
• /api/me/regions, /api/me/jobs
Limits
• Old results are kept but flagged when the algorithm changes
Done when (acceptance)
• Any saved result can be re-run to the same numbers
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
53


<!-- page 54 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
10.13 PageL · Impact& Decision Briefing(/brief/:id)
Objective: Give non-experts one printable page with the finding, its confidence and what to do. Audi-
ence: District officials, responders, journalists.
The Impact and Decision Briefing produces a one-page summary for a region and season, written for
an official or a journalist rather than a scientist. It states how this season compares with past seasons,
whether the change is significant, whether a blind-spot warning applies, and which districts are most
unusual.
All numbers come from the calculation pipeline; a language model may only turn those numbers into
plain sentences and is never allowed to invent a figure. The brief can be printed or saved as PDF and
carries its data sources and generation date at the bottom.
1
2
3
4
Hi-fi mock-up (1600 × 1000). Numbers on mock-ups are demo values. Orange numbers = marked elements listed below.
Marked elements
1. One-sentence headline
2. Three numbers: season, vs normal, blind-spot flag
3. What it means + suggested actions
4. Sources, algorithm version, caveats
Components
• Paper page
• KPI boxes
• Chart
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
54


<!-- page 55 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
• Text blocks
Data
• Calendar, season, flags for one region
• LLM-written narrative (Groq →Gemini) tagged generated\_summary
Interactions
• Export PDF
• Copy share link
States
• LLM unavailable: template text, same numbers
Frontend notes
• Print CSS; paper design system
Backend
• POST /api/brief {region, period} →PDF
• narrate.py only writes words around numbers
Limits
• Must warn against over-interpreting uncertain counts
Done when (acceptance)
• Every number in the text exists in the data payload
• Caveat line always present
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
55


<!-- page 56 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
10.14 Page M · Data Sources & System Health
(/sources/health)
Objective: Show where every number comes from, how fresh it is and what failed over to a backup.
Audience: Developers, reviewers, power users.
The Data Sources and System Health page shows where every number comes from and whether each
source is working right now. For each feed — FIRMS live, FIRMS archive, Earth Engine masks, burned
area, weather, OpenStreetMap, orbit data — it lists the current status, the last successful update and
which backup is in use if the main source failed.
It also shows the lineage of the current calendar: input files, code version, parameters and run time.
This page is mostly for developers and judges, but it supports the honesty promise of the whole site: the
user can always see whether data is live, archived, cached, demo or their own.
1
2
3
Hi-fi mock-up (1600 × 1000). Numbers on mock-ups are demo values. Orange numbers = marked elements listed below.
Marked elements
1. Source table: plan A/B, status, last update, version, latency
2. Data-source labels: LIVE, ARCHIVE, CACHED, DEMO, USER
3. Lineage of one value from archive to calendar
Components
• Status table
• Label legend
• Lineage diagram
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
56


<!-- page 57 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
10 Design system and the 13 pages
Data
• health\_check.py results
• Pipeline run metadata
• Dataset versions
Interactions
• Click a lineage step →shows the exact formula and code
States
• All sources failing: big UNAVAILABLE, never demo data
Frontend notes
• Simple table + SVG lineage
Backend
• GET /api/health (extend existing endpoint)
• GET /api/lineage/{value\_id}
Limits
• Health shows reachability, not scientific correctness
Done when (acceptance)
• Every API response has meta.data\_source
• Fallback events logged
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
57


<!-- page 58 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
11 AI features: router, RAG and tools
AI
11
AI features:
router, RAG and
tools
11.1 AI router (backend/app/services/ai_router.py)
1. Try Groq (llama-3.3-70b-versatile or openai/gpt-oss-120b).
2. On 429/5xx/timeout try OpenRouter free model.
3. Then Gemini Flash-Lite.
4. Then GitHub Models.
5. Then template text (no AI).
6. Log provider + model in meta. Cache answers by prompt hash for 24 h.
11.2 RAG (backend/app/services/rag.py)
• Corpus: the atlas text, formula pages, dataset docs, this spec. Not raw data.
• Chunk by heading, 300–800 tokens; embed with local sentence-transformers (384-dim) or Gemini
Embedding.
• Store in doc_chunk (pgvector). Retrieve top 5, answer with citations.
• Tools the model may call:
get_cell(cell, month), get_calendar(region), explain_formula(id),
get_health(). Numbers come only from tools.
11.3 Voice (optional)
Speech to text: Groq Whisper (whisper-large-v3-turbo, 2,000 requests/day free) with language=hi for
Hindi; backup: browser Web Speech API. Text to speech: browser speechSynthesis; Google Cloud TTS
free tier as an upgrade.
Free-tier warnings Oct 2026
Gemini free tier was cut (Flash/Flash-Lite only; prompts may be used for training). Cerebras is now a
30-day trial. Hugging Face Inference Providers needs credits. Never send user personal data to free tiers
that train on prompts.
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
58


<!-- page 59 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
12 Milestones for Claude Code, with done-when checks
BUILD PLAN
12
Milestones for Claude Code, with
done-when checks
12.1 M0 Setup
• Create folders from chapter 6; add CLAUDE.md, .env.example, .gitignore
• Unzip design reference into docs/design, data kit into data_kit/, SpaceApps_code into pipeline/ and
tests/
• Install graphify and run /graphify . ; commit GRAPH_REPORT.md
• Remove seed/evaluation_metrics.json from UI; update README
Done when
pytest passes; npm run build works; docs/design previews open
12.2 M1 Exact look (all pages, fixture data)
• Copy atlas.css + fonts; build layout, top bar, StatusChip, panels exactly as the mock-ups
• Build all 13 pages + mobile versions matching preview/*.html, reading fixture JSON from frontend/s-
rc/fixtures with meta.demo=true
• Home v2 hero with earth3d.js (moving satellite, sunrise), poster image fallback
Done when
Playwright screenshots of every page match screenshots/*.jpg except data; DEMO chips visible
12.3 M2 Data engine
• resolver.py from fx_engine.py with quality gates
• sources/firms.py (API + archive CSV), gee.py, overpass.py, weather.py, orbits.py
• health_check.py feeds /api/health
Done when
resolver test: primary fails →backup used and reported
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
59


<!-- page 60 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
12 Milestones for Claude Code, with done-when checks
12.4 M3 Pipeline
• run.py steps 1–6 for Punjab–Haryana
• Parquet on R2; cell and cell_month tables
Done when
cell_month has rows 2003–2025; lineage row written
12.5 M4 Science
• Calibration (F10–F19), harmonisation + bands (F12, F24, F25)
• Calendar stats (F27–F32, F37), validation (F23, F33–F36), flags (F42–F46)
Done when
seam ratio and Pettitt on real data; validation table filled
12.6 M5 API
• All endpoints in chapter 9 with {data, meta}
• Caching; CORS allow-list
Done when
contract tests: every endpoint returns meta.data_source
12.7 M6 Connect pages to real data
• Replace fixtures with API calls page by page: Home, Explorer, Calendar first, then the rest
• Loading, empty, error, CACHED states
Done when
screenshots still match the look; DEMO chip disappears only where data is real
12.8 M7 Studio + AI
• Upload, mapping sheet, validation, compare
• AI router, RAG, Ask helper, briefs
Done when
upload a CSV and get a match table; LLM output contains no invented numbers
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
60


<!-- page 61 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
12 Milestones for Claude Code, with done-when checks
12.9 M8 Ship
• Deploy frontend (Cloudflare Pages) and API (HF Spaces / Render)
• GitHub Actions nightly + tests
• Demo rehearsal + backup video
Done when
fresh-browser test passes
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
61


<!-- page 62 -->

FIREWORK CHRONOS / CLAUDE CODE BUILD SPEC
13 Testing, deployment, open items
CHECKS
13
Testing, deployment, open items
13.1 Testing
• Unit: every formula on a known answer (tests from SpaceApps_code.zip).
• Contract: every endpoint has meta.data_source and meta.demo.
• Golden file: Punjab Nov 2024 calendar snapshot.
• UI: Playwright for 13 routes.
• Performance: Explorer 60 fps at 100k cells; API p95 < 300 ms cached.
13.2 Deployment
1. Supabase project →run schema SQL →enable PostGIS and vector.
2. Cloudflare R2 bucket firework-data →upload Parquet.
3. Backend: Docker image to Hugging Face Space or Render; set secrets.
4. Frontend: Cloudflare Pages, build command npm run build, output dist, env VITE_API_URL.
5. GitHub Actions: nightly.yml runs pipeline/run.py and health_check.py.
13.3 Open items (decide or provide)
• OPEN: 2026 rules on code written before 14 Nov.
• OPEN: final regions beyond Punjab–Haryana.
• OPEN: geostationary FRP access for India (LSA SAF IODC, MOSDAC) — unverified.
• OPEN: friend’s globe project link (not available).
• Re-check every free-tier limit the week before the hackathon.
13.4 Related documents
• FIREWORK_CHRONOS_Atlas_A4_Report.pdf — full research, design, 46 formula pages.
• FIREWORK_Technical_Approach_Free_Stack.pdf — free stack, databases, ORMs, AI.
• FIREWORK_APIs_Keys_Datasets.pdf — every API response field by field.
• Strategy, accuracy upgrade and API keys notes in the NASA project.
NASA Space Apps 2026 · Harmonization of MODIS and VIIRS Hot Spots
62
