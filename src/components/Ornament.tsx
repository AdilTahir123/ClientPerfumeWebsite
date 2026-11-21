// A thin gold divider with a small eight-point star in the middle (the same star as the background pattern).
export default function Ornament() {
  return (
    <div aria-hidden="true" className="flex items-center gap-4 text-accent">
      <span className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, currentColor)" }} />
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M13 1l3 6.5L23 5l-2.5 7 7 3-7 3 2.5 7-7-2.5L13 25l-3-6.5L3 21l2.5-7L-1.5 13l7-3L3 3l7 2.5z" transform="translate(0.5 0)" />
        <circle cx="13" cy="13" r="2.2" fill="currentColor" />
      </svg>
      <span className="h-px flex-1" style={{ background: "linear-gradient(270deg, transparent, currentColor)" }} />
    </div>
  );
}
