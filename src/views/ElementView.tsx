import { lazy, Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { CATEGORIES } from '../data/categories'
import { BY_Z, type Element } from '../data/elements'
import { OverviewTab } from '../components/detail/OverviewTab'
import { AtomTab } from '../components/detail/AtomTab'
import { ConfigTab } from '../components/detail/ConfigTab'
import { PropertiesTab } from '../components/detail/PropertiesTab'
import { ApplicationsTab } from '../components/detail/ApplicationsTab'

const AtomStage = lazy(() =>
  import('../three/AtomStage').then((m) => ({ default: m.AtomStage })),
)

const TABS = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'atom', label: 'Nguyên tử 3D' },
  { key: 'config', label: 'Cấu hình electron' },
  { key: 'properties', label: 'Tính chất' },
  { key: 'applications', label: 'Ứng dụng' },
] as const

type TabKey = (typeof TABS)[number]['key']

function StageSkeleton({ tall }: { tall?: boolean }) {
  return (
    <div
      className={`panel flex items-center justify-center ${tall ? 'h-[clamp(360px,58vh,640px)]' : 'h-[clamp(300px,42vh,440px)]'}`}
    >
      <div className="flex items-center gap-2 text-[11px] text-faint">
        <span className="h-3 w-3 animate-spin rounded-full border border-primary/30 border-t-primary" />
        Đang tải mô hình 3D…
      </div>
    </div>
  )
}

export function ElementView({
  element,
  navigate,
  onSelect,
}: {
  element: Element
  navigate: (to: string) => void
  onSelect: (el: Element) => void
}) {
  const [tab, setTab] = useState<TabKey>('overview')
  const cat = CATEGORIES[element.category]
  const prev = BY_Z.get(element.z - 1)
  const next = BY_Z.get(element.z + 1)
  const isAtomTab = tab === 'atom'

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-[12px] text-muted transition-colors hover:text-text"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Bảng tuần hoàn
        </button>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={!prev}
            onClick={() => prev && onSelect(prev)}
            className="inline-flex h-8 items-center gap-1 rounded-md border border-line px-2 text-[11px] text-muted transition-colors hover:text-text disabled:opacity-30"
            aria-label="Nguyên tố trước"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="num">{prev ? prev.symbol : '—'}</span>
          </button>
          <button
            type="button"
            disabled={!next}
            onClick={() => next && onSelect(next)}
            className="inline-flex h-8 items-center gap-1 rounded-md border border-line px-2 text-[11px] text-muted transition-colors hover:text-text disabled:opacity-30"
            aria-label="Nguyên tố tiếp theo"
          >
            <span className="num">{next ? next.symbol : '—'}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Identity */}
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex flex-col gap-5 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="flex items-center gap-5">
          <div
            className="relative flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-xl border sm:h-28 sm:w-28"
            style={{
              borderColor: `${cat.color}59`,
              background: `linear-gradient(155deg, ${cat.color}26, ${cat.color}0a)`,
            }}
          >
            <span className="num absolute left-2 top-1.5 text-[10px] text-white/50">
              {element.z}
            </span>
            <span
              className="font-display text-[38px] font-semibold leading-none tracking-tight sm:text-[44px]"
              style={{ color: cat.color }}
            >
              {element.symbol}
            </span>
            <span className="num mt-1 text-[10px] text-white/45">{element.mass} u</span>
          </div>
          <div>
            <p className="mb-1.5 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full border px-2 py-0.5 text-[10px]"
                style={{ borderColor: `${cat.color}66`, background: cat.tint, color: cat.color }}
              >
                {cat.labelVi}
              </span>
              <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-faint">
                {element.block}-block
              </span>
              {element.radioactive && (
                <span className="rounded-full border border-[#F97362]/40 px-2 py-0.5 text-[10px] text-[#F97362]">
                  phóng xạ
                </span>
              )}
            </p>
            <h1 className="font-display text-[30px] font-medium leading-none tracking-tight text-text sm:text-[38px]">
              {element.nameVi}
            </h1>
            <p className="mt-1.5 text-[13px] text-muted">
              {element.nameEn} · Nguyên tố số {element.z}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-x-6 gap-y-2 sm:text-right">
          {[
            ['Nhóm', element.category === 'lanthanide' || element.category === 'actinide' ? 'f' : element.group],
            ['Chu kỳ', element.period],
            ['Trạng thái', element.stateAt298],
            ['Proton', element.z],
            ['Neutron', element.neutrons],
            ['Electron', element.z],
          ].map(([label, value]) => (
            <div key={String(label)}>
              <dt className="text-[10px] uppercase tracking-[0.12em] text-faint">{label}</dt>
              <dd className="num mt-0.5 text-[13px] text-text">{value}</dd>
            </div>
          ))}
        </dl>
      </motion.header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-[88px]">
          <Suspense fallback={<StageSkeleton tall={isAtomTab} />}>
            <AtomStage
              key={`${element.z}-${isAtomTab ? 'stage' : 'panel'}`}
              element={element}
              variant={isAtomTab ? 'stage' : 'panel'}
              defaultMode={isAtomTab ? 'bohr' : 'bohr'}
            />
          </Suspense>
          <p className="mt-2 px-1 text-[10px] leading-relaxed text-faint">
            Mô hình hạt nhân–electron dựng bằng Three.js. Kích thước hạt nhân được chuẩn hoá theo
            A<sup>1/3</sup> và phóng đại để quan sát; xem tab “Nguyên tử 3D” để biết giới hạn mô hình.
          </p>
        </div>

        <div className="min-w-0">
          <div
            className="scrollbar-none mb-4 flex gap-1 overflow-x-auto border-b border-line/70"
            role="tablist"
            aria-label="Thông tin nguyên tố"
          >
            {TABS.map((t) => {
              const active = tab === t.key
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.key)}
                  className={`relative shrink-0 px-3 py-2.5 text-[12px] transition-colors ${
                    active ? 'text-text' : 'text-muted hover:text-text'
                  }`}
                >
                  {t.label}
                  {active && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute inset-x-2 -bottom-px h-[2px] bg-primary"
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="panel p-4 sm:p-5" role="tabpanel">
            {tab === 'overview' && <OverviewTab element={element} />}
            {tab === 'atom' && (
              <AtomTab element={element} onExplorer={() => navigate(`/explorer/${element.z}`)} />
            )}
            {tab === 'config' && <ConfigTab element={element} />}
            {tab === 'properties' && <PropertiesTab element={element} />}
            {tab === 'applications' && (
              <ApplicationsTab
                element={element}
                onCompare={() => navigate(`/lab?a=${element.z}`)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
