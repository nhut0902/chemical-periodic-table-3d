import type { ReactNode } from 'react'

export function DataRow({
  label,
  value,
  unit,
  note,
}: {
  label: string
  value: ReactNode
  unit?: string
  note?: string
}) {
  const empty = value === null || value === undefined || value === '' || value === '—'
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line/50 py-2.5 last:border-0">
      <dt className="text-[12px] text-muted">
        {label}
        {note && <span className="ml-1.5 text-[10px] text-faint">{note}</span>}
      </dt>
      <dd className={`num text-right text-[13px] ${empty ? 'text-faint' : 'text-text'}`}>
        {empty ? '—' : value}
        {unit && !empty && <span className="ml-1 text-[10px] text-faint">{unit}</span>}
      </dd>
    </div>
  )
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <h3 className="font-display text-[13px] font-medium tracking-wide text-text">{children}</h3>
      {hint && <span className="font-mono text-[10px] text-faint">{hint}</span>}
    </div>
  )
}
