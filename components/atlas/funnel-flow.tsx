export interface FunnelStep { title: string; key?: boolean; win?: boolean; note?: string }
export function FunnelFlow({ steps }: { steps: FunnelStep[] }) {
  return (
    <ol className="my-5 flex flex-col gap-2 md:flex-row md:items-stretch">
      {steps.map((s, i) => (
        <li key={i} className={`flex-1 rounded-lg border p-2 text-sm ${s.key ? "border-samo-orange bg-orange-50" : s.win ? "border-samo-green bg-green-50" : "border-gray-200"}`}>
          <div className="font-medium">{s.title}</div>{s.note && <div className="text-xs text-gray-600">{s.note}</div>}
        </li>
      ))}
    </ol>
  );
}
