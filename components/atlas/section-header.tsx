export function SectionHeader({ no, title, caption }: { no: string; title: string; caption?: string }) {
  return (
    <div className="mt-7 mb-4 flex items-center gap-3.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-samo-blue font-display text-sm font-extrabold text-white">{no}</span>
      <h2 className="whitespace-nowrap font-display text-xl font-extrabold text-samo-blue-d">{title}</h2>
      {caption && <span className="text-xs text-muted">{caption}</span>}
      <span className="h-px flex-1 bg-gradient-to-r from-line to-transparent" />
    </div>
  );
}
