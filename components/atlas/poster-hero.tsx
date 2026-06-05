export function PosterHero({ title, lead }: { title: string; lead: string }) {
  return (
    <header className="rounded-lg bg-samo-blue p-5 text-white">
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      <p className="mt-1 text-blue-100">{lead}</p>
    </header>
  );
}
