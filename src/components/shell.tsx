import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { House, BookOpen, Calculator, Library, UserRound } from "lucide-react";

const TABS = [
  { href: "/", label: "Главная", icon: House },
  { href: "/course", label: "Курс", icon: BookOpen },
  { href: "/practice", label: "Практика", icon: Calculator },
  { href: "/glossary", label: "Справочник", icon: Library },
  { href: "/profile", label: "Профиль", icon: UserRound },
];

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return (
    <div className="min-h-dvh bg-ta-bg text-ta-text">
      <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-4 md:px-8 md:pb-12 md:pt-8">{children}</main>
      <nav
        aria-label="Основная навигация"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ta-line bg-ta-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:static md:mx-auto md:max-w-3xl md:border-0 md:bg-transparent"
      >
        <ul className="mx-auto grid max-w-3xl grid-cols-5 gap-1 px-2 py-2">
          {TABS.map((t) => {
            const active = t.href === "/" ? location === "/" : location.startsWith(t.href);
            const Icon = t.icon;
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-medium transition-colors ${
                    active ? "bg-ta-accent/15 text-ta-accent" : "text-ta-muted hover:text-ta-text"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={22} strokeWidth={active ? 2.4 : 1.9} aria-hidden="true" />
                  <span>{t.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function PageTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <header className="mb-5">
      <h1 className="text-xl font-semibold leading-snug tracking-tight md:text-2xl">{children}</h1>
      {sub && <p className="mt-1 text-sm leading-relaxed text-ta-muted">{sub}</p>}
    </header>
  );
}
