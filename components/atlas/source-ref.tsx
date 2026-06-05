import type { SourceCitation } from "@/content/types";

export function SourceRef({ sources }: { sources: SourceCitation[] }) {
  if (!sources.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1 text-xs">
      <span className="text-gray-500">Источники:</span>
      {sources.map((s) => (
        <code key={s.id + s.version} className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[11px] text-gray-700">
          {s.id} v{s.version}{s.section ? ` §${s.section}` : ""}
        </code>
      ))}
    </div>
  );
}
