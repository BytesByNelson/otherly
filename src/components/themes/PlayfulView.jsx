import { CountrySelect } from '../CountrySelect.jsx';
import { ThemeToggle } from '../ThemeToggle.jsx';
import { Tooltip, InfoDot } from '../Tooltip.jsx';
import { CountryProfile } from '../CountryProfile.jsx';

export function PlayfulView({
  countries, selectedA, selectedB, setSelectedA, setSelectedB,
  theme, setTheme, countryA, countryB, lens,
}) {
  const selectClasses = {
    wrapper: '',
    label: 'mb-2 font-playful text-xs uppercase tracking-[0.2em] text-play-deep/70',
    button: 'w-full rounded-2xl border-[3px] border-play-deep bg-white px-5 py-4 font-playful text-2xl text-play-deep shadow-[6px_6px_0_0_theme(colors.play.deep)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[4px_4px_0_0_theme(colors.play.deep)] transition-all',
    panel: 'rounded-2xl border-[3px] border-play-deep bg-white shadow-[6px_6px_0_0_theme(colors.play.deep)] overflow-hidden',
    input: 'w-full border-b-2 border-play-deep/20 px-4 py-3 font-playfulBody text-lg bg-white text-play-deep outline-none placeholder:text-play-deep/40',
    option: 'font-playfulBody text-lg text-play-deep hover:bg-play-mint/30',
    optionActive: 'bg-play-mint/50',
    flag: 'text-3xl',
  };

  const toggleClasses = {
    wrapper: 'rounded-full border-[3px] border-play-deep bg-white p-1 shadow-[4px_4px_0_0_theme(colors.play.deep)]',
    item: 'rounded-full px-4 py-1.5 font-playful text-[11px] uppercase tracking-[0.2em] transition-all',
    active: 'bg-play-deep text-play-mint',
    inactive: 'text-play-deep/60 hover:text-play-deep',
  };

  return (
    <div className="min-h-screen bg-play-mint text-play-deep font-playfulBody relative overflow-x-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-play-sun/60 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-32 h-[500px] w-[500px] rounded-full bg-play-magenta/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-play-sky/50 blur-3xl" />

      {/* Dot grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(34,26,76,0.12) 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
        }}
      />

      <header className="relative mx-auto max-w-6xl px-6 pt-10 pb-4 sm:px-10">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white border-[3px] border-play-deep px-3 py-1 shadow-[3px_3px_0_0_theme(colors.play.deep)] mb-3">
              <span className="h-2 w-2 rounded-full bg-play-magenta animate-pulse" />
              <span className="font-playful text-[10px] uppercase tracking-[0.25em]">live view</span>
            </div>
            <h1 className="font-playful text-6xl sm:text-7xl font-extrabold leading-[0.9] tracking-tight">
              <span className="inline-block -rotate-2 bg-play-magenta text-white px-4 py-1 rounded-xl shadow-[4px_4px_0_0_theme(colors.play.deep)] border-[3px] border-play-deep">
                Otherly!
              </span>
            </h1>
          </div>
          <ThemeToggle theme={theme} onChange={setTheme} classes={toggleClasses} />
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 sm:px-10 pb-24">
        {/* Selection */}
        <section className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] items-end mt-6">
          <div>
            <CountrySelect countries={countries} value={selectedA} onChange={setSelectedA} label="Pick your country" classes={selectClasses} />
          </div>
          <div className="text-center pb-3">
            <span className="inline-block rounded-full bg-play-sun border-[3px] border-play-deep px-5 py-3 font-playful font-bold text-2xl shadow-[4px_4px_0_0_theme(colors.play.deep)] -rotate-3">
              thru →
            </span>
          </div>
          <div>
            <CountrySelect countries={countries} value={selectedB} onChange={setSelectedB} label="Pick the lens" classes={selectClasses} />
          </div>
        </section>

        {!countryA || !countryB ? (
          <div className="mt-16 text-center">
            <div className="text-7xl mb-4">🌍✨🌏</div>
            <p className="font-playful text-3xl font-bold max-w-xl mx-auto">
              Pick two countries to see one reshape the other!
            </p>
          </div>
        ) : (
          <>
            {/* Big flag face-off */}
            <div className="my-10 flex items-center justify-center gap-6 flex-wrap">
              <BigFlag country={countryA} tilt="-rotate-3" bg="bg-play-sun" />
              <div className="font-playful font-extrabold text-4xl sm:text-5xl bg-white border-[3px] border-play-deep rounded-2xl px-5 py-3 shadow-[4px_4px_0_0_theme(colors.play.deep)]">
                seen as
              </div>
              <BigFlag country={countryB} tilt="rotate-3" bg="bg-play-sky" />
            </div>

            {/* Transformations */}
            <section className="grid gap-6 md:grid-cols-2">
              <PlayfulThreshold block={lens.poverty_line_usd_annual} countryA={countryA} countryB={countryB} bg="bg-play-magenta" text="text-white" />
              <PlayfulThreshold block={lens.minimum_wage_usd_annual} countryA={countryA} countryB={countryB} bg="bg-play-sky" text="text-play-deep" />
            </section>

            {/* Fun headcount card */}
            {lens.poverty_headcount_pct.transformed != null && (
              <div className="mt-6 rounded-3xl border-[3px] border-play-deep bg-white p-7 shadow-[8px_8px_0_0_theme(colors.play.deep)]">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="shrink-0 font-playful font-extrabold text-6xl text-play-magenta">
                    {lens.poverty_headcount_pct.transformed.toFixed(1)}%
                  </div>
                  <div className="flex-1 min-w-[240px]">
                    <div className="font-playful text-xs uppercase tracking-[0.2em] text-play-deep/70 mb-1 flex items-center gap-1">
                      Would-be poverty rate
                      <Tooltip placement="top" className="bg-play-deep text-white" content="Estimated from A's median income + Gini via a lognormal approximation.">
                        <InfoDot className="border-play-deep/50 text-play-deep/80" />
                      </Tooltip>
                    </div>
                    <p className="font-playful text-xl font-bold leading-snug">
                      That's the share of {countryA.flag} {countryA.name}'s people who would be "poor" under {countryB.flag} {countryB.name}'s standard.
                    </p>
                    <p className="font-playfulBody text-sm text-play-deep/70 mt-2">
                      Currently: <span className="font-bold text-play-deep">{lens.poverty_headcount_pct.original?.toFixed(1) ?? '—'}%</span>
                      {lens.poverty_headcount_pct.deltaPctPoints != null && (
                        <> · Change: <span className={`font-bold ${lens.poverty_headcount_pct.deltaPctPoints >= 0 ? 'text-play-magenta' : 'text-play-sky'}`}>
                          {lens.poverty_headcount_pct.deltaPctPoints >= 0 ? '+' : ''}{lens.poverty_headcount_pct.deltaPctPoints.toFixed(1)} pp
                        </span></>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Factbook cards */}
            <section className="mt-8">
              <h2 className="font-playful font-extrabold text-3xl mb-5 inline-block bg-play-sun px-3 py-1 -rotate-1 rounded-xl border-[3px] border-play-deep shadow-[3px_3px_0_0_theme(colors.play.deep)]">
                Factbook!
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {['unemployment_pct', 'gdp_per_capita_ppp_usd', 'median_household_income_usd', 'gini', 'life_expectancy_years', 'cost_of_living_vs_us'].map((key, i) => (
                  <FunCard key={key} block={lens[key]} countryA={countryA} countryB={countryB} accent={i} />
                ))}
              </div>
            </section>

            {/* Country profiles — a big expandable "get to know them" card */}
            <section className="mt-8">
              <CountryProfile
                countryA={countryA}
                countryB={countryB}
                sectionLabel={
                  <span className="inline-flex items-center gap-3">
                    <span className="font-playful font-extrabold text-3xl bg-play-magenta text-white px-3 py-1 rotate-1 rounded-xl border-[3px] border-play-deep shadow-[3px_3px_0_0_theme(colors.play.deep)]">
                      Meet them!
                    </span>
                    <span className="font-playful text-sm text-play-deep/70">get the full story</span>
                  </span>
                }
                classes={{
                  section: 'rounded-3xl border-[3px] border-play-deep bg-white p-6 shadow-[8px_8px_0_0_theme(colors.play.deep)]',
                  toggle: 'w-full text-left',
                  toggleLabel: '',
                  toggleCount: 'hidden',
                  toggleIcon: 'font-playful font-extrabold text-3xl bg-play-sun text-play-deep px-3 py-1 rounded-xl border-[3px] border-play-deep shadow-[3px_3px_0_0_theme(colors.play.deep)]',
                  body: 'mt-6',
                  headerRow: 'grid grid-cols-[minmax(120px,170px)_1fr_1fr] gap-4 border-b-2 border-play-deep pb-3 mb-2 font-playful text-xs uppercase tracking-[0.2em] text-play-deep',
                  rows: 'divide-y-2 divide-play-deep/20',
                  row: 'grid grid-cols-[minmax(120px,170px)_1fr_1fr] gap-4 py-4 items-start',
                  rowLabel: 'font-playful text-xs uppercase tracking-[0.2em] text-play-deep/70 pt-1',
                  rowValue: 'font-playfulBody text-sm text-play-deep leading-snug',
                  noteText: 'font-playfulBody italic text-xs text-play-deep/60 mt-1.5',
                  tooltip: 'bg-play-deep text-white',
                  infoDot: 'border-play-deep/50 text-play-deep/80',
                }}
              />
            </section>
          </>
        )}

        <footer className="mt-12 text-center font-playfulBody text-sm text-play-deep/70">
          <span className="inline-block bg-white border-2 border-play-deep rounded-full px-4 py-1.5">
            Data: World Bank + ILO · Free &amp; open source 💛
          </span>
        </footer>
      </main>
    </div>
  );
}

function BigFlag({ country, tilt, bg }) {
  return (
    <div className={`${tilt} ${bg} border-[3px] border-play-deep rounded-3xl px-6 py-4 shadow-[6px_6px_0_0_theme(colors.play.deep)] flex items-center gap-3`}>
      <span className="text-5xl">{country.flag}</span>
      <div>
        <div className="font-playful font-extrabold text-2xl leading-tight">{country.name}</div>
        <div className="font-playful text-xs uppercase tracking-[0.25em] text-play-deep/70">{country.code}</div>
      </div>
    </div>
  );
}

function PlayfulThreshold({ block, countryA, countryB, bg, text }) {
  const meta = block.meta;
  const hasData = block.original != null || block.transformed != null;

  return (
    <div className={`relative rounded-3xl border-[3px] border-play-deep ${bg} ${text} p-6 shadow-[8px_8px_0_0_theme(colors.play.deep)]`}>
      <div className="flex items-center justify-between mb-4">
        <div className="font-playful text-xs uppercase tracking-[0.2em] opacity-90 flex items-center gap-2">
          {meta.label}
          <Tooltip placement="top" className="bg-play-deep text-white" content={meta.sourceNote}>
            <InfoDot className={`border-current text-current`} />
          </Tooltip>
        </div>
        {block.deltaPct != null && (
          <div className="rounded-full bg-white text-play-deep border-2 border-play-deep px-3 py-0.5 font-playful font-bold text-xs">
            {block.deltaPct >= 0 ? '+' : ''}{block.deltaPct.toFixed(0)}%
          </div>
        )}
      </div>
      {!hasData ? (
        <PlayfulMissing meta={meta} />
      ) : (
        <>
          <div className="font-playful text-sm opacity-80 mb-1">Current</div>
          <div className="font-playful text-3xl font-bold line-through opacity-70">
            {meta.format(block.original) ?? '—'}
          </div>
          <div className="mt-4 font-playful text-sm opacity-80">Under {countryB.flag} {countryB.name}</div>
          <div className="font-playful text-6xl font-extrabold leading-none tracking-tight">
            {meta.format(block.transformed) ?? '—'}
          </div>
        </>
      )}
    </div>
  );
}

const ACCENTS = [
  { bg: 'bg-play-sun', text: 'text-play-deep' },
  { bg: 'bg-play-magenta', text: 'text-white' },
  { bg: 'bg-play-sky', text: 'text-play-deep' },
  { bg: 'bg-play-mint', text: 'text-play-deep' },
  { bg: 'bg-play-sun', text: 'text-play-deep' },
  { bg: 'bg-play-magenta', text: 'text-white' },
];

function FunCard({ block, countryA, countryB, accent }) {
  const meta = block.meta;
  const { bg, text } = ACCENTS[accent % ACCENTS.length];
  return (
    <div className={`rounded-3xl border-[3px] border-play-deep ${bg} ${text} p-5 shadow-[6px_6px_0_0_theme(colors.play.deep)]`}>
      <div className="font-playful text-[11px] uppercase tracking-[0.2em] mb-3 opacity-90 flex items-center gap-2">
        {meta.label}
        <Tooltip placement="top" className="bg-play-deep text-white" content={meta.sourceNote}>
          <InfoDot className="border-current text-current" />
        </Tooltip>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FunValue flag={countryA.flag} code={countryA.code} value={block.original} fmt={meta.format} meta={meta} />
        <FunValue flag={countryB.flag} code={countryB.code} value={block.bValue} fmt={meta.format} meta={meta} />
      </div>
    </div>
  );
}

function FunValue({ flag, code, value, fmt, meta }) {
  return (
    <div className="rounded-2xl bg-white/80 text-play-deep border-2 border-play-deep p-3">
      <div className="font-playful text-[10px] uppercase tracking-widest opacity-70">{flag} {code}</div>
      <div className="font-playful font-extrabold text-2xl leading-tight mt-1">
        {value != null ? fmt(value) : (
          <Tooltip placement="top" className="bg-play-deep text-white" content={`${meta.label} not in free data. ${meta.sourceNote}`}>
            <span className="text-sm italic opacity-70 cursor-help border-b border-dotted">n/a</span>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

function PlayfulMissing({ meta }) {
  return (
    <Tooltip placement="top" className="bg-play-deep text-white" content={`${meta.label} not in free public datasets. ${meta.sourceNote}`}>
      <div className="rounded-2xl bg-white/80 text-play-deep border-2 border-play-deep px-4 py-3 font-playful italic text-lg cursor-help inline-block">
        not reported 🤷
      </div>
    </Tooltip>
  );
}
