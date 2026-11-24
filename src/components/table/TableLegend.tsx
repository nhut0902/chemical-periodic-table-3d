import { CATEGORIES, CATEGORY_ORDER, type CategoryKey } from '../../data/categories'

interface TableLegendProps {
  active: CategoryKey | null
  counts: Record<string, number>
  onChange: (key: CategoryKey | null) => void
}

export function TableLegend({ active, counts, onChange }: TableLegendProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Lọc theo nhóm nguyên tố">
      <button
        type="button"
        onClick={() => onChange(null)}
        aria-pressed={active === null}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
          active === null
            ? 'border-primary/50 bg-primary/10 text-primary'
            : 'border-line text-muted hover:border-line/80 hover:text-text'
        }`}
      >
        Tất cả
        <span className="num text-[10px] text-faint">118</span>
      </button>
      {CATEGORY_ORDER.map((key) => {
        const cat = CATEGORIES[key]
        const on = active === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(on ? null : key)}
            aria-pressed={on}
            title={cat.note}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
              on ? 'text-text' : 'border-line text-muted hover:text-text'
            }`}
            style={
              on
                ? { borderColor: `${cat.color}99`, background: cat.tint, color: cat.color }
                : undefined
            }
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: cat.color }} />
            {cat.labelVi}
            <span className="num text-[10px] opacity-60">{counts[key] ?? 0}</span>
          </button>
        )
      })}
    </div>
  )
}
