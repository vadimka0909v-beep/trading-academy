import { useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle2, Star, Circle, ListOrdered } from "lucide-react";
import { getLesson, orderedLessonIds } from "../content/lessons";
import type { Block } from "../content/types";
import { modules } from "../content/modules";
import { CandleChart } from "../components/charts";
import { useProgress, toggleCompleted, toggleFavorite, saveQuiz, setLastLesson } from "../lib/progress";
import { useEffect } from "react";

function headingId(i: number) {
  return `sec-${i}`;
}

function BlockView({ block, index }: { block: Block; index: number }) {
  switch (block.t) {
    case "h":
      return (
        <h2 id={headingId(index)} className="mt-7 scroll-mt-20 text-lg font-semibold leading-snug">
          {block.text}
        </h2>
      );
    case "p":
      return <p className="mt-3 text-[16px] leading-[1.7] text-ta-text/90">{block.text}</p>;
    case "list":
      return (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[16px] leading-relaxed text-ta-text/90">
          {block.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      );
    case "formula":
      return (
        <div className="mt-4 rounded-xl border border-ta-accent/30 bg-ta-accent/5 p-4">
          <pre className="whitespace-pre-wrap break-words font-mono text-[15px] leading-relaxed text-ta-text">{block.text}</pre>
          {block.legend && <p className="mt-2 text-sm leading-relaxed text-ta-muted">{block.legend}</p>}
        </div>
      );
    case "example":
      return (
        <div className="mt-4 rounded-xl border border-ta-line bg-ta-card p-4">
          <p className="text-sm font-semibold text-ta-accent">{block.title}</p>
          <p className="mt-1.5 text-[15px] leading-[1.7] text-ta-text/90">{block.text}</p>
        </div>
      );
    case "mistake":
      return (
        <div className="mt-4 rounded-xl border border-ta-down/40 bg-ta-down/5 p-4">
          <p className="text-[15px] leading-[1.7] text-ta-text/90">
            <span className="font-semibold text-ta-down">Типичная ошибка. </span>
            {block.text}
          </p>
        </div>
      );
    case "candle":
      return <CandleChart candles={[{ o: block.o, h: block.h, l: block.l, c: block.c }]} caption={block.caption} annotate />;
    case "series":
      return <CandleChart candles={block.candles} caption={block.caption} />;
  }
}

function Quiz({ lessonId, questions }: { lessonId: string; questions: { q: string; options: string[]; answer: number; explain: string }[] }) {
  const [picked, setPicked] = useState<(number | null)[]>(questions.map(() => null));
  const [checked, setChecked] = useState(false);
  const score = picked.filter((p, i) => p === questions[i].answer).length;

  function check() {
    setChecked(true);
    saveQuiz(lessonId, score, questions.length);
  }
  function reset() {
    setPicked(questions.map(() => null));
    setChecked(false);
  }

  return (
    <div className="space-y-5">
      {questions.map((qq, qi) => (
        <fieldset key={qi} className="rounded-xl border border-ta-line bg-ta-card p-4">
          <legend className="px-1 text-[15px] font-semibold leading-snug">
            {qi + 1}. {qq.q}
          </legend>
          <div className="mt-2 space-y-2">
            {qq.options.map((opt, oi) => {
              const selected = picked[qi] === oi;
              const isRight = checked && oi === qq.answer;
              const isWrong = checked && selected && oi !== qq.answer;
              return (
                <label
                  key={oi}
                  className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-[15px] ${
                    isRight
                      ? "border-ta-up bg-ta-up/10"
                      : isWrong
                        ? "border-ta-down bg-ta-down/10"
                        : selected
                          ? "border-ta-accent bg-ta-accent/10"
                          : "border-ta-line"
                  }`}
                >
                  <input
                    type="radio"
                    aria-label={opt}
                    name={`q-${lessonId}-${qi}`}
                    className="h-4 w-4 accent-[#4FA3FF]"
                    checked={selected}
                    disabled={checked}
                    onChange={() => setPicked((arr) => arr.map((v, i) => (i === qi ? oi : v)))}
                  />
                  <span className="flex-1">{opt}</span>
                  {isRight && <span className="text-xs font-semibold text-ta-up">▲ верно</span>}
                  {isWrong && <span className="text-xs font-semibold text-ta-down">▼ неверно</span>}
                </label>
              );
            })}
          </div>
          {checked && <p className="mt-3 text-sm leading-relaxed text-ta-muted">{qq.explain}</p>}
        </fieldset>
      ))}
      {!checked ? (
        <button
          type="button"
          disabled={picked.some((p) => p === null)}
          onClick={check}
          className="min-h-12 w-full rounded-xl bg-ta-accent px-4 font-semibold text-ta-bg disabled:opacity-40"
        >
          Проверить ответы
        </button>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-ta-line bg-ta-card p-4">
          <p className="text-[15px]">
            Результат: <span className="font-semibold">{score} из {questions.length}</span>
          </p>
          <button type="button" onClick={reset} className="min-h-11 rounded-lg border border-ta-line px-4 text-sm font-medium">
            Пройти снова
          </button>
        </div>
      )}
    </div>
  );
}

export default function LessonPage() {
  const [, params] = useRoute("/lesson/:id");
  const id = params?.id ?? "";
  const lesson = getLesson(id);
  const p = useProgress();

  useEffect(() => {
    if (lesson) setLastLesson(lesson.id);
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  if (!lesson) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg font-semibold">Урок не найден</p>
        <Link href="/course" className="mt-4 inline-block text-ta-accent">
          К курсу
        </Link>
      </div>
    );
  }

  const ids = orderedLessonIds();
  const idx = ids.indexOf(lesson.id);
  const prevId = idx > 0 ? ids[idx - 1] : undefined;
  const nextId = idx < ids.length - 1 ? ids[idx + 1] : undefined;
  const mod = modules.find((m) => m.id === lesson.moduleId);
  const done = p.completed.includes(lesson.id);
  const fav = p.favorites.includes(lesson.id);
  const overall = Math.round(((p.completed.filter((c) => ids.includes(c)).length) / ids.length) * 100);
  const sections = lesson.body.map((b, i) => ({ b, i })).filter((x) => x.b.t === "h");

  return (
    <article className="pb-6">
      <div className="sticky top-0 z-30 -mx-4 mb-4 border-b border-ta-line bg-ta-bg/95 px-4 py-2 backdrop-blur md:-mx-8 md:px-8">
        <div className="flex items-center justify-between gap-2">
          <Link href="/course" className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-ta-muted hover:text-ta-text">
            <ArrowLeft size={18} aria-hidden="true" /> Назад к курсу
          </Link>
          <div className="flex items-center gap-2 text-xs text-ta-muted" aria-label={`Прогресс курса ${overall}%`}>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ta-line">
              <div className="h-full bg-ta-accent" style={{ width: `${overall}%` }} />
            </div>
            {overall}%
          </div>
        </div>
      </div>

      <p className="text-xs uppercase tracking-wide text-ta-muted">
        Модуль {lesson.moduleId}{mod ? ` · ${mod.title}` : ""}
      </p>
      <h1 className="mt-1 text-xl font-semibold leading-snug md:text-2xl">
        {lesson.id}. {lesson.title}
      </h1>
      <p className="mt-2 text-sm text-ta-muted">
        {lesson.level} · {lesson.minutes} мин
      </p>

      <section className="mt-5 rounded-xl border border-ta-line bg-ta-card p-4">
        <h2 className="text-sm font-semibold">Цели урока</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ta-text/90">
          {lesson.goals.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </section>

      {sections.length > 1 && (
        <details className="mt-4 rounded-xl border border-ta-line bg-ta-card p-4">
          <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 text-sm font-semibold">
            <ListOrdered size={18} className="text-ta-accent" aria-hidden="true" /> Оглавление
          </summary>
          <ul className="mt-2 space-y-1">
            {sections.map(({ b, i }) => (
              <li key={i}>
                <a href={`#${headingId(i)}`} className="block min-h-10 py-2 text-sm text-ta-text/90 hover:text-ta-accent">
                  {(b as { text: string }).text}
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-2">
        {lesson.body.map((b, i) => (
          <BlockView key={i} block={b} index={i} />
        ))}
      </div>

      <details className="mt-8 rounded-xl border border-ta-line bg-ta-card p-4" open>
        <summary className="min-h-10 cursor-pointer list-none text-base font-semibold">Словарь терминов ({lesson.terms.length})</summary>
        <dl className="mt-3 space-y-3">
          {lesson.terms.map((t) => (
            <div key={t.term}>
              <dt className="text-sm font-semibold text-ta-accent">{t.term}</dt>
              <dd className="mt-0.5 text-[15px] leading-relaxed text-ta-text/90">{t.def}</dd>
            </div>
          ))}
        </dl>
      </details>

      <section className="mt-8" aria-labelledby="quiz-title">
        <h2 id="quiz-title" className="text-lg font-semibold">Тест</h2>
        <p className="mt-1 text-sm text-ta-muted">Ответьте на все вопросы и проверьте себя. Результат сохраняется в профиле.</p>
        <div className="mt-4">
          <Quiz key={lesson.id} lessonId={lesson.id} questions={lesson.quiz} />
        </div>
        {p.quizResults[lesson.id] && (
          <p className="mt-3 text-xs text-ta-muted">
            Последний сохранённый результат: {p.quizResults[lesson.id].score} из {p.quizResults[lesson.id].total}
          </p>
        )}
      </section>

      <section className="mt-8 rounded-xl border border-ta-line bg-ta-card p-4">
        <h2 className="text-sm font-semibold">Видео по теме</h2>
        <p className="mt-2 text-sm leading-relaxed text-ta-muted">
          Проверенные русскоязычные видео для этого урока пока не добавлены. Ссылки появятся после проверки доступности и соответствия теме.
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-ta-line bg-ta-card p-4">
        <h2 className="text-sm font-semibold">Источники</h2>
        <p className="mt-2 text-sm leading-relaxed text-ta-muted">
          Источники для этого урока ещё не проверены и не указаны. Формулы и примеры рассчитаны вручную внутри урока.
        </p>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => toggleCompleted(lesson.id)}
          className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold ${
            done ? "bg-ta-up/15 text-ta-up" : "bg-ta-accent text-ta-bg"
          }`}
          aria-pressed={done}
        >
          {done ? <CheckCircle2 size={18} aria-hidden="true" /> : <Circle size={18} aria-hidden="true" />}
          {done ? "Пройден" : "Отметить пройденным"}
        </button>
        <button
          type="button"
          onClick={() => toggleFavorite(lesson.id)}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ta-line px-3 text-sm font-medium"
          aria-pressed={fav}
        >
          <Star size={18} className={fav ? "fill-ta-warn text-ta-warn" : ""} aria-hidden="true" />
          {fav ? "В избранном" : "В избранное"}
        </button>
      </div>

      <nav className="mt-4 grid grid-cols-2 gap-3" aria-label="Переход между уроками">
        {prevId ? (
          <Link href={`/lesson/${prevId}`} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ta-line px-3 text-sm font-medium">
            <ArrowLeft size={16} aria-hidden="true" /> Предыдущий
          </Link>
        ) : (
          <span />
        )}
        {nextId ? (
          <Link href={`/lesson/${nextId}`} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ta-line px-3 text-sm font-medium">
            Следующий <ArrowRight size={16} aria-hidden="true" />
          </Link>
        ) : (
          <span className="flex min-h-12 items-center justify-center text-sm text-ta-muted">Последний готовый урок</span>
        )}
      </nav>
      <Link href="/practice" className="mt-3 flex min-h-12 items-center justify-center rounded-xl text-sm font-medium text-ta-accent">
        Перейти к калькуляторам практики
      </Link>
    </article>
  );
}
