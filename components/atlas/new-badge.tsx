/**
 * Метка «New» (обновление 08.06): сигнализирует блок, новый относительно прошлого постера (срез 02.06).
 * Рендерится ТОЛЬКО при `isNew` на домене/шаге/связи/модуле — рендер прочих кабинетов не меняется
 * (e2e-голдены не плывут). СНИМАЕТСЯ ПРИ МЕРДЖЕ В master: механический sweep по `isNew` в content/.
 * Сплошная зелёная пилюля (токен --color-new, белый текст, WCAG AA) — визуально отличается от
 * контурных status-бейджей.
 */
export function NewBadge() {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-new px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wide text-white"
      title="Добавлено в обновлении 08.06 (снимается при мердже в master)"
      data-new="true"
    >
      <span aria-hidden="true">🆕</span>New
    </span>
  );
}
