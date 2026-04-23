// Metric definitions, labels, formatters, and categorization.
// A metric is either "threshold" (can be recomputed under another country's standard)
// or "level" (descriptive, shown side-by-side).

export const METRICS = [
  {
    key: 'poverty_line_usd_annual',
    label: 'Poverty line',
    short: 'Poverty line',
    unit: 'USD / year',
    kind: 'threshold',
    sourceNote: 'National poverty line, converted to USD (annualized).',
    format: (v) => (v == null ? null : `$${Math.round(v).toLocaleString()}`),
    higherIsBetter: null,
  },
  {
    key: 'poverty_headcount_pct',
    label: 'Population below poverty line',
    short: 'Poverty rate',
    unit: '%',
    kind: 'derived', // computed via lognormal when transformed
    sourceNote: 'Share of population below the national poverty line.',
    format: (v) => (v == null ? null : `${v.toFixed(1)}%`),
    higherIsBetter: false,
  },
  {
    key: 'minimum_wage_usd_annual',
    label: 'Minimum wage',
    short: 'Minimum wage',
    unit: 'USD / year',
    kind: 'threshold',
    sourceNote: 'Statutory national minimum wage, annualized, USD. Some countries set this at sector or regional level, or rely on collective bargaining.',
    format: (v) => (v == null ? null : `$${Math.round(v).toLocaleString()}`),
    higherIsBetter: true,
  },
  {
    key: 'unemployment_pct',
    label: 'Unemployment rate',
    short: 'Unemployment',
    unit: '%',
    kind: 'level',
    sourceNote: 'ILO-modeled unemployment rate.',
    format: (v) => (v == null ? null : `${v.toFixed(1)}%`),
    higherIsBetter: false,
  },
  {
    key: 'gdp_per_capita_ppp_usd',
    label: 'GDP per capita (PPP)',
    short: 'GDP / capita',
    unit: 'USD PPP',
    kind: 'level',
    sourceNote: 'Purchasing-power-parity adjusted GDP per person.',
    format: (v) => (v == null ? null : `$${Math.round(v).toLocaleString()}`),
    higherIsBetter: true,
  },
  {
    key: 'median_household_income_usd',
    label: 'Median household income',
    short: 'Median income',
    unit: 'USD / year',
    kind: 'level',
    sourceNote: 'Median annual household income in USD. Coverage is patchy for some countries.',
    format: (v) => (v == null ? null : `$${Math.round(v).toLocaleString()}`),
    higherIsBetter: true,
  },
  {
    key: 'gini',
    label: 'Gini coefficient',
    short: 'Inequality',
    unit: '0–100',
    kind: 'level',
    sourceNote: 'Gini index of income inequality. 0 = perfect equality, 100 = maximal inequality.',
    format: (v) => (v == null ? null : v.toFixed(1)),
    higherIsBetter: false,
  },
  {
    key: 'life_expectancy_years',
    label: 'Life expectancy',
    short: 'Life exp.',
    unit: 'years',
    kind: 'level',
    sourceNote: 'Life expectancy at birth.',
    format: (v) => (v == null ? null : `${v.toFixed(1)} yrs`),
    higherIsBetter: true,
  },
  {
    key: 'cost_of_living_vs_us',
    label: 'Cost of living (vs US)',
    short: 'Cost of living',
    unit: 'index, US = 100',
    kind: 'level',
    sourceNote: 'PPP-derived index; 100 = United States baseline. Lower means cheaper. This replaces paid indices (Numbeo/Mercer) with a free, auditable alternative.',
    format: (v) => (v == null ? null : `${Math.round(v)}`),
    higherIsBetter: null,
  },
];

export const METRICS_BY_KEY = Object.fromEntries(METRICS.map((m) => [m.key, m]));

export const THRESHOLD_METRICS = METRICS.filter((m) => m.kind === 'threshold');
export const LEVEL_METRICS = METRICS.filter((m) => m.kind === 'level');
