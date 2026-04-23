// The core "view Country A through Country B's lens" math.
//
// Philosophy:
//   - THRESHOLD metrics (poverty line, minimum wage): recompute what A's threshold
//     would be if A adopted B's standard, adjusted for A's cost of living.
//   - LEVEL metrics (GDP, Gini, life expectancy, etc.): show A vs B side-by-side.
//   - DERIVED metric (poverty headcount): estimate under the new threshold using a
//     lognormal income distribution (standard approximation in development economics).
//
// All currency conversions go through the cost_of_living_vs_us index (US = 100), which
// is a PPP-based price-level proxy. This gives an intuitive apples-to-apples result:
// "what the same purchasing-power threshold would look like in A's prices."

import { METRICS_BY_KEY } from './metrics.js';

/** Inverse standard-normal CDF via Beasley-Springer-Moro approximation. */
function invNormCDF(p) {
  if (p <= 0 || p >= 1) return NaN;
  const a = [-39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472, 2.50662827745924];
  const b = [-54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857];
  const c = [-0.00778489400243029, -0.322396458041136, -2.40075827716184, -2.54973253934373, 4.37466414146497, 2.93816398269878];
  const d = [0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742];
  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  let q, r;
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
           ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
           (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
          ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

/** Standard-normal CDF via Abramowitz & Stegun 7.1.26 (erf approximation). */
function normCDF(x) {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * ax);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t * t - 0.254829592 * t * Math.exp(-ax * ax);
  return 0.5 * (1 + sign * y);
}

/**
 * Estimate the percentage of a country's population below an income threshold,
 * given its median household income and Gini coefficient, assuming a lognormal
 * income distribution (a standard, if imperfect, assumption used when only summary
 * statistics are available).
 *
 * For lognormal: Gini = 2·Φ(σ/√2) - 1  →  σ = √2 · Φ⁻¹((Gini+1)/2)
 * % below threshold T: Φ((ln(T) - ln(median)) / σ)
 */
export function estimateHeadcountPct(thresholdUsd, medianUsd, gini01) {
  if (!thresholdUsd || !medianUsd || gini01 == null) return null;
  const sigma = Math.SQRT2 * invNormCDF((gini01 + 1) / 2);
  if (!isFinite(sigma) || sigma <= 0) return null;
  const mu = Math.log(medianUsd);
  const pct = normCDF((Math.log(thresholdUsd) - mu) / sigma) * 100;
  return Math.max(0, Math.min(100, pct));
}

/** Scale a threshold from country B's price level into country A's price level. */
export function scaleThreshold(thresholdInB, colA, colB) {
  if (thresholdInB == null || !colA || !colB) return null;
  return thresholdInB * (colA / colB);
}

/**
 * Build the full "A through B" transformation.
 * Returns an object keyed by metric with a shape useful to all four theme views.
 */
export function buildLensView(countryA, countryB) {
  if (!countryA || !countryB) return null;
  const a = countryA.metrics;
  const b = countryB.metrics;
  const colA = a.cost_of_living_vs_us;
  const colB = b.cost_of_living_vs_us;

  const povertyLineInA_BStandard = scaleThreshold(b.poverty_line_usd_annual, colA, colB);
  const minWageInA_BStandard = scaleThreshold(b.minimum_wage_usd_annual, colA, colB);

  // Estimate how many in A would be poor under B's cost-adjusted poverty line.
  const giniA01 = a.gini != null ? a.gini / 100 : null;
  const estHeadcountBStandard = estimateHeadcountPct(
    povertyLineInA_BStandard,
    a.median_household_income_usd,
    giniA01
  );

  return {
    countryA,
    countryB,
    poverty_line_usd_annual: {
      meta: METRICS_BY_KEY.poverty_line_usd_annual,
      original: a.poverty_line_usd_annual,
      transformed: povertyLineInA_BStandard,
      bValue: b.poverty_line_usd_annual,
      deltaPct: pctChange(a.poverty_line_usd_annual, povertyLineInA_BStandard),
    },
    poverty_headcount_pct: {
      meta: METRICS_BY_KEY.poverty_headcount_pct,
      original: a.poverty_headcount_pct,
      transformed: estHeadcountBStandard,
      bValue: b.poverty_headcount_pct,
      isEstimate: true,
      deltaPctPoints: deltaPoints(a.poverty_headcount_pct, estHeadcountBStandard),
    },
    minimum_wage_usd_annual: {
      meta: METRICS_BY_KEY.minimum_wage_usd_annual,
      original: a.minimum_wage_usd_annual,
      transformed: minWageInA_BStandard,
      bValue: b.minimum_wage_usd_annual,
      deltaPct: pctChange(a.minimum_wage_usd_annual, minWageInA_BStandard),
    },
    unemployment_pct: sideBySide(a, b, 'unemployment_pct'),
    gdp_per_capita_ppp_usd: sideBySide(a, b, 'gdp_per_capita_ppp_usd'),
    median_household_income_usd: sideBySide(a, b, 'median_household_income_usd'),
    gini: sideBySide(a, b, 'gini'),
    life_expectancy_years: sideBySide(a, b, 'life_expectancy_years'),
    cost_of_living_vs_us: sideBySide(a, b, 'cost_of_living_vs_us'),
  };
}

function sideBySide(a, b, key) {
  return {
    meta: METRICS_BY_KEY[key],
    original: a[key],
    bValue: b[key],
    delta: a[key] != null && b[key] != null ? b[key] - a[key] : null,
    deltaPct: pctChange(a[key], b[key]),
  };
}

function pctChange(from, to) {
  if (from == null || to == null || from === 0) return null;
  return ((to - from) / from) * 100;
}

function deltaPoints(from, to) {
  if (from == null || to == null) return null;
  return to - from;
}
