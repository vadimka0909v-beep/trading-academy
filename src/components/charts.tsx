// Собственные SVG-графики свечей. Данные синтетические, если не указано иное.
// Цвет никогда не единственный признак: бычья/медвежья свеча также подписаны текстом в подписи.

interface OHLC {
  o: number;
  h: number;
  l: number;
  c: number;
}

const UP = "#3BB273";
const DOWN = "#F0616D";
const GRID = "#1F2B40";
const TEXT = "#8A9BB5";

export function CandleChart({ candles, caption, annotate = false }: { candles: OHLC[]; caption: string; annotate?: boolean }) {
  const W = 320;
  const H = annotate ? 260 : 200;
  const padTop = 16;
  const padBottom = 16;
  const padLeft = 40;
  const padRight = annotate ? 110 : 12;

  const hi = Math.max(...candles.map((c) => c.h));
  const lo = Math.min(...candles.map((c) => c.l));
  const range = hi - lo || 1;
  const innerH = H - padTop - padBottom;
  const innerW = W - padLeft - padRight;
  const y = (p: number) => padTop + ((hi - p) / range) * innerH;
  const step = innerW / candles.length;
  const bodyW = Math.min(18, step * 0.55);

  return (
    <figure className="my-4">
      <div className="overflow-x-auto rounded-xl border border-ta-line bg-ta-card p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full min-w-[280px]" aria-label={caption}>
          {[0, 0.5, 1].map((t) => {
            const price = hi - t * range;
            const yy = padTop + t * innerH;
            return (
              <g key={t}>
                <line x1={padLeft} x2={W - padRight} y1={yy} y2={yy} stroke={GRID} strokeWidth={1} />
                <text x={padLeft - 6} y={yy + 4} fontSize={10} fill={TEXT} textAnchor="end">
                  {price.toFixed(0)}
                </text>
              </g>
            );
          })}
          {candles.map((c, i) => {
            const cx = padLeft + step * i + step / 2;
            const bull = c.c >= c.o;
            const color = bull ? UP : DOWN;
            const top = y(Math.max(c.o, c.c));
            const bottom = y(Math.min(c.o, c.c));
            const bodyH = Math.max(1.5, bottom - top);
            return (
              <g key={i}>
                <line x1={cx} x2={cx} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth={1.5} />
                <rect x={cx - bodyW / 2} y={top} width={bodyW} height={bodyH} fill={color} />
                {!annotate && (
                  <text x={cx} y={H - 2} fontSize={9} fill={TEXT} textAnchor="middle">
                    {i + 1}
                  </text>
                )}
              </g>
            );
          })}
          {annotate && candles.length === 1 && (() => {
            const c = candles[0];
            const cx = padLeft + step / 2;
            const items: { label: string; value: number; color: string }[] = [
              { label: "High", value: c.h, color: TEXT },
              { label: "Open", value: c.o, color: TEXT },
              { label: "Close", value: c.c, color: TEXT },
              { label: "Low", value: c.l, color: TEXT },
            ];
            return items.map((it) => {
              const yy = y(it.value);
              return (
                <g key={it.label}>
                  <line x1={cx + bodyW / 2 + 4} x2={W - padRight + 16} y1={yy} y2={yy} stroke={TEXT} strokeDasharray="3 3" strokeWidth={0.8} />
                  <text x={W - padRight + 20} y={yy + 4} fontSize={11} fill="#E6EDF7">
                    {it.label} {it.value}
                  </text>
                </g>
              );
            });
          })()}
        </svg>
      </div>
      <figcaption className="mt-2 text-xs leading-relaxed text-ta-muted">
        {caption}
        <span className="ml-1 rounded bg-ta-warn/15 px-1.5 py-0.5 text-[10px] text-ta-warn">учебный пример</span>
      </figcaption>
    </figure>
  );
}
