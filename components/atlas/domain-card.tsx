import type { DomainSpec } from "@/content/types";

export function DomainCard({ domain }: { domain: DomainSpec }) {
  return (
    <article className="rounded-lg border border-gray-200 p-3">
      <h3 className="font-display font-semibold text-gray-900">
        {domain.title}{domain.toggleable && <span title="feature-toggle" className="ml-1">⚙</span>}{domain.readOnly && <span title="только просмотр" className="ml-1">🔒</span>}
      </h3>
      <ul className="mt-2 list-disc pl-4 text-sm text-gray-700">
        {domain.items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </article>
  );
}
