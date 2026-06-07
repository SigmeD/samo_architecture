import type { ImplStatus } from "@/content/types";

const MAP: Record<ImplStatus, { label: string; cls: string; icon: string }> = {
  done:      { label: "реализовано", cls: "border-samo-green text-samo-green-d bg-green-50", icon: "✓" },
  partial:   { label: "частично", cls: "border-samo-orange text-samo-orange-d bg-orange-50", icon: "⚙" },
  planned:   { label: "план", cls: "border-samo-blue/40 text-samo-blue-d bg-blue-50 border-dashed", icon: "⏳" },
  divergent: { label: "расхождение с каноном", cls: "border-status-divergent text-status-divergent bg-red-50", icon: "⚠" },
};

export function ImplStatusBadge({ status, title }: { status: ImplStatus; title?: string }) {
  const s = MAP[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-medium ${s.cls}`} title={title} data-status={status}>
      <span aria-hidden="true">{s.icon}</span>{s.label}
    </span>
  );
}
