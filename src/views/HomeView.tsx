import { motion } from 'framer-motion'
import { ArrowRight, Boxes, FlaskConical, GraduationCap, Sparkles } from 'lucide-react'
import { ParticleField } from '../components/ParticleField'
import { ElementSearch } from '../components/ElementSearch'
import { PeriodicTable } from '../components/table/PeriodicTable'
import type { Element } from '../data/elements'
import { BY_Z, formatKelvin } from '../data/elements'
import { CATEGORIES } from '../data/categories'

const STATS = [
  { value: '118', label: 'nguyên tố đã xác nhận' },
  { value: '7', label: 'chu kỳ · 18 nhóm' },
  { value: '10', label: 'nhóm phân loại' },
  { value: '3D', label: 'mô hình WebGL thực' },
]

const MODULES = [
  {
    icon: Boxes,
    index: '01',
    title: 'Nguyên tử 3D',
    body: 'Hạt nhân với proton/neutron riêng biệt, lớp electron chuyển động và đám mây orbital xác suất. Xoay, zoom, tạm dừng và điều chỉnh tốc độ.',
    to: '/explorer',
    cta: 'Mở không gian 3D',
  },
  {
    icon: FlaskConical,
    index: '02',
    title: 'Phòng thí nghiệm dữ liệu',
    body: 'So sánh hai nguyên tố theo bán kính, độ âm điện, năng lượng ion hoá; quan sát xu hướng tuần hoàn lấy trực tiếp từ dataset.',
    to: '/lab',
    cta: 'Vào phòng thí nghiệm',
  },
  {
    icon: GraduationCap,
    index: '03',
    title: 'Chế độ học tập',
    body: 'Giải thích cấu tạo nguyên tử, cấu hình electron, chu kỳ và nhóm — kèm bộ câu hỏi trắc nghiệm có đáp án và lời giải.',
    to: '/learn',
    cta: 'Bắt đầu học',
  },
]

function FeaturedSpecimen({ onSelect }: { onSelect: (el: Element) => void }) {
  const el = BY_Z.get(79)!
  const cat = CATEGORIES[el.category]
  return (
    <div className="relative hidden overflow-hidden rounded-xl border border-line bg-surface/70 p-4 backdrop-blur-sm lg:block">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
        style={{ background: `radial-gradient(circle, ${cat.color}22, transparent 70%)` }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
            Specimen · Z 079
          </p>
          <p className="mt-1.5 font-display text-[32px] font-medium leading-none" style={{ color: cat.color }}>
            {el.symbol}
          </p>
          <p className="mt-1 text-[12px] text-text">{el.nameVi}</p>
          <p className="font-mono text-[10px] text-faint">{el.nameEn}</p>
        </div>
        <svg viewBox="0 0 60 60" className="h-14 w-14 opacity-70" aria-hidden>
          <ellipse cx="30" cy="30" rx="26" ry="10" fill="none" stroke={cat.color} strokeOpacity="0.55" strokeWidth="0.8" transform="rotate(-24 30 30)" />
          <ellipse cx="30" cy="30" rx="26" ry="10" fill="none" stroke={cat.color} strokeOpacity="0.3" strokeWidth="0.8" transform="rotate(38 30 30)" />
          <circle cx="30" cy="30" r="2.6" fill={cat.color} />
          <circle cx="51" cy="21" r="1.5" fill="#A78BFA" />
        </svg>
      </div>

      <dl className="relative mt-3 space-y-1.5 border-t border-line/70 pt-3 text-[11px]">
        {[
          ['Nguyên tử khối', `${el.mass} u`],
          ['Nhóm / chu kỳ', `${el.group} / ${el.period}`],
          ['Nóng chảy', formatKelvin(el.melt)],
          ['Cấu hình', el.configShort],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-2">
            <dt className="shrink-0 text-faint">{label}</dt>
            <dd className="num truncate text-right text-text">{value}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={() => onSelect(el)}
        className="relative mt-3 flex w-full items-center justify-between rounded-md border border-line px-2.5 py-1.5 text-[11px] text-text transition-colors hover:border-primary/40 hover:text-primary"
      >
        Mở hồ sơ nguyên tố
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function HomeView({
  navigate,
  onSelect,
}: {
  navigate: (to: string) => void
  onSelect: (el: Element) => void
}) {
  return (
    <div>
      {/* Hero ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-field opacity-70" aria-hidden />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[560px]"
          style={{
            background:
              'radial-gradient(48% 62% at 50% 0%, rgba(56,189,248,0.14), transparent 70%), radial-gradient(38% 48% at 78% 18%, rgba(167,139,250,0.10), transparent 72%)',
          }}
        />
        <ParticleField density={34} />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-abyss" aria-hidden />

        <div className="relative mx-auto max-w-[1100px] px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_294px] lg:items-end"
          >
            <div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-3 w-3" /> Scientific visualisation
              </span>
              <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-faint">
                IUPAC · 118 elements
              </span>
            </div>

            <h1 className="font-display text-[clamp(2.6rem,7.2vw,5rem)] font-medium leading-[0.94] tracking-[-0.035em] text-text">
              THE PERIODIC
              <br />
              <span className="text-white/45">TABLE</span>
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
              Khám phá thế giới nguyên tố hoá học trong không gian 3D. 118 nguyên tố, mô hình hạt
              nhân và electron dựng trực tiếp bằng Three.js, cùng dữ liệu tham chiếu IUPAC &amp; NIST.
            </p>

            <div className="mt-7 max-w-xl">
              <ElementSearch onSelect={onSelect} size="lg" hint="↵" />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/explorer')}
                className="group inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-[13px] font-medium text-abyss transition-colors hover:bg-[#7dd3fc]"
              >
                Khám phá 3D
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('table')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-line px-5 text-[13px] text-text transition-colors hover:border-primary/40"
              >
                Xem bảng tuần hoàn
              </button>
              <button
                type="button"
                onClick={() => navigate('/lab')}
                className="ml-1 hidden text-[12px] text-muted link-underline sm:inline"
              >
                So sánh nguyên tố →
              </button>
            </div>
            </div>

            <FeaturedSpecimen onSelect={onSelect} />
          </motion.div>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line/70 pt-6 sm:mt-14 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.45 }}
              >
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="num block text-[26px] font-medium leading-none text-text">
                    {s.value}
                  </span>
                  <span className="mt-1.5 block text-[11px] text-faint">{s.label}</span>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      {/* Table --------------------------------------------------------------- */}
      <div className="pt-14 sm:pt-16">
        <PeriodicTable onSelect={onSelect} />
      </div>

      {/* Category note ------------------------------------------------------- */}
      <section className="mx-auto mt-10 max-w-[1440px] px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {Object.values(CATEGORIES).map((cat) => (
            <div
              key={cat.key}
              className="rounded-lg border border-line/70 bg-surface/40 px-3 py-2.5"
              style={{ borderLeft: `2px solid ${cat.color}` }}
            >
              <p className="text-[11px] font-medium" style={{ color: cat.color }}>
                {cat.labelVi}
              </p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-faint">{cat.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules ------------------------------------------------------------- */}
      <section className="mx-auto mt-20 max-w-[1100px] px-4 sm:mt-24 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="label-xs mb-2">Ba mô-đun tương tác</p>
          <h2 className="font-display text-2xl font-medium tracking-tight text-text sm:text-[28px]">
            Từ bảng dữ liệu đến mô hình nguyên tử
          </h2>
        </div>
        <div className="divide-y divide-line/70 border-y border-line/70">
          {MODULES.map((m) => {
            const Icon = m.icon
            return (
              <button
                key={m.title}
                type="button"
                onClick={() => navigate(m.to)}
                className="group grid w-full grid-cols-[auto_1fr] items-start gap-4 px-1 py-6 text-left transition-colors hover:bg-surface/40 sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-6 sm:px-3"
              >
                <span className="num hidden text-[11px] text-faint sm:block">{m.index}</span>
                <div className="flex items-start gap-4 sm:items-center">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-display text-[15px] font-medium text-text">{m.title}</p>
                    <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted">{m.body}</p>
                  </div>
                </div>
                <span className="col-span-2 flex items-center gap-1.5 pl-[52px] text-[12px] text-primary sm:col-span-1 sm:pl-0">
                  {m.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
