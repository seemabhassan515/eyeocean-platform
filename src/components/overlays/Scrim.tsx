export function Scrim({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      className="fixed inset-0 z-40 bg-eo-obsidian/40"
    />
  );
}
