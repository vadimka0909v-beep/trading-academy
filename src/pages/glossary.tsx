import { useMemo, useState } from "react";
import { Link } from "wouter";
import { PageTitle } from "../components/shell";
import { lessons } from "../content/lessons";

export default function Glossary() {
  const [q, setQ] = useState("");
  const items = useMemo(() => {
    const all = lessons.flatMap((l) => l.terms.map((t) => ({ ...t, lessonId: l.id, lessonTitle: l.title })));
    const map = new Map<string, (typeof all)[number]>();
    for (const it of all) if (!map.has(it.term)) map.set(it.term, it);
    const arr = [...map.values()].sort((a, b) => a.term.localeCompare(b.term, "ru"));
    const s = q.trim().toLowerCase();
    return s ? arr.filter((t) => t.term.toLowerCase().includes(s) || t.def.toLowerCase().includes(s)) : arr;
  }, [q]);

  return (
    <>
      <PageTitle sub="Термины из уроков. Для каждого указан урок, где он объясняется.">Справочник</PageTitle>
      <label className="block">
        <span className="sr-only">Поиск термина</span>
        <input
          type="search"
          aria-label="Поиск термина"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Найти термин или слово в определении"
          className="min-h-12 w-full rounded-xl border border-ta-line bg-ta-card px-4 text-base text-ta-text outline-none placeholder:text-ta-muted focus:border-ta-accent"
        />
      </label>
      <p className="mt-3 text-xs text-ta-muted">Найдено: {items.length}</p>
      <ul className="mt-3 space-y-2">
        {items.map((t) => (
          <li key={t.term} className="rounded-xl border border-ta-line bg-ta-card p-4">
            <p className="font-semibold">{t.term}</p>
            <p className="mt-1 text-sm leading-relaxed text-ta-text/90">{t.def}</p>
            <Link href={`/lesson/${t.lessonId}`} className="mt-2 inline-block min-h-8 py-1 text-sm text-ta-accent">
              Урок {t.lessonId}: {t.lessonTitle}
            </Link>
          </li>
        ))}
        {items.length === 0 && <li className="py-8 text-center text-sm text-ta-muted">Ничего не найдено. Попробуйте другое слово.</li>}
      </ul>
    </>
  );
}
