import Link from "next/link";

export interface Crumb { label: string; href?: string }
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="mb-4 text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-gray-600">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {c.href ? <Link href={c.href} className="text-samo-blue hover:underline">{c.label}</Link>
                    : <span aria-current="page" className="font-medium text-gray-900">{c.label}</span>}
            {i < items.length - 1 && <span aria-hidden="true" className="text-gray-400">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
