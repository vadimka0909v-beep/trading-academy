import { useState } from "react";
import { PageTitle } from "../components/shell";

// Все формулы показаны рядом с калькулятором. Результаты без учёта комиссий и проскальзывания, если не сказано иное.

function num(v: string): number {
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function Field({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        inputMode="decimal"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 min-h-12 w-full rounded-xl border border-ta-line bg-ta-bg px-3 text-base text-ta-text outline-none focus:border-ta-accent"
      />
      {hint && <span className="mt-1 block text-xs text-ta-muted">{hint}</span>}
    </label>
  );
}

function Calc({ id, title, formula, children, result }: { id: string; title: string; formula: string; children: React.ReactNode; result: React.ReactNode }) {
  return (
    <section id={id} className="rounded-2xl border border-ta-line bg-ta-card p-4" aria-labelledby={`${id}-t`}>
      <h2 id={`${id}-t`} className="text-base font-semibold">{title}</h2>
      <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-ta-bg p-3 font-mono text-xs leading-relaxed text-ta-muted">{formula}</pre>
      <div className="mt-3 space-y-3">{children}</div>
      <div className="mt-4 rounded-xl border border-ta-accent/30 bg-ta-accent/5 p-3 text-[15px] leading-relaxed" aria-live="polite">
        {result}
      </div>
    </section>
  );
}

function PositionSize() {
  const [capital, setCapital] = useState("10000");
  const [risk, setRisk] = useState("1");
  const [entry, setEntry] = useState("100");
  const [stop, setStop] = useState("95");
  const c = num(capital), r = num(risk), e = num(entry), s = num(stop);
  const riskMoney = (c * r) / 100;
  const dist = Math.abs(e - s);
  const qty = dist > 0 ? riskMoney / dist : NaN;
  const ok = [c, r, e, s].every(Number.isFinite) && dist > 0;
  return (
    <Calc
      id="position"
      title="Размер позиции"
      formula={"Риск в деньгах = Капитал × Риск% / 100\nРазмер = Риск в деньгах / |Вход − Стоп|"}
      result={
        ok ? (
          <>
            <p>Риск в деньгах: <b>{riskMoney.toFixed(2)}</b></p>
            <p>Размер позиции: <b>{qty.toFixed(4)}</b> ед. актива</p>
            <p className="text-sm text-ta-muted">Расстояние до стопа: {dist}. Если стоп сработает, убыток ≈ {riskMoney.toFixed(2)}.</p>
          </>
        ) : (
          "Введите числа. Вход и стоп должны различаться."
        )
      }
    >
      <Field label="Капитал" value={capital} onChange={setCapital} hint="В валюте счёта" />
      <Field label="Риск на сделку, %" value={risk} onChange={setRisk} />
      <Field label="Цена входа" value={entry} onChange={setEntry} />
      <Field label="Цена стоп-лосса" value={stop} onChange={setStop} />
    </Calc>
  );
}

function RiskReward() {
  const [entry, setEntry] = useState("100");
  const [stop, setStop] = useState("95");
  const [target, setTarget] = useState("115");
  const e = num(entry), s = num(stop), t = num(target);
  const risk = Math.abs(e - s), reward = Math.abs(t - e);
  const rr = risk > 0 ? reward / risk : NaN;
  const ok = [e, s, t].every(Number.isFinite) && risk > 0;
  return (
    <Calc
      id="rr"
      title="Risk/Reward и безубыточность"
      formula={"R:R = |Цель − Вход| / |Вход − Стоп|\nБезубыточный Win Rate = 1 / (1 + R:R)"}
      result={
        ok ? (
          <>
            <p>R:R = <b>{rr.toFixed(2)}</b></p>
            <p>Безубыточный Win Rate ≈ <b>{((1 / (1 + rr)) * 100).toFixed(1)}%</b> (без комиссий)</p>
          </>
        ) : (
          "Введите числа. Вход и стоп должны различаться."
        )
      }
    >
      <Field label="Вход" value={entry} onChange={setEntry} />
      <Field label="Стоп" value={stop} onChange={setStop} />
      <Field label="Цель" value={target} onChange={setTarget} />
    </Calc>
  );
}

function Expectancy() {
  const [wr, setWr] = useState("40");
  const [win, setWin] = useState("2");
  const [loss, setLoss] = useState("1");
  const w = num(wr) / 100, aw = num(win), al = num(loss);
  const exp = w * aw - (1 - w) * al;
  const ok = [w, aw, al].every(Number.isFinite);
  return (
    <Calc
      id="expectancy"
      title="Математическое ожидание"
      formula={"E = WR × средний выигрыш − (1 − WR) × средний убыток\nВсё в единицах R"}
      result={
        ok ? (
          <>
            <p>Математическое ожидание: <b>{exp >= 0 ? "▲ " : "▼ "}{exp.toFixed(3)} R</b> на сделку</p>
            <p className="text-sm text-ta-muted">
              {exp > 0 ? "Положительное значение по этим входным данным. Это не гарантия прибыли: нужна проверка на истории и в реальных условиях." : exp < 0 ? "Отрицательное значение: при этих данных система теряет в среднем." : "Ноль: в среднем ни прибыли, ни убытка."}
            </p>
          </>
        ) : (
          "Введите числа."
        )
      }
    >
      <Field label="Win Rate, %" value={wr} onChange={setWr} />
      <Field label="Средний выигрыш, R" value={win} onChange={setWin} />
      <Field label="Средний убыток, R" value={loss} onChange={setLoss} hint="Укажите положительное число" />
    </Calc>
  );
}

function Drawdown() {
  const [dd, setDd] = useState("20");
  const d = num(dd) / 100;
  const ok = Number.isFinite(d) && d >= 0 && d < 1;
  const need = ok ? 1 / (1 - d) - 1 : NaN;
  return (
    <Calc
      id="drawdown"
      title="Просадка и восстановление"
      formula={"Нужный рост = 1 / (1 − Просадка) − 1"}
      result={
        ok ? (
          <>
            <p>Просадка {dd}% требует роста на <b>{(need * 100).toFixed(1)}%</b>, чтобы вернуть капитал.</p>
            <p className="text-sm text-ta-muted">Просадка 50% требует роста на 100%. Глубокие просадки восстанавливаются тяжело.</p>
          </>
        ) : (
          "Введите просадку от 0 до 99,9%."
        )
      }
    >
      <Field label="Просадка, %" value={dd} onChange={setDd} />
    </Calc>
  );
}

function Margin() {
  const [qty, setQty] = useState("100");
  const [price, setPrice] = useState("50");
  const [lev, setLev] = useState("10");
  const [rate, setRate] = useState("0.1");
  const q = num(qty), p = num(price), l = num(lev), rt = num(rate);
  const notional = q * p;
  const margin = notional / l;
  const commission = (notional * rt) / 100 * 2;
  const ok = [q, p, l, rt].every(Number.isFinite) && l > 0;
  return (
    <Calc
      id="margin"
      title="Маржа, плечо и комиссия"
      formula={"Номинал = Количество × Цена\nМаржа = Номинал / Плечо\nКомиссия = Номинал × Ставка% × 2 (вход и выход)"}
      result={
        ok ? (
          <>
            <p>Номинал позиции: <b>{notional.toFixed(2)}</b></p>
            <p>Необходимое обеспечение (маржа): <b>{margin.toFixed(2)}</b></p>
            <p>Комиссия туда и обратно: <b>{commission.toFixed(2)}</b></p>
            <p className="text-sm text-ta-muted">При плече {l} небольшое движение против позиции может быстро съесть обеспечение. Ликвидация зависит от правил брокера.</p>
          </>
        ) : (
          "Введите числа. Плечо должно быть больше нуля."
        )
      }
    >
      <Field label="Количество" value={qty} onChange={setQty} />
      <Field label="Цена" value={price} onChange={setPrice} />
      <Field label="Плечо, x" value={lev} onChange={setLev} />
      <Field label="Ставка комиссии, %" value={rate} onChange={setRate} hint="Берётся из условий вашего брокера" />
    </Calc>
  );
}

function Forex() {
  const [riskMoney, setRiskMoney] = useState("100");
  const [pips, setPips] = useState("20");
  const [pipValue, setPipValue] = useState("10");
  const rm = num(riskMoney), pp = num(pips), pv = num(pipValue);
  const ok = [rm, pp, pv].every(Number.isFinite) && pp > 0 && pv > 0;
  const lots = ok ? rm / (pp * pv) : NaN;
  return (
    <Calc
      id="forex"
      title="Лоты Forex по пипсам"
      formula={"Лоты = Риск в деньгах / (Стоп в пипсах × Стоимость пипса за 1 лот)"}
      result={
        ok ? (
          <>
            <p>Размер позиции: <b>{lots.toFixed(3)}</b> лота</p>
            <p className="text-sm text-ta-muted">
              Стоимость пипса для 1 стандартного лота зависит от пары и валюты счёта. Значение 10 — пример для пары с котировкой в USD при счёте в USD. Проверяйте спецификацию своего брокера.
            </p>
          </>
        ) : (
          "Введите числа больше нуля."
        )
      }
    >
      <Field label="Риск в деньгах" value={riskMoney} onChange={setRiskMoney} />
      <Field label="Стоп, пипсов" value={pips} onChange={setPips} />
      <Field label="Стоимость 1 пипса для 1 лота" value={pipValue} onChange={setPipValue} hint="Не одна и та же для всех инструментов" />
    </Calc>
  );
}

export default function Practice() {
  return (
    <>
      <PageTitle sub="Калькуляторы с формулами. Проверяйте входные данные и спецификацию своего инструмента.">Практика</PageTitle>
      <nav className="mb-5 flex gap-2 overflow-x-auto pb-1 text-sm" aria-label="Калькуляторы">
        {[
          ["#position", "Позиция"],
          ["#rr", "R:R"],
          ["#expectancy", "Ожидание"],
          ["#drawdown", "Просадка"],
          ["#margin", "Маржа"],
          ["#forex", "Forex"],
        ].map(([href, label]) => (
          <a key={href} href={href} className="min-h-10 shrink-0 rounded-full border border-ta-line px-4 py-2 text-ta-muted hover:text-ta-text">
            {label}
          </a>
        ))}
      </nav>
      <div className="space-y-4">
        <PositionSize />
        <RiskReward />
        <Expectancy />
        <Drawdown />
        <Margin />
        <Forex />
      </div>
    </>
  );
}
