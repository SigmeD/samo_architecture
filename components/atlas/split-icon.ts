/**
 * Выделяет ведущий emoji-икон из заголовка домена ("🏠 Главная" → { icon: "🏠", text: "Главная" }).
 * Берёт подстроку до первого пробела; если она начинается с пиктографического символа
 * (вкл. ZWJ-кластеры без пробела внутри, напр. "🧑‍🏫") — это икон-тайл, остальное — текст.
 */
export function splitIcon(title: string): { icon: string | null; text: string } {
  const sp = title.indexOf(" ");
  if (sp > 0) {
    const head = title.slice(0, sp);
    if (/^\p{Extended_Pictographic}/u.test(head)) {
      return { icon: head, text: title.slice(sp + 1) };
    }
  }
  return { icon: null, text: title };
}
