import type { ProcessFlow as Flow } from "@/content/types";

export function ProcessFlow({ flow }: { flow: Flow }) {
  return (
    <section aria-labelledby="core" className="my-6">
      <h2 id="core" className="font-display text-lg font-bold text-samo-blue">
        {flow.title}{flow.badge && <span className="ml-2 rounded bg-orange-100 px-2 py-0.5 text-xs text-samo-orange-d">{flow.badge}</span>}
      </h2>
      {flow.note && <p className="mt-1 text-sm text-gray-600">{flow.note}</p>}
      <ol className="mt-3 flex flex-col gap-3 md:flex-row md:items-stretch">
        {flow.steps.map((s) => (
          <li key={s.n} className="relative flex-1 rounded-lg border-l-4 border-samo-blue bg-blue-50/40 p-3">
            <div className="font-display font-bold text-samo-blue">{s.n}. {s.title}</div>
            <p className="mt-1 text-sm text-gray-700">{s.desc}</p>
            {s.gamification && <p className="mt-1 text-xs text-samo-orange-d">⇒ {s.gamification}</p>}
            {s.source && <p className="mt-1 font-mono text-[11px] text-gray-500">{s.source}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
