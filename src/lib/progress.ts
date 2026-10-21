import { useSyncExternalStore } from "react";

// Прогресс хранится в localStorage этого браузера и устройства.
// Он НЕ синхронизируется между устройствами и может быть потерян при очистке данных браузера.

export interface QuizResult {
  score: number;
  total: number;
  at: string;
}

export interface Progress {
  completed: string[];
  lastLesson?: string;
  quizResults: Record<string, QuizResult>;
  favorites: string[];
}

const KEY = "trading-academy-progress-v1";
const EMPTY: Progress = { completed: [], quizResults: {}, favorites: [] };

let cache: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

function write(next: Progress) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Хранилище может быть недоступно (приватный режим) — прогресс останется в памяти до перезагрузки.
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, read);
}

export function update(fn: (p: Progress) => Progress) {
  write(fn(read()));
}

export function toggleCompleted(lessonId: string) {
  update((p) => ({
    ...p,
    completed: p.completed.includes(lessonId)
      ? p.completed.filter((id) => id !== lessonId)
      : [...p.completed, lessonId],
  }));
}

export function setLastLesson(lessonId: string) {
  update((p) => (p.lastLesson === lessonId ? p : { ...p, lastLesson: lessonId }));
}

export function toggleFavorite(lessonId: string) {
  update((p) => ({
    ...p,
    favorites: p.favorites.includes(lessonId)
      ? p.favorites.filter((id) => id !== lessonId)
      : [...p.favorites, lessonId],
  }));
}

export function saveQuiz(lessonId: string, score: number, total: number) {
  update((p) => ({
    ...p,
    quizResults: {
      ...p.quizResults,
      [lessonId]: { score, total, at: new Date().toISOString() },
    },
  }));
}

export function resetProgress() {
  write(EMPTY);
}
