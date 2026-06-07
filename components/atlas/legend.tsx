export function Legend() {
  return (
    <aside className="mt-8 rounded border border-gray-200 p-3 text-xs text-gray-600">
      <strong className="text-gray-800">Обозначения:</strong>{" "}
      → поток · ⇒ начисление (солары) · ↩︎ повтор цикла · ← управление сверху ·
      ⚙ под feature-toggle · 🔒 только просмотр · ⚠ расхождение с каноном
    </aside>
  );
}
