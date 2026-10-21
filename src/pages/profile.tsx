import { Link } from "wouter";
import { PageTitle } from "../components/shell";
import { useProgress, resetProgress } from "../lib/progress";
import { lessons, getLesson, orderedLessonIds } from "../content/lessons";

export default function Profile() {
  const p = useProgress();
  const ids = orderedLessonIds();
  const doneCount = p.completed.filter((id) => ids.includes(id)).length;
  const quizEntries = Object.entries(p.quizResults);
  const weak = quizEntries.filter(([, r]) => r.score < r.total);

  function onReset() {
    if (window.confirm("Сбросить весь прогресс в этом браузере? Пройденные уроки, тесты и избранное будут удалены.")) {
      resetProgress();
    }
  }

  return (
    <>
      <PageTitle sub="Статистика обучения. Всё хранится только в этом браузере.">Профиль</PageTitle>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-ta-line bg-ta-card p-4">
          <p className="text-xs text-ta-muted">Пройдено уроков</p>
          <p className="mt-1 text-2xl font-semibold">{doneCount}</p>
          <p className="text-xs text-ta-muted">из {lessons.length} доступных</p>
        </div>
        <div className="rounded-2xl border border-ta-line bg-ta-card p-4">
          <p className="text-xs text-ta-muted">Тестов пройдено</p>
          <p className="mt-1 text-2xl font-semibold">{quizEntries.length}</p>
          <p className="text-xs text-ta-muted">{weak.length ? `${weak.length} с ошибками` : "без ошибок"}</p>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-ta-line bg-ta-card p-4">
        <h2 className="text-sm font-semibold">Результаты тестов</h2>
        {quizEntries.length === 0 ? (
          <p className="mt-2 text-sm text-ta-muted">Пока нет. Пройдите тест в любом уроке.</p>
        ) : (
          <ul className="mt-2 divide-y divide-ta-line">
            {quizEntries.map(([id, r]) => {
              const l = getLesson(id);
              return (
                <li key={id} className="flex items-center justify-between gap-3 py-3">
                  <Link href={`/lesson/${id}`} className="text-sm text-ta-accent">
                    {id}. {l?.title}
                  </Link>
                  <span className={`shrink-0 text-sm font-semibold ${r.score === r.total ? "text-ta-up" : "text-ta-warn"}`}>
                    {r.score} из {r.total}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        {weak.length > 0 && <p className="mt-3 text-xs leading-relaxed text-ta-muted">Повторите уроки с ошибками: там есть темы, которые стоит перечитать.</p>}
      </section>

      <section className="mt-5 rounded-2xl border border-ta-line bg-ta-card p-4">
        <h2 className="text-sm font-semibold">Избранное</h2>
        {p.favorites.length === 0 ? (
          <p className="mt-2 text-sm text-ta-muted">Отметьте урок звёздочкой, чтобы он появился здесь.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {p.favorites.map((id) => (
              <li key={id}>
                <Link href={`/lesson/${id}`} className="text-sm text-ta-accent">
                  {id}. {getLesson(id)?.title ?? "Урок"}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-5 rounded-2xl border border-ta-line bg-ta-card p-4">
        <h2 className="text-sm font-semibold">Данные</h2>
        <p className="mt-2 text-sm leading-relaxed text-ta-muted">
          Прогресс хранится в localStorage этого браузера. Очистка данных сайта или смена браузера его удалит. Синхронизации между устройствами пока нет.
        </p>
        <button type="button" onClick={onReset} className="mt-3 min-h-12 w-full rounded-xl border border-ta-down/50 text-sm font-semibold text-ta-down">
          Сбросить прогресс
        </button>
      </section>

      <section className="mt-5 rounded-2xl border border-ta-line bg-ta-card p-4 text-sm leading-relaxed text-ta-muted">
        Материалы носят образовательный характер. Они не являются инвестиционной рекомендацией и не гарантируют прибыли. Торговля связана с риском потери капитала.
      </section>
    </>
  );
}
