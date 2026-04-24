import { CountrySelect } from '../CountrySelect.jsx';
import { ThemeToggle } from '../ThemeToggle.jsx';
import { Tooltip, InfoDot } from '../Tooltip.jsx';
import { CountryProfile } from '../CountryProfile.jsx';
import { METRICS_BY_KEY } from '../../lib/metrics.js';

const fmtSigned = (n, fmt) => {
  if (n == null) return null;
  const s = fmt(Math.abs(n));
  return `${n >= 0 ? '+' : '−'}${s}`;
};

export function EditorialView({
  countries, selectedA, selectedB, setSelectedA, setSelectedB,
  theme, setTheme, countryA, countryB, lens,
}) {
  const selectClasses = {
    wrapper: '',
    label: 'mb-3 font-editorial italic text-sm text-ink/60',
    button: 'w-full border-b-2 border-ink/80 pb-3 font-editorial text-3xl sm:text-4xl text-ink hover:border-ink transition-colors',
    panel: 'bg-cream border-2 border-ink shadow-2xl',
    input: 'w-full border-b border-ink/20 px-4 py-3 font-editorial text-lg bg-cream text-ink outline-none placeholder:italic placeholder:text-ink/40',
    option: 'font-editorial text-lg text-ink/90 hover:bg-ink/5',
    optionActive: 'bg-ink/10',
    flag: 'text-2xl',
  };

  const toggleClasses = {
    wrapper: 'gap-6',
    item: 'font-editorial italic text-sm tracking-wide pb-1 transition-all',
    active: 'text-ink border-b border-ink',
    inactive: 'text-ink/40 hover:text-ink/70 border-b border-transparent',
  };

  return (
    <div className="min-h-screen bg-cream text-ink font-editorial">
      {/* Paper grain overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.035] mix-blend-multiply"
        style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>")' }}
      />

      <header className="mx-auto max-w-6xl px-6 pt-10 pb-6 sm:px-10">
        <div className="flex items-baseline justify-between gap-8 border-b border-ink/30 pb-6">
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-ink/60 mb-2">Vol. I · A country-through-a-country viewer</div>
            <h1 className="font-editorial text-4xl sm:text-6xl font-medium leading-none tracking-tight">
              <em className="italic font-light">Otherly</em>
            </h1>
          </div>
          <ThemeToggle theme={theme} onChange={setTheme} classes={toggleClasses} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 sm:px-10 pb-24">
        {/* Selection row */}
        <section className="grid gap-10 sm:grid-cols-2 py-10 border-b border-ink/30">
          <CountrySelect
            countries={countries} value={selectedA} onChange={setSelectedA}
            label="Chapter I — The subject" classes={selectClasses}
          />
          <CountrySelect
            countries={countries} value={selectedB} onChange={setSelectedB}
            label="Chapter II — The lens" classes={selectClasses}
          />
        </section>

        {!countryA || !countryB ? (
          <div className="py-24 text-center">
            <p className="font-editorial italic text-2xl text-ink/60 max-w-xl mx-auto leading-relaxed">
              Choose two countries. The first becomes the subject; the second, the lens through which we read it.
            </p>
          </div>
        ) : (
          <>
            {/* Essay lede */}
            <section className="py-16 border-b border-ink/20">
              <p className="font-editorial italic text-xl text-ink/60 mb-6 tracking-wide">On the transformation of thresholds</p>
              <div className="max-w-3xl">
                <p className="font-editorial text-3xl sm:text-4xl leading-tight tracking-tight">
                  <span className="float-left mr-3 mt-1 font-editorial text-[5.5rem] leading-[0.8] font-medium">
                    {countryA.name[0]}
                  </span>
                  {countryA.name.startsWith(countryA.name[0]) && countryA.name.slice(1)}, read through{' '}
                  <em className="italic">{countryB.name}</em>. The poverty line of one country, applied to the prices of another, tells a story the raw numbers never quite reach.
                </p>
              </div>
            </section>

            {/* Transformed thresholds — the headline act */}
            <section className="py-16 border-b border-ink/20">
              <h2 className="font-editorial italic text-sm tracking-[0.2em] uppercase text-ink/50 mb-10">
                § Transformed thresholds
              </h2>
              <div className="grid gap-16 sm:grid-cols-2">
                <TransformedThreshold block={lens.poverty_line_usd_annual} countryA={countryA} countryB={countryB} />
                <TransformedThreshold block={lens.minimum_wage_usd_annual} countryA={countryA} countryB={countryB} />
              </div>

              {lens.poverty_headcount_pct.transformed != null && (
                <p className="mt-14 max-w-3xl font-editorial text-xl italic leading-relaxed text-ink/80">
                  Under {countryB.flag} {countryB.name}'s poverty standard, an estimated{' '}
                  <span className="not-italic font-medium text-ink">
                    {lens.poverty_headcount_pct.transformed.toFixed(1)}%
                  </span>{' '}
                  of {countryA.name}'s population would fall below the line — compared to the{' '}
                  <span className="not-italic font-medium text-ink">
                    {lens.poverty_headcount_pct.original?.toFixed(1) ?? '—'}%
                  </span>{' '}
                  measured today.
                  <Tooltip
                    placement="top"
                    className="bg-ink text-cream not-italic"
                    content="Estimated using a lognormal income distribution from A's median income and Gini coefficient. Useful as a directional figure, not a precise count."
                  >
                    <span className="ml-2 not-italic"><InfoDot className="border-ink/50 text-ink/70" /></span>
                  </Tooltip>
                </p>
              )}
            </section>

            {/* Side-by-side level metrics */}
            <section className="py-16">
              <h2 className="font-editorial italic text-sm tracking-[0.2em] uppercase text-ink/50 mb-10">
                § A factbook in parallel
              </h2>
              <div className="grid gap-y-10 gap-x-16 sm:grid-cols-2">
                {['unemployment_pct', 'gdp_per_capita_ppp_usd', 'median_household_income_usd', 'gini', 'life_expectancy_years', 'cost_of_living_vs_us'].map((key) => (
                  <SideBySide key={key} block={lens[key]} countryA={countryA} countryB={countryB} />
                ))}
              </div>
            </section>

            {/* Country profiles — expandable dossiers */}
            <CountryProfile
              countryA={countryA}
              countryB={countryB}
              sectionLabel="§ Dossiers"
              classes={{
                section: 'border-t border-ink/20 py-10',
                toggle: 'py-3 text-left font-editorial',
                toggleLabel: 'italic text-sm tracking-[0.2em] uppercase text-ink/50',
                toggleCount: 'ml-2 italic text-ink/40 not-italic',
                toggleIcon: 'font-editorial text-2xl text-ink/60',
                body: 'mt-8',
                headerRow: 'grid grid-cols-[minmax(140px,200px)_1fr_1fr] gap-6 border-b-2 border-ink pb-3 mb-6 font-editorial italic text-xs tracking-[0.15em] uppercase text-ink/70',
                rows: 'divide-y divide-ink/15',
                row: 'grid grid-cols-[minmax(140px,200px)_1fr_1fr] gap-6 py-4 items-start',
                rowLabel: 'font-editorial italic text-xs tracking-[0.15em] uppercase text-ink/50 pt-0.5',
                rowValue: 'font-editorial text-base text-ink leading-snug',
                noteText: 'font-editorial italic text-sm text-ink/60 mt-1.5',
                tooltip: 'bg-ink text-cream not-italic',
                infoDot: 'border-ink/50 text-ink/70',
              }}
            />
          </>
        )}
      </main>

      <footer className="border-t border-ink/20 mx-auto max-w-6xl px-6 sm:px-10 py-8">
        <p className="font-editorial italic text-xs text-ink/50">
          Data: World Bank Open Data, ILOSTAT, national statistical agencies. PPP-based cost-of-living index. See README for methodology.
        </p>
      </footer>
    </div>
  );
}

function TransformedThreshold({ block, countryA, countryB }) {
  const meta = block.meta;
  const orig = meta.format(block.original);
  const transformed = meta.format(block.transformed);

  if (block.original == null && block.transformed == null) {
    return (
      <div>
        <div className="font-editorial italic text-sm text-ink/50 mb-3">{meta.label}</div>
        <Missing label={meta.label} note={meta.sourceNote} />
      </div>
    );
  }

  return (
    <div>
      <div className="font-editorial italic text-sm text-ink/50 mb-3 flex items-center gap-2">
        {meta.label}
        <Tooltip placement="top" className="bg-ink text-cream not-italic" content={meta.sourceNote}>
          <InfoDot className="border-ink/40 text-ink/70" />
        </Tooltip>
      </div>
      <div className="flex items-end gap-5">
        <div className="font-editorial text-5xl sm:text-6xl font-medium leading-none tracking-tight line-through decoration-ink/25 decoration-[2px] text-ink/50">
          {orig ?? '—'}
        </div>
        <div className="font-editorial italic text-ink/50 pb-2">becomes</div>
      </div>
      <div className="mt-3 font-editorial text-5xl sm:text-7xl font-semibold leading-none tracking-tight">
        {transformed ?? '—'}
      </div>
      <p className="mt-4 font-editorial italic text-base text-ink/70 leading-relaxed">
        {countryA.name}'s {meta.label.toLowerCase()}, as it would stand under{' '}
        {countryB.name}'s standard, adjusted for local prices.
        {block.deltaPct != null && (
          <> That is <span className="not-italic font-medium text-ink">{block.deltaPct >= 0 ? '+' : ''}{block.deltaPct.toFixed(0)}%</span>.</>
        )}
      </p>
    </div>
  );
}

function SideBySide({ block, countryA, countryB }) {
  const meta = block.meta;
  return (
    <div>
      <div className="font-editorial italic text-sm text-ink/50 mb-3 flex items-center gap-2">
        {meta.label}
        <Tooltip placement="top" className="bg-ink text-cream not-italic" content={meta.sourceNote}>
          <InfoDot className="border-ink/40 text-ink/70" />
        </Tooltip>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-ink/50 mb-1">{countryA.flag} {countryA.code}</div>
          <div className="font-editorial text-4xl font-medium">{meta.format(block.original) ?? <Missing inline label={meta.label} note={meta.sourceNote} />}</div>
        </div>
        <div className="font-editorial italic text-2xl text-ink/30">vs</div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-widest text-ink/50 mb-1">{countryB.code} {countryB.flag}</div>
          <div className="font-editorial text-4xl font-medium">{meta.format(block.bValue) ?? <Missing inline label={meta.label} note={meta.sourceNote} />}</div>
        </div>
      </div>
    </div>
  );
}

function Missing({ label, note, inline }) {
  return (
    <Tooltip
      placement="top"
      className="bg-ink text-cream not-italic"
      content={`${label} not reported in free public datasets for this country. ${note}`}
    >
      <span className={`${inline ? '' : 'block '}font-editorial italic text-ink/40 cursor-help border-b border-dotted border-ink/30`}>
        — not reported —
      </span>
    </Tooltip>
  );
}
