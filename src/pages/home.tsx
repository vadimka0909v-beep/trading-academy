import { Link } from "wouter";
import { ArrowRight, Calculator, Library } from "lucide-react";
import { PageTitle } from "../components/shell";
import { useProgress } from "../lib/progress";
import { lessons, orderedLessonIds, getLesson } from "../content/lessons";
import { modules } from "../content/modules";

export default function Home() {
  const p = useProgress();
  const ids = orderedLessonIds();
  const done = ids.filter((id) => p.completed.includes(id)).length;
  const next = p.lastLesson && getLesson(p.lastLesson) ? p.lastLesson : ids.find((id) => !p.completed.includes(id));
  const nextLesson = next ? getLesson(next) : undefined;
  const modulesWithLessons = new Set(lessons.map((l) => l.moduleId)).size;
  const percent = ids.length ? Math.round((done / ids.length) * 100) : 0;

  return (
    <>
      <PageTitle sub="Курс от основ финансов до продвинутых концепций. Уроки на русском, с примерами и тестами.">
        Trading Academy
      </PageTitle>

      <section className="rounded-2xl border border-ta-line bg-ta-card p-5">
        <p className="text-xs uppercase tracking-wide text-ta-muted">Продолжить</p>
        {nextLesson ? (
          <>
            <h2 className="mt-1 text-lg font-semibold leading-snug">
              {nextLesson.id}. {nextLesson.title}
            </h2>
            <p className="mt-1 text-sm text-ta-muted">
              Модуль {nextLesson.moduleId} · {nextLesson.minutes} мин · {nextLesson.level}
            </p>
            <Link
              href={`/lesson/${nextLesson.id}`}
              className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ta-accent px-4 text-base font-semibold text-ta-bg"
            >
              Продолжить урок <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </>
        ) : (
          <p className="mt-1 text-sm text-ta-muted">Все доступные уроки пройдены. Следующие модули появятся по мере наполнения курса.</p>
        )}
      </section>

      <section className="mt-4 rounded-2xl border border-ta-line bg-ta-card p-5" aria-labelledby="progress-title">
        <div className="flex items-baseline justify-between">
          <h2 id="progress-title" className="text-sm font-semibold">Ваш прогресс</h2>
          <span className="text-sm text-ta-muted">
            {done} из {ids.length} уроков
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-ta-line" aria-hidden="true">
          <div className="h-full rounded-full bg-ta-accent transition-all" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ta-muted">
          Прогресс сохраняется в этом браузере. На другом устройстве он не появится.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-ta-line bg-ta-card p-5">
        <h2 className="text-sm font-semibold">Состояние курса</h2>
        <p className="mt-2 text-sm leading-relaxed text-ta-muted">
          В программе {modules.length} модулей. С уроками сейчас {modulesWithLessons} из {modules.length}: остальные в разработке и не отмечаются как готовые.
        </p>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link href="/practice" className="flex min-h-24 flex-col justify-between rounded-2xl border border-ta-line bg-ta-card p-4 hover:border-ta-accent">
          <Calculator size={22} className="text-ta-accent" aria-hidden="true" />
          <span className="text-sm font-semibold">Калькуляторы</span>
          <span className="text-xs text-ta-muted">Риск, позиция, R:R</span>
        </Link>
        <Link href="/glossary" className="flex min-h-24 flex-col justify-between rounded-2xl border border-ta-line bg-ta-card p-4 hover:border-ta-accent">
          <Library size={22} className="text-ta-accent" aria-hidden="true" />
          <span className="text-sm font-semibold">Справочник</span>
          <span className="text-xs text-ta-muted">Термины и поиск</span>
        </Link>
      </div>
    </>
  );
}
