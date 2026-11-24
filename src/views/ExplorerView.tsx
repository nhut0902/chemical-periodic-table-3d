import { lazy, Suspense, useMemo, useState } from 'react'
import { Search, Info, MousePointer2, Layers } from 'lucide-react'
import { CATEGORIES } from '../data/categories'
import { BY_Z, ELEMENTS, SHELL_COLORS, SHELL_NAMES, type Element } from '../data/elements'

const AtomStage = lazy(() =>
  import('../three/AtomStage').then((m) => ({ default: m.AtomStage })),
)

const QUICK = [1, 6, 8, 13, 26, 29, 47, 79, 92]

function StageSkeleton() {
  return (
    <div className="panel flex h-[clamp(360px,58vh,640px)] items-center justify-center">
      <div className="flex items-center gap-2 text-[11px] text-faint">
        <span className="h-3 w-3 animate-spin rounded-full border border-primary/30 border-t-primary" />
        Đang tải không gian 3D…
      </div>
    </div>
  )
}

export function ExplorerView({
  element,
  onSelect,
}: {
  element: Element
  onSelect: (el: Element) => void
}) {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'bohr' | 'orbital'>('bohr')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ELEMENTS
    return ELEMENTS.filter(
      (e) =>
        e.symbol.toLowerCase().includes(q) ||
        e.nameVi.toLowerCase().includes(q) ||
        e.nameEn.toLowerCase().includes(q) ||
        String(e.z).startsWith(q),
    )
  }, [query])

  const cat = CATEGORIES[element.category]

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-8 sm:px-6">
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="label-xs mb-2">3D element explorer</p>
          <h1 className="font-display text-[30px] font-medium tracking-tight text-text sm:text-[36px]">
            Khám phá nguyên tử
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            Mô hình nguyên tử kích thước lớn dựng bằng Three.js. Xoay 360°, zoom vào từng thành
            phần, chuyển giữa mô hình Bohr minh hoạ và đám mây orbital xác suất.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK.map((z) => {
            const el = BY_Z.get(z)!
            const on = el.z === element.z
            return (
              <button
                key={z}
                type="button"
                onClick={() => onSelect(el)}
                className={`h-8 min-w-8 rounded-md border px-2 font-display text-[12px] transition-colors ${
                  on ? 'border-primary/60 bg-primary/10 text-primary' : 'border-line text-muted hover:text-text'
                }`}
                title={`${el.nameVi} (${el.symbol})`}
              >
                {el.symbol}
              </button>
            )
          })}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
        {/* Picker */}
        <aside className="panel order-2 overflow-hidden lg:order-1">
          <div className="border-b border-line p-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm nguyên tố…"
                aria-label="Tìm nguyên tố trong danh sách"
                className="h-8 w-full rounded border border-line bg-abyss-soft pl-8 pr-2 text-[11px] text-text placeholder:text-faint focus:border-primary/50 focus:outline-none"
              />
            </div>
          </div>
          <ul className="max-h-[280px] overflow-y-auto p-1.5 lg:max-h-[520px]">
            {list.map((el) => {
              const on = el.z === element.z
              return (
                <li key={el.z}>
                  <button
                    type="button"
                    onClick={() => onSelect(el)}
                    className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] transition-colors ${
                      on ? 'bg-surface-2 text-text' : 'text-muted hover:bg-surface-2/60 hover:text-text'
                    }`}
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: CATEGORIES[el.category].color }}
                    />
                    <span className="num w-6 shrink-0 text-[10px] text-faint">{el.z}</span>
                    <span className="w-6 shrink-0 font-display text-[11px]">{el.symbol}</span>
                    <span className="truncate">{el.nameVi}</span>
                  </button>
                </li>
              )
            })}
            {list.length === 0 && (
              <li className="px-2 py-3 text-[11px] text-faint">Không tìm thấy nguyên tố.</li>
            )}
          </ul>
        </aside>

        {/* Stage */}
        <div className="order-1 min-w-0 lg:order-2">
          <Suspense fallback={<StageSkeleton />}>
            <AtomStage
              key={element.z}
              element={element}
              variant="stage"
              defaultMode="bohr"
              onModeChange={setMode}
            />
          </Suspense>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[10px] text-faint">
            <span className="inline-flex items-center gap-1.5">
              <MousePointer2 className="h-3 w-3" /> kéo để xoay · cuộn để zoom · kéo hai ngón để pan
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-3 w-3" /> bật/tắt từng lớp electron ở thanh điều khiển
            </span>
          </div>
        </div>

        {/* Info */}
        <aside className="order-3 space-y-3">
          <div className="panel p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="num text-[10px] text-faint">Z = {element.z}</p>
                <p className="font-display text-[26px] font-medium leading-none" style={{ color: cat.color }}>
                  {element.symbol}
                </p>
                <p className="mt-1 text-[13px] text-text">{element.nameVi}</p>
                <p className="text-[10px] text-faint">{element.nameEn}</p>
              </div>
              <span
                className="rounded-full border px-2 py-0.5 text-[9px]"
                style={{ borderColor: `${cat.color}66`, color: cat.color }}
              >
                {element.block}-block
              </span>
            </div>
            <dl className="mt-3 space-y-1.5 border-t border-line/60 pt-3 text-[11px]">
              {[
                ['Proton', element.z],
                ['Neutron', `${element.neutrons} (${element.isotope}${element.symbol})`],
                ['Electron', element.z],
                ['Lớp', element.shells.length],
                ['Nhóm / chu kỳ', `${element.group} / ${element.period}`],
                ['Trạng thái', element.stateAt298],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between gap-2">
                  <dt className="text-faint">{k}</dt>
                  <dd className="num text-text">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="panel p-4">
            <p className="label-xs mb-2.5">Lớp electron</p>
            <ul className="space-y-1.5">
              {element.shells.map((count, i) => (
                <li key={i} className="flex items-center gap-2 text-[11px]">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: SHELL_COLORS[i % SHELL_COLORS.length] }}
                  />
                  <span className="w-12 text-muted">
                    {SHELL_NAMES[i]} n={i + 1}
                  </span>
                  <span className="num text-text">{count} e⁻</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel p-4 text-[10px] leading-relaxed text-faint">
            <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
              <Info className="h-3 w-3" /> {mode === 'bohr' ? 'Bohr · minh hoạ' : 'Orbital · xác suất'}
            </p>
            {mode === 'bohr'
              ? 'Các vòng tròn biểu diễn lớp electron. Tốc độ và vị trí electron là minh hoạ, không phải chuyển động vật lý thực.'
              : 'Đám mây điểm lấy mẫu theo mật độ xác suất |ψ|² với cấu trúc lobe của phân lớp. Bán kính được chuẩn hoá để hiển thị.'}
          </div>
        </aside>
      </div>
    </div>
  )
}
