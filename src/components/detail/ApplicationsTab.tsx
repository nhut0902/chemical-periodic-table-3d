import { ArrowUpRight, Lightbulb, Microscope } from 'lucide-react'
import { CATEGORIES } from '../../data/categories'
import type { Element } from '../../data/elements'
import { SectionTitle } from './DataRow'

export function ApplicationsTab({
  element,
  onCompare,
}: {
  element: Element
  onCompare: () => void
}) {
  const items = element.applications
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const cat = CATEGORIES[element.category]

  return (
    <div className="space-y-7">
      <div>
        <SectionTitle hint={`${items.length} lĩnh vực`}>Ứng dụng thực tế</SectionTitle>
        <ul className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-lg border border-line/80 bg-surface-2/40 px-3 py-2.5 text-[12px] leading-snug text-text"
            >
              <span
                className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                style={{ background: cat.color }}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-line bg-surface-2/50 p-4">
        <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          <Lightbulb className="h-3.5 w-3.5 text-[#E9C46A]" />
          Sự thật thú vị
        </p>
        <p className="text-[13px] leading-relaxed text-muted">{element.fact}</p>
      </div>

      <div>
        <SectionTitle>Ghi nhận lịch sử</SectionTitle>
        <div className="rounded-lg border border-line p-4">
          <p className="flex items-center gap-2 text-[12px] text-text">
            <Microscope className="h-4 w-4 text-primary" />
            {element.discoverer ?? 'Chưa xác định người phát hiện'}
          </p>
          <p className="mt-1 pl-6 font-mono text-[11px] text-faint">
            {element.year === null
              ? 'Năm phát hiện: không rõ'
              : element.year < 0
                ? `Được sử dụng từ khoảng ${Math.abs(element.year)} năm TCN`
                : `Phát hiện năm ${element.year}`}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onCompare}
        className="group inline-flex items-center gap-2 text-[12px] text-primary"
      >
        So sánh {element.nameVi} với nguyên tố khác trong phòng thí nghiệm
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </button>
    </div>
  )
}
