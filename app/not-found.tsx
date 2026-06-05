import Link from "next/link";
export default function NotFound() {
  return (<main className="p-8"><h1 className="text-xl font-bold">Не найдено</h1><Link href="/" className="text-samo-blue">← К атласу</Link></main>);
}
