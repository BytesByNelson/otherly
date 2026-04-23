const THEMES = [
  { key: 'editorial', label: 'Editorial' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'atlas', label: 'Atlas' },
  { key: 'playful', label: 'Playful' },
];

export function ThemeToggle({ theme, onChange, classes = {} }) {
  return (
    <div className={`inline-flex items-center ${classes.wrapper || ''}`} role="tablist" aria-label="Visual theme">
      {THEMES.map((t, i) => {
        const active = t.key === theme;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.key)}
            className={`${classes.item || ''} ${active ? classes.active || '' : classes.inactive || ''} ${
              i === 0 ? classes.first || '' : ''
            } ${i === THEMES.length - 1 ? classes.last || '' : ''}`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export { THEMES };
