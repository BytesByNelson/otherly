import { CountrySelect } from '../CountrySelect.jsx';
import { ThemeToggle } from '../ThemeToggle.jsx';
import { Tooltip, InfoDot } from '../Tooltip.jsx';

export function DashboardView({
  countries, selectedA, selectedB, setSelectedA, setSelectedB,
  theme, setTheme, countryA, countryB, lens,
}) {
  const selectClasses = {
    wrapper: '',
    label: 'mb-2 text-[10px] uppercase tracking-[0.25em] text-dash-dim font-mono',
    button: 'w-full rounded-md border border-dash-grid bg-dash-panel px-4 py-3 font-dashboard text-lg text-white hover:border-dash-cyan/60 transition-colors',
    panel: 'rounded-md border border-dash-grid bg-dash-panel shadow-2xl',
    input: 'w-full border-b border-dash-grid px-4 py-3 font-mono text-sm bg-dash-bg text-white outline-none placeholder:text-dash-dim',
    option: 'font-dashboard text-sm text-white/90 hover:bg-dash-grid/40',
    optionActive: 'bg-dash-grid/60',
    flag: 'text-xl',
  };

  const toggleClasses = {
    wrapper: 'rounded-md border border-dash-grid bg-dash-panel p-1',
    item: 'rounded px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-all',
    active: 'bg-dash-cyan text-dash-bg font-semibold',
    inactive: 'text-dash-dim hover:text-white',
  };

  return (
    <div className="min-h-screen bg-dash-bg text-white font-dashboard">
      {/* Grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(28,37,50,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(28,37,50,0.5) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at top, black 30%, transparent 75%)',
        }}
      />

      <header className="relative mx-auto max-w-7xl px-6 pt-8 pb-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-dash-cyan shadow-[0_0_12px_rgba(94,234,212,0.7)]" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-dash-dim">
              otherly <span className="text-dash-cyan">/</span> v0.1
            </span>
          </div>
          <ThemeToggle theme={theme} onChange={setTheme} classes={toggleClasses} />
        </div>
        <h1 className="mt-4 font-dashboard text-4xl sm:text-5xl font-semibold tracking-tight">
          Country comparison <span className="text-dash-dim">/</span>{' '}
          <span className="text-dash-cyan">lens view</span>
        </h1>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 pb-24">
        <section className="grid gap-4 sm:grid-cols-2 mt-6">
          <SelectPanel title="SUBJECT → A">
            <CountrySelect countries={countries} value={selectedA} onChange={setSelectedA} label="Subject country" classes={selectClasses} />
          </SelectPanel>
          <SelectPanel title="LENS → B" accent="amber">
            <CountrySelect countries={countries} value={selectedB} onChange={setSelectedB} label="Lens country" classes={selectClasses} />
          </SelectPanel>
        </section>

        {!countryA || !countryB ? (
          <div className="rounded-md border border-dash-grid bg-dash-panel p-12 mt-6 text-center">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-dash-dim mb-2">awaiting_input</div>
            <p className="font-dashboard text-2xl text-white/80">Select a subject and a lens to render metrics.</p>
          </div>
        ) : (
          <>
            {/* Headline transformations */}
            <section className="grid gap-4 md:grid-cols-2 mt-6">
              <TransformCard block={lens.poverty_line_usd_annual} countryA={countryA} countryB={countryB} accent="cyan" />
              <TransformCard block={lens.minimum_wage_usd_annual} countryA={countryA} countryB={countryB} accent="amber" />
            </section>

            {/* Headcount */}
            <section className="rounded-md border border-dash-grid bg-dash-panel p-6 mt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-dash-dim">Poverty headcount</div>
                  <div className="font-dashboard text-lg">
                    Share of {countryA.name}'s population below poverty line
                  </div>
                </div>
                <Tooltip
                  placement="left"
                  className="bg-dash-panel border border-dash-grid text-white/90"
                  content="Estimated from A's median income + Gini under a lognormal distribution — directional, not precise."
                >
                  <InfoDot className="border-dash-dim text-dash-dim" />
                </Tooltip>
              </div>
              <HeadcountBars block={lens.poverty_headcount_pct} countryA={countryA} countryB={countryB} />
            </section>

            {/* Level metrics — bar comparisons */}
            <section className="mt-4 rounded-md border border-dash-grid bg-dash-panel">
              <div className="px-6 pt-5 pb-3 border-b border-dash-grid">
                <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-dash-dim">level_metrics</div>
                <div className="font-dashboard text-lg mt-0.5">{countryA.code} vs {countryB.code} — side by side</div>
              </div>
              <div className="divide-y divide-dash-grid">
                {['unemployment_pct', 'gdp_per_capita_ppp_usd', 'median_household_income_usd', 'gini', 'life_expectancy_years', 'cost_of_living_vs_us'].map((key) => (
                  <BarRow key={key} block={lens[key]} countryA={countryA} countryB={countryB} />
                ))}
              </div>
            </section>
          </>
        )}

        <footer className="mt-12 font-mono text-[11px] text-dash-dim">
          <span className="text-dash-cyan">→</span> data: World Bank, ILOSTAT · cost-of-living index: PPP-derived · nulls tooltipped
        </footer>
      </main>
    </div>
  );
}

function SelectPanel({ title, accent = 'cyan', children }) {
  const color = accent === 'amber' ? 'text-dash-amber' : 'text-dash-cyan';
  return (
    <div className="rounded-md border border-dash-grid bg-dash-panel p-5">
      <div className={`font-mono text-[11px] tracking-[0.3em] ${color} mb-3`}>{title}</div>
      {children}
    </div>
  );
}

function TransformCard({ block, countryA, countryB, accent }) {
  const meta = block.meta;
  const color = accent === 'amber' ? 'text-dash-amber' : 'text-dash-cyan';
  const borderColor = accent === 'amber' ? 'border-dash-amber/30' : 'border-dash-cyan/30';
  const bgGlow = accent === 'amber' ? 'from-dash-amber/10' : 'from-dash-cyan/10';
  const deltaBadge = badgeForDelta(block.deltaPct, meta.higherIsBetter);

  const hasData = block.original != null || block.transformed != null;

  return (
    <div className={`relative overflow-hidden rounded-md border bg-dash-panel p-6 ${borderColor}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGlow} to-transparent pointer-events-none`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className={`font-mono text-[11px] uppercase tracking-[0.25em] ${color}`}>{meta.label}</div>
            <div className="font-dashboard text-xs text-dash-dim mt-0.5">
              {countryA.code} under {countryB.code} standard
            </div>
          </div>
          {deltaBadge}
        </div>
        {!hasData ? (
          <MissingDash meta={meta} />
        ) : (
          <>
            <div className="flex items-end gap-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-dash-dim mb-1">current</div>
                <div className="font-dashboard text-3xl text-white/70 line-through decoration-dash-dim/60">
                  {meta.format(block.original) ?? '—'}
                </div>
              </div>
              <div className="pb-1">
                <span className={`font-mono ${color}`}>→</span>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-dash-dim mb-1">under {countryB.code}</div>
                <div className={`font-dashboard text-5xl font-semibold ${color}`}>
                  {meta.format(block.transformed) ?? '—'}
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 text-xs font-mono text-dash-dim">
              <div>
                <span className="text-white/60">{countryB.code} raw:</span>{' '}
                <span className="text-white">{meta.format(block.bValue) ?? '—'}</span>
              </div>
              <div>
                <span className="text-white/60">method:</span> PPP-scaled
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function HeadcountBars({ block, countryA, countryB }) {
  const cur = block.original;
  const est = block.transformed;
  const max = Math.max(cur ?? 0, est ?? 0, 1);
  return (
    <div className="space-y-4">
      <BarLine label={`${countryA.code} · current`} value={cur} max={max} color="bg-white/70" />
      <BarLine label={`${countryA.code} · under ${countryB.code} standard`} value={est} max={max} color="bg-dash-rose" estimate />
      {block.deltaPctPoints != null && (
        <div className="font-mono text-xs text-dash-dim">
          Δ <span className={block.deltaPctPoints >= 0 ? 'text-dash-rose' : 'text-dash-cyan'}>
            {block.deltaPctPoints >= 0 ? '+' : ''}{block.deltaPctPoints.toFixed(1)} pp
          </span>
        </div>
      )}
    </div>
  );
}

function BarLine({ label, value, max, color, estimate }) {
  if (value == null) {
    return (
      <div>
        <div className="flex items-center justify-between font-mono text-[11px] text-dash-dim mb-1">
          <span>{label}</span>
          <span className="italic">not reported</span>
        </div>
        <div className="h-2 rounded bg-dash-grid" />
      </div>
    );
  }
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[11px] text-dash-dim mb-1">
        <span>
          {label}
          {estimate && <span className="ml-2 rounded bg-dash-grid px-1.5 py-0.5 text-[9px] tracking-widest">EST</span>}
        </span>
        <span className="text-white font-dashboard text-base">{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded bg-dash-grid overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function BarRow({ block, countryA, countryB }) {
  const meta = block.meta;
  const a = block.original, b = block.bValue;
  const both = a != null && b != null;
  const max = Math.max(a ?? 0, b ?? 0, 1);
  return (
    <div className="px-6 py-5 grid gap-4 md:grid-cols-[220px_1fr_120px] items-center">
      <div>
        <div className="font-dashboard text-sm text-white">{meta.label}</div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-dash-dim mt-0.5 flex items-center gap-1">
          {meta.unit}
          <Tooltip
            placement="right"
            className="bg-dash-panel border border-dash-grid text-white/90"
            content={meta.sourceNote}
          >
            <InfoDot className="border-dash-dim text-dash-dim" />
          </Tooltip>
        </div>
      </div>
      <div className="space-y-2">
        <DualBar label={`${countryA.flag} ${countryA.code}`} value={a} max={max} color="bg-dash-cyan/80" fmt={meta.format} />
        <DualBar label={`${countryB.flag} ${countryB.code}`} value={b} max={max} color="bg-dash-amber/80" fmt={meta.format} />
      </div>
      <div className="text-right font-mono text-xs">
        {both ? (
          <>
            <div className="text-dash-dim">Δ {meta.label.toLowerCase()}</div>
            <div className={badgeColor(block.deltaPct, meta.higherIsBetter)}>
              {block.deltaPct >= 0 ? '+' : ''}{block.deltaPct.toFixed(1)}%
            </div>
          </>
        ) : (
          <span className="text-dash-dim italic">partial</span>
        )}
      </div>
    </div>
  );
}

function DualBar({ label, value, max, color, fmt }) {
  const pct = value != null ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[10px] text-dash-dim mb-1">
        <span>{label}</span>
        <span className="text-white font-dashboard text-sm">{value != null ? fmt(value) : 'n/a'}</span>
      </div>
      <div className="h-1.5 rounded bg-dash-grid overflow-hidden">
        {value != null && <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />}
      </div>
    </div>
  );
}

function MissingDash({ meta }) {
  return (
    <Tooltip
      placement="top"
      className="bg-dash-bg border border-dash-grid text-white"
      content={`${meta.label} not available in free public datasets. ${meta.sourceNote}`}
    >
      <div className="font-mono text-sm text-dash-dim border border-dashed border-dash-grid rounded px-3 py-2 cursor-help inline-block">
        not reported · hover
      </div>
    </Tooltip>
  );
}

function badgeForDelta(deltaPct, higherIsBetter) {
  if (deltaPct == null) return null;
  const cls = badgeColor(deltaPct, higherIsBetter);
  return (
    <span className={`font-mono text-xs font-semibold ${cls}`}>
      {deltaPct >= 0 ? '+' : ''}{deltaPct.toFixed(0)}%
    </span>
  );
}

function badgeColor(deltaPct, higherIsBetter) {
  if (deltaPct == null || higherIsBetter == null) return 'text-white/80';
  const improved = (higherIsBetter && deltaPct >= 0) || (!higherIsBetter && deltaPct < 0);
  return improved ? 'text-dash-cyan' : 'text-dash-rose';
}
