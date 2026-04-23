import { useRef, useState } from 'react';

/**
 * Minimal tooltip. Hover or focus a trigger to show a small info card.
 * Tooltip content is provided via `content`; style comes from `className`.
 */
export function Tooltip({ content, children, className = '', placement = 'top' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const placementClasses =
    placement === 'top'
      ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      : placement === 'bottom'
      ? 'top-full left-1/2 -translate-x-1/2 mt-2'
      : placement === 'right'
      ? 'left-full top-1/2 -translate-y-1/2 ml-2'
      : 'right-full top-1/2 -translate-y-1/2 mr-2';

  return (
    <span
      ref={ref}
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={`absolute z-50 w-64 rounded-md px-3 py-2 text-xs leading-snug shadow-lg pointer-events-none ${placementClasses} ${className}`}
        >
          {content}
        </span>
      )}
    </span>
  );
}

/** Small (i) icon — pair with <Tooltip> for inline explainers. */
export function InfoDot({ className = '' }) {
  return (
    <span
      aria-hidden
      className={`inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-semibold leading-none cursor-help ${className}`}
    >
      i
    </span>
  );
}
