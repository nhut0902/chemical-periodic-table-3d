import { useMemo, useState } from 'react'
import { Search, X, CornerDownLeft } from 'lucide-react'
import { ELEMENTS, formatKelvin, searchElements, type Element } from '../../data/elements'
import { CATEGORIES, type CategoryKey } from '../../data/categories'
import { ElementTile } from './ElementTile'
import { TableLegend } from './TableLegend'

interface PeriodicTableProps {
  onSelect: (element: Element) => void
  selectedZ?: number
}

export function PeriodicTable({ onSelect, selectedZ }: PeriodicTableProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<CategoryKey | null>(null)
  const [hovered, setHovered] = useState<{ element: Element; rect: DOMRect } | null>(null)

  const matches = useMemo(() => {
    const byQuery = new Set(searchElements(query).map((e) => e.z))
    return ELEMENTS.filter(
      (el) => byQuery.has(el.z) && (filter === null || el.category === filter),
    )
  }, [query, filter])

  const matchSet = useMemo(() => new Set(matches.map((e) => e.z)), [matches])
  const isFiltering = query.trim().length > 0 || filter !== null

  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const el of ELEMENTS) map[el.category] = (map[el.category] ?? 0) + 1
    return map
  }, [])

  const tooltip = hovered
    ? (() => {
        const rect = hovered.rect
        const width = 248
        const height = 172
        const vw = window.innerWidth
        const vh = window.innerHeight
        let left = rect.left + rect.width / 2 - width / 2
        left = Math.max(8, Math.min(vw - width - 8, left))
        let top = rect.top - height - 10
        if (top < 8) top = rect.bottom + 10
        if (top + height > vh - 8) top = Math.max(8, vh - height - 8)
        return { left, top, width }
      })()
    : null

  return (
    <section id="table" className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="label-xs mb-2">Bảng tuần hoàn IUPAC · 18 nhóm · 7 chu kỳ</p>
          <h2 className="font-display text-2xl font-medium tracking-tight text-text sm:text-[28px]">
            Toàn bộ 118 nguyên tố
          </h2>
          <p className="mt-1 max-w-xl text-[13px] text-muted">
            Chọn một ô để mở hồ sơ nguyên tố và mô hình nguyên tử 3D. Di chuột để xem thông tin
            nhanh, hoặc dùng bộ lọc theo nhóm.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tên, ký hiệu hoặc số hiệu…"
              aria-label="Tìm nguyên tố trong bảng"
              className="h-10 w-full rounded-md border border-line bg-surface pl-9 pr-9 text-[13px] text-text placeholder:text-faint focus:border-primary/50 focus:outline-none sm:w-[268px]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-faint hover:text-text"
                aria-label="Xoá tìm kiếm"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-line px-1.5 py-0.5 text-[9px] text-faint">
                {matches.length}/118
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <TableLegend active={filter} counts={counts} onChange={setFilter} />
      </div>

      <div className="relative">
        <p className="mb-1.5 flex items-center gap-1.5 text-[10px] text-faint sm:hidden">
          <span aria-hidden>←</span> Kéo ngang để xem đủ 18 nhóm
          <span aria-hidden>→</span>
        </p>
        <div className="table-scroll overflow-x-auto pb-2">
          <div className="min-w-[820px]">
            <div
              className="grid gap-[clamp(2px,0.34vw,5px)]"
              style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
            >
              {Array.from({ length: 18 }, (_, i) => (
                <div
                  key={`gh-${i}`}
                  className="pb-1 text-center font-mono text-[9px] text-faint"
                  style={{ gridColumn: i + 1, gridRow: 1 }}
                >
                  {i + 1}
                </div>
              ))}

              {ELEMENTS.map((el) => (
                <ElementTile
                  key={el.z}
                  element={el}
                  dimmed={isFiltering && !matchSet.has(el.z)}
                  selected={selectedZ === el.z}
                  onSelect={onSelect}
                  onHover={(element, rect) =>
                    setHovered(element && rect ? { element, rect } : null)
                  }
                />
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-0.5 text-[10px] text-faint">
              <p className="flex items-center gap-1.5">
                <CornerDownLeft className="h-3 w-3" aria-hidden />
                Hàng tách biệt bên dưới: 15 lanthanide (57–71) và 15 actinide (89–103) — thuộc
                nhóm f, được trình bày tách ra theo quy ước IUPAC.
              </p>
              <p className="num">{isFiltering ? `${matches.length} kết quả` : '118 nguyên tố'}</p>
            </div>
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-abyss to-transparent sm:hidden"
        />
        {isFiltering && matches.length === 0 && (
          <div className="panel mt-2 flex items-center justify-between gap-3 px-4 py-3 text-sm text-muted">
            Không có nguyên tố nào khớp “{query}”.
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => {
                setQuery('')
                setFilter(null)
              }}
            >
              Xoá bộ lọc
            </button>
          </div>
        )}
      </div>

      {hovered && tooltip && (
        <div
          className="pointer-events-none fixed z-50 hidden rounded-lg border border-line bg-surface/95 p-3 shadow-[var(--shadow-float)] backdrop-blur-sm sm:block"
          style={{ left: tooltip.left, top: tooltip.top, width: tooltip.width }}
          role="tooltip"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg font-semibold leading-none text-text">
                {hovered.element.symbol}
                <span className="ml-2 num text-[10px] font-normal text-faint">
                  Z={hovered.element.z}
                </span>
              </p>
              <p className="mt-1 text-[12px] text-muted">
                {hovered.element.nameVi} · {hovered.element.nameEn}
              </p>
            </div>
            <span
              className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
              style={{ background: CATEGORIES[hovered.element.category].color }}
            />
          </div>
          <dl className="mt-2.5 space-y-1 border-t border-line/70 pt-2 text-[11px]">
            <div className="flex justify-between gap-2">
              <dt className="text-faint">Nguyên tử khối</dt>
              <dd className="num text-text">{hovered.element.mass} u</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-faint">Nhóm / chu kỳ</dt>
              <dd className="num text-text">
                {hovered.element.category === 'lanthanide' || hovered.element.category === 'actinide'
                  ? 'f-block'
                  : hovered.element.group}{' '}
                / {hovered.element.period}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-faint">Nóng chảy</dt>
              <dd className="num text-text">{formatKelvin(hovered.element.melt)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-[10px] text-primary">Nhấn để mở hồ sơ →</p>
        </div>
      )}

      <div className="sr-only" aria-live="polite">
        {isFiltering ? `${matches.length} nguyên tố khớp bộ lọc.` : 'Đang hiển thị 118 nguyên tố.'}
      </div>
    </section>
  )
}
