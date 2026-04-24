import { useState } from 'react';
import profilesData from '../data/profiles.json';
import { Tooltip, InfoDot } from './Tooltip.jsx';

const HEALTHCARE_LABELS = {
  universal_public: 'Universal public',
  single_payer: 'Single-payer',
  mandatory_multi_payer: 'Mandatory multi-payer',
  mixed_public_private: 'Mixed public/private',
  primarily_private: 'Primarily private',
  limited: 'Limited coverage',
};

const HEALTHCARE_TOOLTIPS = {
  universal_public: 'Single-payer system funded through taxes, free at point of use (e.g. UK NHS).',
  single_payer: 'Government-administered insurance covering all residents (e.g. Canada).',
  mandatory_multi_payer: 'Compulsory insurance through multiple competing funds (e.g. Germany, Switzerland).',
  mixed_public_private: 'Significant public program with a parallel private system (e.g. Australia).',
  primarily_private: 'Private market dominant with targeted public programs (e.g. USA with Medicare/Medicaid).',
  limited: 'Public coverage is limited; most care is out-of-pocket or employer-provided.',
};

const FIELDS = [
  { key: 'capital', label: 'Capital' },
  { key: 'government', label: 'Government' },
  { key: 'population', label: 'Population' },
  { key: 'area', label: 'Area' },
  { key: 'density', label: 'Pop. density' },
  { key: 'urban', label: 'Urbanization' },
  { key: 'languages', label: 'Official languages' },
  { key: 'religions', label: 'Major religions' },
  { key: 'healthcare', label: 'Healthcare system' },
  { key: 'literacy', label: 'Literacy rate' },
  { key: 'internet', label: 'Internet users' },
  { key: 'drives', label: 'Drives on' },
  { key: 'exports', label: 'Top exports' },
  { key: 'imports', label: 'Top imports' },
  { key: 'partners', label: 'Top trade partners' },
  { key: 'labor', label: 'Labor force split' },
  { key: 'notable', label: 'Notable' },
];

/** Get formatted display value for a given profile + field key. */
export function getProfileValue(profile, key) {
  if (!profile) return null;
  switch (key) {
    case 'capital': return profile.capital;
    case 'government': return profile.government;
    case 'population': return `${profile.population_millions.toLocaleString()} million`;
    case 'area': return `${profile.area_km2.toLocaleString()} km²`;
    case 'density': return `${profile.population_density_per_km2.toLocaleString()} per km²`;
    case 'urban': return `${profile.urbanization_pct}%`;
    case 'languages': return profile.official_languages.join(', ');
    case 'religions': return profile.major_religions.slice(0, 3).join(', ');
    case 'healthcare': return HEALTHCARE_LABELS[profile.healthcare_system] || profile.healthcare_system;
    case 'literacy': return `${profile.literacy_pct}%`;
    case 'internet': return `${profile.internet_users_pct}%`;
    case 'drives': return profile.drives_on === 'left' ? 'Left' : 'Right';
    case 'exports': return profile.top_exports.join(' · ');
    case 'imports': return profile.top_imports.join(' · ');
    case 'partners': return profile.top_trade_partners.join(' · ');
    case 'labor': {
      const l = profile.labor_force_pct;
      return `Ag ${l.agriculture}% · Ind ${l.industry}% · Svc ${l.services}%`;
    }
    case 'notable': return profile.notable;
    default: return null;
  }
}

export function getProfile(code) {
  return profilesData.profiles[code] || null;
}

export function getHealthcareTooltip(system) {
  return HEALTHCARE_TOOLTIPS[system] || null;
}

/**
 * Shared CountryProfile section — expandable, renders two profiles side-by-side.
 *
 * Each theme passes a `classes` prop with theme-specific styling, and a
 * `renderField` function that can override the default row layout per theme.
 * Falls back to a neutral default layout if overrides aren't provided.
 */
export function CountryProfile({
  countryA, countryB, classes = {}, defaultOpen = false, sectionLabel = 'Country profiles',
}) {
  const [open, setOpen] = useState(defaultOpen);
  const profileA = countryA ? getProfile(countryA.code) : null;
  const profileB = countryB ? getProfile(countryB.code) : null;

  if (!profileA || !profileB) return null;

  return (
    <section className={classes.section || ''}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between ${classes.toggle || ''}`}
        aria-expanded={open}
      >
        <span className={classes.toggleLabel || ''}>
          {sectionLabel}
          <span className={classes.toggleCount || 'ml-2 opacity-60'}>
            ({FIELDS.length} fields)
          </span>
        </span>
        <span className={classes.toggleIcon || ''} aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className={classes.body || 'mt-6'}>
          <div className={classes.headerRow || 'grid grid-cols-[minmax(120px,180px)_1fr_1fr] gap-4 border-b pb-2 mb-4 text-xs uppercase tracking-widest opacity-60'}>
            <div>Field</div>
            <div>{countryA.flag} {countryA.name}</div>
            <div>{countryB.flag} {countryB.name}</div>
          </div>
          <div className={classes.rows || 'divide-y'}>
            {FIELDS.map((field) => (
              <ProfileRow
                key={field.key}
                field={field}
                profileA={profileA}
                profileB={profileB}
                classes={classes}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ProfileRow({ field, profileA, profileB, classes }) {
  const valueA = getProfileValue(profileA, field.key);
  const valueB = getProfileValue(profileB, field.key);

  // Healthcare gets a tooltip explaining the taxonomy.
  const showHealthcareTooltip = field.key === 'healthcare';

  return (
    <div className={classes.row || 'grid grid-cols-[minmax(120px,180px)_1fr_1fr] gap-4 py-3 items-start'}>
      <div className={classes.rowLabel || 'text-xs uppercase tracking-widest opacity-60 pt-0.5'}>
        {field.label}
        {showHealthcareTooltip && (
          <Tooltip
            placement="right"
            className={classes.tooltip || 'bg-black text-white'}
            content="Broad taxonomy — every country's system has nuance this label simplifies. Hover values for details."
          >
            <span className="ml-1 inline-block">
              <InfoDot className={classes.infoDot || 'border-current text-current opacity-70'} />
            </span>
          </Tooltip>
        )}
      </div>
      <ProfileValue
        value={valueA}
        field={field}
        profile={profileA}
        classes={classes}
      />
      <ProfileValue
        value={valueB}
        field={field}
        profile={profileB}
        classes={classes}
      />
    </div>
  );
}

function ProfileValue({ value, field, profile, classes }) {
  if (value == null) return <div className={classes.rowValue || 'opacity-50 italic'}>—</div>;

  // Spoken languages note dangles off the "languages" row.
  if (field.key === 'languages' && profile.spoken_languages_note) {
    return (
      <div className={classes.rowValue || ''}>
        <div>{value}</div>
        <div className={classes.noteText || 'text-xs opacity-60 italic mt-1'}>
          {profile.spoken_languages_note}
        </div>
      </div>
    );
  }

  // Healthcare gets a tooltip explaining the specific taxonomy label.
  if (field.key === 'healthcare') {
    const tooltip = getHealthcareTooltip(profile.healthcare_system);
    return (
      <div className={classes.rowValue || ''}>
        <Tooltip
          placement="top"
          className={classes.tooltip || 'bg-black text-white'}
          content={tooltip}
        >
          <span className="inline-flex items-center gap-1 cursor-help border-b border-dotted border-current">
            {value}
          </span>
        </Tooltip>
      </div>
    );
  }

  return <div className={classes.rowValue || ''}>{value}</div>;
}
