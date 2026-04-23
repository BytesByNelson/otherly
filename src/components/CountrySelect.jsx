import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Searchable country combobox. Accessible keyboard navigation, theme-aware via class props.
 *
 * Props:
 *  - countries: [{ code, name, flag, ... }]
 *  - value: selected country code | null
 *  - onChange: (code) => void
 *  - label: visible label
 *  - placeholder: input placeholder
 *  - classes: { wrapper, button, panel, option, input, label, flag }
 */
export function CountrySelect({ countries, value, onChange, label, placeholder = 'Select a country…', classes = {} }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const rootRef = useRef(null);

  const selected = useMemo(
    () => countries.find((c) => c.code === value) || null,
    [countries, value]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [countries, query]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query, open]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = filtered[activeIdx];
      if (pick) {
        onChange(pick.code);
        setOpen(false);
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={rootRef} className={`relative ${classes.wrapper || ''}`}>
      {label && <div className={classes.label || 'mb-2 text-xs uppercase tracking-widest opacity-70'}>{label}</div>}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-3 text-left ${classes.button || ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3 truncate">
          {selected ? (
            <>
              <span className={classes.flag || 'text-2xl'}>{selected.flag}</span>
              <span className="truncate">{selected.name}</span>
            </>
          ) : (
            <span className="opacity-50">{placeholder}</span>
          )}
        </span>
        <span aria-hidden className="ml-2 opacity-60">▾</span>
      </button>

      {open && (
        <div className={`absolute left-0 right-0 z-40 mt-2 overflow-hidden ${classes.panel || ''}`}>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type to search…"
            className={classes.input || 'w-full border-b px-3 py-2 text-sm outline-none bg-transparent'}
            aria-label="Search countries"
          />
          <ul
            role="listbox"
            className="max-h-72 overflow-y-auto"
          >
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm opacity-50">No matches</li>
            )}
            {filtered.map((c, i) => (
              <li key={c.code} role="option" aria-selected={i === activeIdx}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                    setQuery('');
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left ${
                    i === activeIdx ? classes.optionActive || 'bg-black/5' : ''
                  } ${classes.option || ''}`}
                >
                  <span className={classes.flag || 'text-xl'}>{c.flag}</span>
                  <span className="truncate">{c.name}</span>
                  <span className="ml-auto text-xs opacity-40 font-mono">{c.code}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
