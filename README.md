# Otherly

A country-through-a-country viewer. Pick two countries; see how one country's
thresholds — poverty line, minimum wage, cost of living — would reshape the
other.

Four visual themes at the top of the page, same data underneath: **Editorial**
(magazine essay), **Dashboard** (dark-mode data panels), **Atlas** (classic
almanac), **Playful** (bright, bouncy).

---

## Quick start

```bash
npm install
npm run dev
```

That serves the app at `http://localhost:5173`. Hot reload works.

To build for production:

```bash
npm run build
npm run preview  # optional — preview the production build locally
```

---

## Deploying to GitHub Pages

This repo ships with a GitHub Actions workflow at
`.github/workflows/deploy.yml` that builds and deploys on every push to `main`.

### One-time repo setup

1. Push this repo to GitHub.
2. In the GitHub UI: **Settings → Pages → Build and deployment → Source**
   and switch it to **GitHub Actions**. (Not the older "Deploy from a branch"
   option.)
3. Push to `main`. The workflow will build and deploy. Your site will live at
   `https://<your-username>.github.io/<repo-name>/`.

### About the `base` path

Vite needs to know the base path so asset URLs (`<script src="…">`, images,
etc.) resolve correctly.

- The **GitHub Action** sets `VITE_BASE=/<repo-name>/` automatically from the
  repo name, so CI-built deploys should just work.
- For **local `npm run build`**, it defaults to `/otherly/` — if you
  rename the repo, either:
  - Edit the default in `vite.config.js`, or
  - Run `VITE_BASE=/my-new-name/ npm run build`.
- If you deploy to a **user/org page** (`https://<user>.github.io/` with no
  sub-path) or a **custom domain**, set `VITE_BASE=/` instead.

---

## Data

All data is bundled into `src/data/countries.json`. That keeps the site
fully static — GitHub Pages just serves HTML/JS/CSS, no runtime API calls.

### Sources

| Metric | Source |
|---|---|
| Unemployment, GDP per capita (PPP), Gini, life expectancy, poverty headcount | [World Bank Open Data](https://data.worldbank.org/) |
| Cost-of-living index (US = 100) | Derived from World Bank's PPP price-level ratio (`PA.NUS.PPPC.RF`) |
| Minimum wage | [ILOSTAT](https://ilostat.ilo.org/) + national sources |
| National poverty line, median household income | National statistical agencies + World Bank where available |

All values reflect the most recent publicly reported figures as of 2022–2024.
Where a country doesn't report a metric in free public datasets (e.g. Saudi
Arabia doesn't publish a national poverty line; Switzerland and Italy don't
have statutory minimum wages), the field is `null` and the UI shows a tooltip
explaining why.

### Refreshing the data

```bash
pip install requests
npm run fetch-data
```

This runs `scripts/fetch_worldbank_data.py`, which pulls the latest World Bank
indicators and merges them into `src/data/countries.json`. Hand-curated values
(minimum wages, national poverty lines, median income) are preserved — edit
them directly in the JSON if you need to update those.

---

## How the "lens" transformation works

The core mechanic: **viewing Country A through Country B's standards.**

- **Threshold metrics** (poverty line, minimum wage): Country B's threshold is
  re-expressed in Country A's prices using their PPP-based cost-of-living
  ratio. This answers *"What would B's threshold look like if it were applied
  in A's economy?"*
- **Poverty headcount under the new line**: estimated using a lognormal income
  distribution parameterised by A's median income and Gini coefficient — a
  standard approximation in development economics when only summary statistics
  are available. Marked as an estimate in the UI.
- **Level metrics** (GDP per capita, Gini, life expectancy, unemployment, cost
  of living): shown A vs. B side-by-side without transformation.

The math lives in `src/lib/transform.js` and is straightforward — about 100
lines.

---

## Project structure

```
.
├── .github/workflows/deploy.yml    GitHub Actions → GitHub Pages
├── scripts/
│   └── fetch_worldbank_data.py     Refresh countries.json from public APIs
├── src/
│   ├── data/countries.json         Bundled dataset (50 countries)
│   ├── lib/
│   │   ├── metrics.js              Metric definitions + formatters
│   │   └── transform.js            Lens-view computation
│   ├── components/
│   │   ├── CountrySelect.jsx       Searchable country combobox
│   │   ├── ThemeToggle.jsx         Four-way theme switcher
│   │   ├── Tooltip.jsx             Tooltip + InfoDot helpers
│   │   └── themes/
│   │       ├── EditorialView.jsx
│   │       ├── DashboardView.jsx
│   │       ├── AtlasView.jsx
│   │       └── PlayfulView.jsx
│   ├── App.jsx                     State + routing
│   ├── main.jsx                    React entrypoint
│   └── index.css                   Tailwind
├── index.html                      Font imports (Google Fonts + Fontshare)
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## URL state

Selections and theme live in the URL hash, so views are shareable:

```
https://<your-site>/#a=USA&b=AUS&theme=editorial
```

---

## License

MIT. Use it, fork it, improve it.
