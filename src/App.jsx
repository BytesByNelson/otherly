import { useEffect, useMemo, useState } from 'react';
import countriesData from './data/countries.json';
import { buildLensView } from './lib/transform.js';
import { EditorialView } from './components/themes/EditorialView.jsx';
import { DashboardView } from './components/themes/DashboardView.jsx';
import { AtlasView } from './components/themes/AtlasView.jsx';
import { PlayfulView } from './components/themes/PlayfulView.jsx';

const THEME_VIEWS = {
  editorial: EditorialView,
  dashboard: DashboardView,
  atlas: AtlasView,
  playful: PlayfulView,
};

const DEFAULT_A = 'USA';
const DEFAULT_B = 'AUS';
const DEFAULT_THEME = 'editorial';

function readHash() {
  try {
    const raw = window.location.hash.replace(/^#/, '');
    if (!raw) return {};
    const params = new URLSearchParams(raw);
    return {
      a: params.get('a') || undefined,
      b: params.get('b') || undefined,
      theme: params.get('theme') || undefined,
    };
  } catch {
    return {};
  }
}

export default function App() {
  const countries = countriesData.countries;
  const countriesSorted = useMemo(
    () => [...countries].sort((x, y) => x.name.localeCompare(y.name)),
    [countries]
  );

  const initial = readHash();
  const [selectedA, setSelectedA] = useState(initial.a || DEFAULT_A);
  const [selectedB, setSelectedB] = useState(initial.b || DEFAULT_B);
  const [theme, setTheme] = useState(
    THEME_VIEWS[initial.theme] ? initial.theme : DEFAULT_THEME
  );

  // Sync state into URL hash so views are shareable.
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedA) params.set('a', selectedA);
    if (selectedB) params.set('b', selectedB);
    if (theme) params.set('theme', theme);
    const newHash = `#${params.toString()}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, [selectedA, selectedB, theme]);

  const countryA = useMemo(
    () => countries.find((c) => c.code === selectedA) || null,
    [countries, selectedA]
  );
  const countryB = useMemo(
    () => countries.find((c) => c.code === selectedB) || null,
    [countries, selectedB]
  );

  const lens = useMemo(
    () => (countryA && countryB ? buildLensView(countryA, countryB) : null),
    [countryA, countryB]
  );

  const ThemeView = THEME_VIEWS[theme] || EditorialView;

  return (
    <ThemeView
      countries={countriesSorted}
      selectedA={selectedA}
      selectedB={selectedB}
      setSelectedA={setSelectedA}
      setSelectedB={setSelectedB}
      theme={theme}
      setTheme={setTheme}
      countryA={countryA}
      countryB={countryB}
      lens={lens}
    />
  );
}
