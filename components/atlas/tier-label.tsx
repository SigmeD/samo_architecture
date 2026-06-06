export function TierLabel({ children }: { children: string }) {
  return (
    <div className="mt-4 mb-2.5 flex items-center gap-2.5 font-display text-xs font-extrabold uppercase tracking-[2px] text-faint">
      {children}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
