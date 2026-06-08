/** `hasNew` — кабинет содержит блоки с меткой «New» (обновление 08.06): показать пояснение метки. */
export function Legend({ hasNew = false }: { hasNew?: boolean }) {
  return (
    <aside className="mt-8 rounded border border-gray-200 p-3 text-xs text-gray-600">
      <strong className="text-gray-800">Обозначения:</strong>{" "}
      → поток · ⇒ начисление (солары) · ↩︎ повтор цикла · ← управление сверху ·
      ⚙ под feature-toggle · 🔒 только просмотр · ⚠ расхождение с каноном
      {hasNew && (
        <> · <span className="font-semibold">🆕 New</span> — добавлено в обновлении 08.06 (снимается при мердже в master)</>
      )}
    </aside>
  );
}
