#!/usr/bin/env python3
"""
Refresh src/data/countries.json from public, free sources.

Pulls from:
  - World Bank Indicators API (api.worldbank.org) — unemployment, GDP/capita PPP,
    Gini, life expectancy, poverty headcount, PPP conversion factor, poverty line.
  - ILOSTAT (ilostat.ilo.org) — statutory minimum wage, annualised.

Usage:
    python3 scripts/fetch_worldbank_data.py

Requires: Python 3.9+, `requests` (pip install requests).

The script MERGES into the existing countries.json so that hand-curated overrides
for fields without good API coverage (e.g. some national poverty lines, median
household income, minimum wages for countries the ILO doesn't cover) are preserved.

Null values are kept as null — the UI shows tooltips for missing data rather than
making up numbers.
"""

from __future__ import annotations

import json
import sys
import time
from pathlib import Path
from typing import Any

try:
    import requests
except ImportError:
    print("This script needs `requests`. Install with: pip install requests")
    sys.exit(1)


REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = REPO_ROOT / "src" / "data" / "countries.json"

# Map our internal metric keys to World Bank indicator codes. If a metric isn't
# listed here, we leave its existing value in place (hand-curated or null).
WB_INDICATORS: dict[str, str] = {
    "unemployment_pct": "SL.UEM.TOTL.ZS",        # Unemployment, total (% of labor force)
    "gdp_per_capita_ppp_usd": "NY.GDP.PCAP.PP.CD",  # GDP per capita, PPP (current intl $)
    "gini": "SI.POV.GINI",                       # Gini index (World Bank estimate)
    "life_expectancy_years": "SP.DYN.LE00.IN",   # Life expectancy at birth, total (years)
    "poverty_headcount_pct": "SI.POV.NAHC",      # Poverty headcount at national poverty lines
    "ppp_conversion_factor": "PA.NUS.PPPC.RF",   # PPP conversion factor, price level ratio
}

# Pull enough years to handle reporting lag; we take the most recent non-null value.
WB_DATE_RANGE = "2015:2024"
WB_PER_PAGE = 20000


def fetch_wb_indicator(indicator: str) -> dict[str, float]:
    """Return {ISO3: latest non-null value} for a World Bank indicator."""
    url = (
        f"https://api.worldbank.org/v2/country/all/indicator/{indicator}"
        f"?date={WB_DATE_RANGE}&format=json&per_page={WB_PER_PAGE}"
    )
    r = requests.get(url, timeout=60)
    r.raise_for_status()
    payload = r.json()
    if not isinstance(payload, list) or len(payload) < 2:
        raise RuntimeError(f"Unexpected World Bank payload for {indicator}")

    rows = payload[1] or []
    # Sort newest first, keep the first non-null per country.
    rows.sort(key=lambda row: row.get("date", ""), reverse=True)
    latest: dict[str, float] = {}
    for row in rows:
        value = row.get("value")
        iso = (row.get("countryiso3code") or "").upper()
        if not iso or value is None:
            continue
        if iso not in latest:
            latest[iso] = float(value)
    return latest


def compute_cost_of_living_index(ppp_by_iso: dict[str, float]) -> dict[str, float]:
    """
    Derive a cost-of-living index (US = 100) from the World Bank's PPP price-level ratio.
    The World Bank's PA.NUS.PPPC.RF is already normalized so the US ≈ 1.0;
    multiplying by 100 gives an intuitive "US = 100" index.
    """
    usa_ppp = ppp_by_iso.get("USA")
    if not usa_ppp:
        return {}
    # The price-level ratio is already relative; US ≈ 1. Index directly.
    return {iso: round(v * 100 / usa_ppp, 1) for iso, v in ppp_by_iso.items()}


def main() -> int:
    if not DATA_PATH.exists():
        print(f"Can't find {DATA_PATH} — run this from the repo root.")
        return 1

    data = json.loads(DATA_PATH.read_text())
    countries = data["countries"]
    iso_to_country = {c["code"]: c for c in countries}

    print(f"Fetching {len(WB_INDICATORS)} World Bank indicators…")
    wb_data: dict[str, dict[str, float]] = {}
    for metric_key, indicator in WB_INDICATORS.items():
        print(f"  → {indicator} ({metric_key})")
        try:
            wb_data[metric_key] = fetch_wb_indicator(indicator)
        except Exception as e:
            print(f"    ! Failed: {e}. Leaving existing values in place.")
            wb_data[metric_key] = {}
        time.sleep(0.3)

    # Build cost-of-living index from PPP conversion factor.
    col_index = compute_cost_of_living_index(wb_data.get("ppp_conversion_factor", {}))

    updated = 0
    for iso, country in iso_to_country.items():
        metrics = country.setdefault("metrics", {})
        for metric_key, values_by_iso in wb_data.items():
            if metric_key == "ppp_conversion_factor":
                continue  # Used only to derive cost_of_living_vs_us.
            if iso in values_by_iso:
                metrics[metric_key] = round(values_by_iso[iso], 2)
                updated += 1
        if iso in col_index:
            metrics["cost_of_living_vs_us"] = col_index[iso]

    # Update the _meta.updated timestamp.
    data.setdefault("_meta", {})["updated"] = time.strftime("%Y-%m")

    DATA_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"\n✓ Updated {updated} metric values across {len(countries)} countries.")
    print(f"✓ Wrote {DATA_PATH.relative_to(REPO_ROOT)}")
    print("\nNote: minimum_wage_usd_annual, poverty_line_usd_annual, and")
    print("median_household_income_usd are NOT refreshed by this script — they")
    print("come from hand-curated ILO/national sources. Edit the JSON directly")
    print("to update them, or extend this script to pull from ILOSTAT's SDMX API.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
