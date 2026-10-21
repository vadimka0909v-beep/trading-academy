import { Link } from "wouter";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { PageTitle } from "../components/shell";
import { useProgress } from "../lib/progress";
import { lessons } from "../content/lessons";
import { modules } from "../content/modules";

export default function Course() {
  const p = useProgress();
  return (
    <>
      <PageTitle sub="Программа идёт от основ к продвинутым концепциям. Модули с пометкой «в разработке» ещё не наполнены.">
        Курс
      </PageTitle>
      <ol className="space-y-3">
        {modules.map((m) => {
          const ls = lessons.filter((l) => l.moduleId === m.id).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
          const ready = ls.length > 0;
          const doneCount = ls.filter((l) => p.completed.includes(l.id)).length;
          return (
            <li key={m.id} className="rounded-2xl border border-ta-line bg-ta-card">
              <details open={ready && m.id <= 1} className="group">
                <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ta-line text-sm font-semibold">{m.id}</span>
                  <span className="flex-1">
                    <span className="block text-[15px] font-semibold leading-snug">{m.title}</span>
                    <span className="mt-0.5 block text-xs text-ta-muted">
                      {ready ? `${doneCount} из ${ls.length} уроков` : "В разработке"}
                    </span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-ta-muted transition-transform group-open:rotate-90" aria-hidden="true" />
                </summary>
                <div className="border-t border-ta-line px-2 py-2">
                  <p className="px-2 pb-2 text-sm leading-relaxed text-ta-muted">{m.summary}</p>
                  {ready ? (
                    <ul>
                      {ls.map((l) => {
                        const done = p.completed.includes(l.id);
                        return (
                          <li key={l.id}>
                            <Link
                              href={`/lesson/${l.id}`}
                              className="flex min-h-14 items-center gap-3 rounded-xl px-2 py-2 hover:bg-ta-line/50"
                            >
                              {done ? (
                                <CheckCircle2 size={20} className="shrink-0 text-ta-up" aria-label="Пройден" />
                              ) : (
                                <Circle size={20} className="shrink-0 text-ta-muted" aria-label="Не пройден" />
                              )}
                              <span className="flex-1">
                                <span className="block text-sm font-medium leading-snug">
                                  {l.id}. {l.title}
                                </span>
                                <span className="text-xs text-ta-muted">
                                  {l.level} · {l.minutes} мин
                                </span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="px-2 pb-3 text-sm text-ta-muted">Уроки этого модуля ещё готовятся. Пока не отмечены как пройденные.</p>
                  )}
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </>
  );
}
