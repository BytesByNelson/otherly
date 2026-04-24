import { CountrySelect } from '../CountrySelect.jsx';
import { ThemeToggle } from '../ThemeToggle.jsx';
import { Tooltip, InfoDot } from '../Tooltip.jsx';
import { CountryProfile } from '../CountryProfile.jsx';

export function AtlasView({
  countries, selectedA, selectedB, setSelectedA, setSelectedB,
  theme, setTheme, countryA, countryB, lens,
}) {
  const selectClasses = {
    wrapper: '',
    label: 'mb-2 font-atlas text-xs uppercase tracking-[0.3em] text-atlas-ink/70',
    button: 'w-full border-b-2 border-atlas-ink pb-2 font-atlas text-3xl text-atlas-ink hover:text-atlas-oxblood transition-colors',
    panel: 'bg-atlas-paper border-2 border-atlas-ink shadow-[0_20px_40px_-10px_rgba(28,46,74,0.35)]',
    input: 'w-full border-b border-atlas-ink/30 px-4 py-3 font-atlasBody italic text-lg bg-atlas-paper text-atlas-ink outline-none placeholder:text-atlas-ink/40',
    option: 'font-atlasBody text-lg text-atlas-ink hover:bg-atlas-ink/5',
    optionActive: 'bg-atlas-ink/10',
    flag: 'text-2xl',
  };

  const toggleClasses = {
    wrapper: 'border border-atlas-ink',
    item: 'px-4 py-1.5 font-atlas text-[11px] uppercase tracking-[0.25em] transition-colors border-l border-atlas-ink/40 first:border-l-0',
    active: 'bg-atlas-ink text-atlas-paper',
    inactive: 'text-atlas-ink/70 hover:bg-atlas-ink/10',
  };

  return (
    <div className="min-h-screen bg-atlas-paper text-atlas-ink font-atlasBody">
      {/* Paper texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.08] mix-blend-multiply"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.7%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>")',
        }}
      />

      <header className="relative mx-auto max-w-5xl px-6 pt-12 pb-8 sm:px-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4 text-atlas-ink/60">
            <Ornament /> <span className="font-atlas text-[11px] uppercase tracking-[0.4em]">Volumen I</span> <Ornament flip />
          </div>
          <h1 className="font-atlas text-6xl sm:text-7xl font-light tracking-wide" style={{ fontFeatureSettings: '"smcp"' }}>
            Otherly
          </h1>
          <p className="mt-3 font-atlasBody italic text-atlas-ink/70 text-lg">
            An Almanack of Comparative National Standards
          </p>
          <div className="mt-5 flex justify-center">
            <ThemeToggle theme={theme} onChange={setTheme} classes={toggleClasses} />
          </div>
        </div>
        <DoubleRule />
      </header>

      <main className="relative mx-auto max-w-5xl px-6 sm:px-12 pb-24">
        <section className="grid gap-12 sm:grid-cols-2 py-6">
          <div>
            <div className="font-atlas text-xs uppercase tracking-[0.3em] text-atlas-oxblood mb-4 flex items-center gap-2">
              <span className="inline-block w-6 h-px bg-atlas-oxblood" /> Entry the First
            </div>
            <CountrySelect countries={countries} value={selectedA} onChange={setSelectedA} label="The Subject Nation" classes={selectClasses} />
          </div>
          <div>
            <div className="font-atlas text-xs uppercase tracking-[0.3em] text-atlas-oxblood mb-4 flex items-center gap-2">
              <span className="inline-block w-6 h-px bg-atlas-oxblood" /> Entry the Second
            </div>
            <CountrySelect countries={countries} value={selectedB} onChange={setSelectedB} label="The Measuring Standard" classes={selectClasses} />
          </div>
        </section>

        <DoubleRule />

        {!countryA || !countryB ? (
          <div className="py-20 text-center">
            <Ornament big />
            <p className="mt-6 font-atlasBody italic text-2xl text-atlas-ink/60 max-w-2xl mx-auto">
              Two nations, pray, must be selected ere the comparative entries shall appear.
            </p>
          </div>
        ) : (
          <>
            <section className="py-10">
              <SectionHeading romanNumeral="I" title="On Transformed Thresholds" />
              <div className="grid gap-14 sm:grid-cols-2 mt-8">
                <AtlasThreshold block={lens.poverty_line_usd_annual} countryA={countryA} countryB={countryB} />
                <AtlasThreshold block={lens.minimum_wage_usd_annual} countryA={countryA} countryB={countryB} />
              </div>

              {lens.poverty_headcount_pct.transformed != null && (
                <div className="mt-10 border-l-2 border-atlas-oxblood pl-6 max-w-3xl">
                  <p className="font-atlasBody italic text-xl leading-relaxed">
                    Should the standard of {countryB.name} be applied to the populace of {countryA.name},
                    an estimated{' '}
                    <span className="not-italic font-semibold text-atlas-oxblood">
                      {lens.poverty_headcount_pct.transformed.toFixed(1)} per cent
                    </span>{' '}
                    of its people would reside below the adjusted line, in contrast to the{' '}
                    <span className="not-italic font-semibold">
                      {lens.poverty_headcount_pct.original?.toFixed(1) ?? '—'} per cent
                    </span>{' '}
                    measured at present.
                  </p>
                  <Tooltip
                    placement="top"
                    className="bg-atlas-ink text-atlas-paper"
                    content="Estimated via lognormal distribution from A's median income and Gini. Directional figure only."
                  >
                    <span className="mt-2 inline-flex items-center gap-2 font-atlas text-[11px] uppercase tracking-[0.25em] text-atlas-ink/60 cursor-help">
                      <InfoDot className="border-atlas-ink/60 text-atlas-ink/70" /> Method note
                    </span>
                  </Tooltip>
                </div>
              )}
            </section>

            <DoubleRule />

            <section className="py-10">
              <SectionHeading romanNumeral="II" title="A Tabulation of Comparative Statistics" />
              <table className="mt-8 w-full border-t border-atlas-ink/40">
                <thead>
                  <tr className="border-b-2 border-atlas-ink/40">
                    <th className="py-3 text-left font-atlas text-xs uppercase tracking-[0.25em] text-atlas-ink/60">Particular</th>
                    <th className="py-3 text-right font-atlas text-xs uppercase tracking-[0.25em] text-atlas-ink/60">{countryA.flag} {countryA.name}</th>
                    <th className="py-3 text-right font-atlas text-xs uppercase tracking-[0.25em] text-atlas-ink/60">{countryB.flag} {countryB.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {['unemployment_pct', 'gdp_per_capita_ppp_usd', 'median_household_income_usd', 'gini', 'life_expectancy_years', 'cost_of_living_vs_us'].map((key, i) => (
                    <AtlasRow key={key} block={lens[key]} countryA={countryA} countryB={countryB} striped={i % 2 === 1} />
                  ))}
                </tbody>
              </table>
            </section>

            <DoubleRule />

            {/* Section III — Gazetteer Particulars */}
            <section className="py-10">
              <CountryProfile
                countryA={countryA}
                countryB={countryB}
                sectionLabel={
                  <span className="flex items-baseline gap-5">
                    <span className="font-atlas text-5xl text-atlas-oxblood font-light">III.</span>
                    <span className="font-atlas text-3xl sm:text-4xl font-light tracking-wide" style={{ fontFeatureSettings: '"lnum"' }}>
                      Gazetteer Particulars
                    </span>
                  </span>
                }
                classes={{
                  section: '',
                  toggle: 'w-full text-left py-2 hover:bg-atlas-ink/5 transition-colors',
                  toggleLabel: '',
                  toggleCount: 'ml-3 font-atlasBody italic text-atlas-ink/60 text-base',
                  toggleIcon: 'font-atlas text-4xl text-atlas-oxblood font-light',
                  body: 'mt-8',
                  headerRow: 'grid grid-cols-[minmax(140px,200px)_1fr_1fr] gap-6 border-b-2 border-atlas-ink/40 pb-3 mb-2 font-atlas text-xs uppercase tracking-[0.25em] text-atlas-ink/70',
                  rows: 'divide-y divide-atlas-ink/20',
                  row: 'grid grid-cols-[minmax(140px,200px)_1fr_1fr] gap-6 py-4 items-start',
                  rowLabel: 'font-atlas text-xs uppercase tracking-[0.25em] text-atlas-ink/60 pt-1',
                  rowValue: 'font-atlasBody text-base text-atlas-ink leading-snug',
                  noteText: 'font-atlasBody italic text-sm text-atlas-ink/60 mt-1.5',
                  tooltip: 'bg-atlas-ink text-atlas-paper',
                  infoDot: 'border-atlas-ink/60 text-atlas-ink/70',
                }}
              />
            </section>
          </>
        )}

        <DoubleRule />
        <footer className="py-6 text-center">
          <Ornament />
          <p className="mt-4 font-atlasBody italic text-xs text-atlas-ink/60">
            Sources: The World Bank, International Labour Organisation, &amp; sundry national agencies.
          </p>
        </footer>
      </main>
    </div>
  );
}

function SectionHeading({ romanNumeral, title }) {
  return (
    <div className="flex items-baseline gap-5">
      <span className="font-atlas text-5xl text-atlas-oxblood font-light">{romanNumeral}.</span>
      <h2 className="font-atlas text-3xl sm:text-4xl font-light tracking-wide" style={{ fontFeatureSettings: '"lnum"' }}>
        {title}
      </h2>
    </div>
  );
}

function DoubleRule() {
  return (
    <div className="my-6">
      <div className="h-px bg-atlas-ink/60" />
      <div className="mt-1 h-px bg-atlas-ink/30" />
    </div>
  );
}

function Ornament({ flip, big }) {
  return (
    <svg
      viewBox="0 0 60 12"
      className={`inline-block text-atlas-oxblood ${big ? 'w-32 h-8' : 'w-14 h-3'} ${flip ? 'scale-x-[-1]' : ''}`}
      aria-hidden
    >
      <path d="M0 6 L20 6 M40 6 L60 6" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="30" cy="6" r="2.5" fill="currentColor" />
      <circle cx="25" cy="6" r="0.8" fill="currentColor" />
      <circle cx="35" cy="6" r="0.8" fill="currentColor" />
    </svg>
  );
}

function AtlasThreshold({ block, countryA, countryB }) {
  const meta = block.meta;
  const hasData = block.original != null || block.transformed != null;

  return (
    <div>
      <h3 className="font-atlas text-2xl text-atlas-ink font-light tracking-wide flex items-center gap-2">
        {meta.label}
        <Tooltip placement="top" className="bg-atlas-ink text-atlas-paper" content={meta.sourceNote}>
          <InfoDot className="border-atlas-ink/60 text-atlas-ink/70" />
        </Tooltip>
      </h3>
      <div className="mt-3 font-atlas text-xs uppercase tracking-[0.3em] text-atlas-ink/60">
        {countryA.name} — observed &amp; transformed
      </div>
      {!hasData ? (
        <AtlasMissing meta={meta} />
      ) : (
        <div className="mt-5">
          <div className="flex items-baseline gap-4">
            <span className="font-atlasBody text-sm uppercase tracking-[0.2em] text-atlas-ink/60">Observed</span>
            <span className="font-atlas text-4xl font-light">{meta.format(block.original) ?? '—'}</span>
          </div>
          <div className="mt-3 flex items-baseline gap-4">
            <span className="font-atlasBody text-sm uppercase tracking-[0.2em] text-atlas-oxblood">Under {countryB.name}</span>
            <span className="font-atlas text-6xl font-semibold text-atlas-oxblood" style={{ fontFeatureSettings: '"onum"' }}>
              {meta.format(block.transformed) ?? '—'}
            </span>
          </div>
          {block.deltaPct != null && (
            <p className="mt-4 font-atlasBody italic text-atlas-ink/70">
              A difference of{' '}
              <span className="not-italic font-semibold">
                {block.deltaPct >= 0 ? '+' : ''}{block.deltaPct.toFixed(0)} per cent
              </span>{' '}
              from the extant figure.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function AtlasRow({ block, countryA, countryB, striped }) {
  const meta = block.meta;
  return (
    <tr className={`border-b border-atlas-ink/20 ${striped ? 'bg-atlas-ink/[0.03]' : ''}`}>
      <td className="py-4 pr-4">
        <div className="font-atlas text-lg flex items-center gap-2">
          {meta.label}
          <Tooltip placement="right" className="bg-atlas-ink text-atlas-paper" content={meta.sourceNote}>
            <InfoDot className="border-atlas-ink/60 text-atlas-ink/70" />
          </Tooltip>
        </div>
        <div className="font-atlasBody italic text-xs text-atlas-ink/60">{meta.unit}</div>
      </td>
      <td className="py-4 text-right font-atlas text-2xl font-light" style={{ fontFeatureSettings: '"onum"' }}>
        {meta.format(block.original) ?? <AtlasMissingInline meta={meta} />}
      </td>
      <td className="py-4 text-right font-atlas text-2xl font-light" style={{ fontFeatureSettings: '"onum"' }}>
        {meta.format(block.bValue) ?? <AtlasMissingInline meta={meta} />}
      </td>
    </tr>
  );
}

function AtlasMissing({ meta }) {
  return (
    <Tooltip placement="top" className="bg-atlas-ink text-atlas-paper" content={`${meta.label} not in free datasets. ${meta.sourceNote}`}>
      <p className="mt-3 font-atlasBody italic text-atlas-ink/50 border-b border-dotted border-atlas-ink/40 inline-block cursor-help">
        Figure not reported in the public ledger
      </p>
    </Tooltip>
  );
}

function AtlasMissingInline({ meta }) {
  return (
    <Tooltip placement="left" className="bg-atlas-ink text-atlas-paper" content={`${meta.label} not in free datasets. ${meta.sourceNote}`}>
      <span className="font-atlasBody italic text-atlas-ink/50 cursor-help border-b border-dotted border-atlas-ink/40">—</span>
    </Tooltip>
  );
}
