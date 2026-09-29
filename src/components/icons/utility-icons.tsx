type IconProps = { className?: string };

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="6" />
      <path d="M13.2 13.2 18 18" strokeLinecap="round" />
    </svg>
  );
}

export function AccountIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden="true">
      <circle cx="10" cy="6.5" r="3.5" />
      <path d="M2.5 18c1.2-4 4.2-6 7.5-6s6.3 2 7.5 6" strokeLinecap="round" />
    </svg>
  );
}

export function WishlistIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden="true">
      <path d="M10 17.2 3.2 10.6a4 4 0 0 1 5.8-5.5L10 6.1l1-1a4 4 0 0 1 5.8 5.5Z" strokeLinejoin="round" />
    </svg>
  );
}

export function BagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden="true">
      <path d="M5.5 7h9l.8 10.2a1 1 0 0 1-1 1.1H5.7a1 1 0 0 1-1-1.1Z" strokeLinejoin="round" />
      <path d="M7.3 7V5.3a2.7 2.7 0 0 1 5.4 0V7" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden="true">
      <path d="M4 4l12 12M16 4 4 16" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden="true">
      <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
    </svg>
  );
}
