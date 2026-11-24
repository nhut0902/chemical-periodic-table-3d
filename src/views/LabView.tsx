import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowLeftRight, FlaskConical, Info } from 'lucide-react'
import { BY_Z, ELEMENTS, SHELL_COLORS, SHELL_NAMES } from '../data/elements'
import { CATEGORIES } from '../data/categories'

type MetricKey = 'radius' | 'en' | 'ionization' | 'density'

const METRICS: Record<MetricKey, { label: string; short: string; unit: string; max: number }> = {
  radius: { label: 'Bán kính cộng hoá trị', short: 'Bán kính', unit: 'pm', max: 260 },
  en: { label: 'Độ âm điện (Pauling)', short: 'Độ âm điện', unit: '', max: 4 },
  ionization: {
    label: 'Năng lượng ion hoá thứ nhất',
    short: 'Ion hoá',
    unit: 'kJ·mol⁻¹',
    max: 2400,
  },
  density: { label: 'Khối lượng riêng', short: 'Khối lượng riêng', unit: 'g·cm⁻³', max: 22.6 },
}

const A_COLOR = '#38BDF8'
const B_COLOR = '#A78BFA'

function ElementSelect({
  value,
  onChange,
  label,
  accent,
}: {
  value: number
  onChange: (z: number) => void
  label: string
  accent: string
}) {
  const el = BY_Z.get(value)!
  return (
    <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-line bg-surface px-3 py-2">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: accent }} />
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="min-w-0 flex-1 bg-transparent text-[13px] text-text focus:outline-none"
        aria-label={label}
        style={{ color: 'var(--color-text)' }}
      >
        {ELEMENTS.map((e) => (
          <option key={e.z} value={e.z} style={{ background: '#111827' }}>
            {e.z} · {e.symbol} — {e.nameVi}
          </option>
        ))}
      </select>
      <span className="num hidden shrink-0 text-[10px] text-faint sm:block">
        {CATEGORIES[el.category].labelVi}
      </span>
    </label>
  )
}

function CompareBar({
  label,
  unit,
  a,
  b,
  max,
}: {
  label: string
  unit: string
  a: number | null
  b: number | null
  max: number
}) {
  const width = (v: number | null) => (v === null ? 0 : Math.min(100, (v / max) * 100))
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-[11px] text-muted">{label}</span>
        <span className="num text-[10px] text-faint">{unit}</span>
      </div>
      {[
        { v: a, color: A_COLOR },
        { v: b, color: B_COLOR },
      ].map((row, i) => (
        <div key={i} className="mb-1 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${width(row.v)}%`, background: row.color, opacity: 0.9 }}
            />
          </div>
          <span className="num w-16 text-right text-[11px] text-text">
            {row.v ?? '—'}
          </span>
        </div>
      ))}
    </div>
  )
}

function ChartTooltip({ active, payload, unit }: any) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-md border border-line bg-surface/95 px-2.5 py-2 text-[11px] shadow-[var(--shadow-float)]">
      <p className="text-text">
        <span className="font-display">{p.symbol}</span> · {p.nameVi}
      </p>
      <p className="num mt-0.5 text-muted">
        {typeof p.value === 'number' ? p.value : p.a ?? ''} {unit}
      </p>
    </div>
  )
}

export function LabView({ initialA = 26, initialB = 29 }: { initialA?: number; initialB?: number }) {
  const [aZ, setAZ] = useState(initialA)
  const [bZ, setBZ] = useState(initialB)
  const [metric, setMetric] = useState<MetricKey>('radius')
  const [period, setPeriod] = useState<number>(4)

  const a = BY_Z.get(aZ)!
  const b = BY_Z.get(bZ)!
  const metricMeta = METRICS[metric]

  const radarData = useMemo(
    () => [
      { axis: 'Bán kính', A: ((a.radius ?? 0) / METRICS.radius.max) * 100, B: ((b.radius ?? 0) / METRICS.radius.max) * 100 },
      { axis: 'Độ âm điện', A: ((a.en ?? 0) / METRICS.en.max) * 100, B: ((b.en ?? 0) / METRICS.en.max) * 100 },
      { axis: 'Ion hoá', A: ((a.ionization ?? 0) / METRICS.ionization.max) * 100, B: ((b.ionization ?? 0) / METRICS.ionization.max) * 100 },
      { axis: 'Khối lượng riêng', A: ((a.density ?? 0) / METRICS.density.max) * 100, B: ((b.density ?? 0) / METRICS.density.max) * 100 },
    ],
    [a, b],
  )

  const trendData = useMemo(
    () =>
      ELEMENTS.map((el) => ({
        z: el.z,
        symbol: el.symbol,
        nameVi: el.nameVi,
        value: (el[metric] as number | null) ?? null,
        category: el.category,
      })),
    [metric],
  )

  const periodData = useMemo(
    () =>
      ELEMENTS.filter((el) => el.period === period && el[metric] !== null).map((el) => ({
        z: el.z,
        symbol: el.symbol,
        nameVi: el.nameVi,
        value: el[metric] as number,
        color: CATEGORIES[el.category].color,
      })),
    [period, metric],
  )

  const delta = (x: number | null, y: number | null) =>
    x === null || y === null ? '—' : y === x ? '0' : y > x ? `+${(y - x).toFixed(2)}` : (y - x).toFixed(2)

  const swap = () => {
    setAZ(bZ)
    setBZ(aZ)
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-16 pt-8 sm:px-6">
      <header className="mb-8 max-w-2xl">
        <p className="label-xs mb-2">Science lab · dữ liệu thực</p>
        <h1 className="font-display text-[30px] font-medium tracking-tight text-text sm:text-[36px]">
          Phòng thí nghiệm so sánh
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Chọn hai nguyên tố để so sánh bán kính nguyên tử, độ âm điện, năng lượng ion hoá và khối
          lượng riêng. Mọi giá trị lấy trực tiếp từ dataset của bảng tuần hoàn, không có số liệu mô
          phỏng.
        </p>
      </header>

      {/* Selectors */}
      <div className="panel mb-6 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ElementSelect value={aZ} onChange={setAZ} label="Nguyên tố A" accent={A_COLOR} />
          <button
            type="button"
            onClick={swap}
            className="mx-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-primary/40 hover:text-text"
            aria-label="Đổi chỗ hai nguyên tố"
            title="Đổi chỗ"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
          <ElementSelect value={bZ} onChange={setBZ} label="Nguyên tố B" accent={B_COLOR} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Identity + comparison */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { el: a, color: A_COLOR, tag: 'A' },
              { el: b, color: B_COLOR, tag: 'B' },
            ].map(({ el, color, tag }) => (
              <div
                key={tag}
                className="rounded-lg border border-line bg-surface p-3"
                style={{ borderTop: `2px solid ${color}` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-faint">{tag} · Z={el.z}</span>
                  <span className="num text-[10px] text-faint">{el.period}{el.block}</span>
                </div>
                <p className="mt-1 font-display text-2xl font-medium leading-none" style={{ color }}>
                  {el.symbol}
                </p>
                <p className="mt-1 truncate text-[12px] text-text">{el.nameVi}</p>
                <p className="num text-[10px] text-faint">{el.mass} u</p>
              </div>
            ))}
          </div>

          <div className="panel p-4">
            <div className="mb-4 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-primary" />
              <h2 className="font-display text-[14px] font-medium text-text">So sánh chỉ số</h2>
            </div>
            <div className="space-y-4">
              <CompareBar
                label="Bán kính cộng hoá trị"
                unit="pm"
                a={a.radius}
                b={b.radius}
                max={METRICS.radius.max}
              />
              <CompareBar
                label="Độ âm điện"
                unit="Pauling"
                a={a.en}
                b={b.en}
                max={METRICS.en.max}
              />
              <CompareBar
                label="Năng lượng ion hoá 1"
                unit="kJ·mol⁻¹"
                a={a.ionization}
                b={b.ionization}
                max={METRICS.ionization.max}
              />
              <CompareBar
                label="Khối lượng riêng"
                unit="g·cm⁻³"
                a={a.density}
                b={b.density}
                max={METRICS.density.max}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-line/60 pt-3">
              {[
                ['Nguyên tử khối', `${a.mass} → ${b.mass} u`],
                ['Nóng chảy', `${a.melt ?? '—'} → ${b.melt ?? '—'} K`],
                ['Số electron', `${a.z} → ${b.z}`],
                ['Neutron', `${a.neutrons} → ${b.neutrons}`],
                ['Δ độ âm điện', delta(a.en, b.en)],
                ['Δ bán kính', `${delta(a.radius, b.radius)} pm`],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col">
                  <span className="text-[10px] text-faint">{label}</span>
                  <span className="num text-[11px] text-text">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-4">
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="font-display text-[14px] font-medium text-text">
                Hồ sơ năng lượng tương đối
              </h2>
              <span className="font-mono text-[9px] text-faint">% thang toàn bảng</span>
            </div>
            <div className="h-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="62%" margin={{ top: 10, right: 20, bottom: 4, left: 20 }}>
                  <PolarGrid stroke="#22304B" />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={{ fill: '#8A9AB8', fontSize: 10 }}
                  />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name={a.symbol}
                    dataKey="A"
                    stroke={A_COLOR}
                    fill={A_COLOR}
                    fillOpacity={0.18}
                    strokeWidth={1.5}
                  />
                  <Radar
                    name={b.symbol}
                    dataKey="B"
                    stroke={B_COLOR}
                    fill={B_COLOR}
                    fillOpacity={0.16}
                    strokeWidth={1.5}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#8A9AB8' }} />
                  <Tooltip
                    contentStyle={{
                      background: '#111827',
                      border: '1px solid #22304B',
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Trends */}
        <div className="space-y-4">
          <div className="panel p-4">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="font-display text-[14px] font-medium text-text">
                  Xu hướng tuần hoàn
                </h2>
                <p className="text-[10px] text-faint">Theo số hiệu nguyên tử Z</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {(Object.keys(METRICS) as MetricKey[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMetric(m)}
                    aria-pressed={metric === m}
                    className={`rounded border px-2 py-1 text-[10px] transition-colors ${
                      metric === m
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-line text-muted hover:text-text'
                    }`}
                  >
                    {METRICS[m].short}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 4, right: 6, bottom: 0, left: -16 }}>
                  <CartesianGrid stroke="#22304B" strokeOpacity={0.55} vertical={false} />
                  <XAxis
                    dataKey="z"
                    type="number"
                    domain={[1, 118]}
                    ticks={[1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 118]}
                    tick={{ fill: '#5A6883', fontSize: 9 }}
                    stroke="#22304B"
                  />
                  <YAxis
                    tick={{ fill: '#5A6883', fontSize: 9 }}
                    stroke="#22304B"
                    width={44}
                    domain={[0, metricMeta.max]}
                  />
                  <Tooltip content={<ChartTooltip unit={metricMeta.unit} />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#38BDF8"
                    strokeWidth={1.6}
                    dot={false}
                    activeDot={{ r: 3, fill: '#38BDF8', stroke: '#080D18' }}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-1 text-[10px] text-faint">
              {metricMeta.label} ({metricMeta.unit || 'không đơn vị'}) cho {trendData.filter((d) => d.value !== null).length}{' '}
              nguyên tố có dữ liệu. Khoảng trống là giá trị chưa xác định.
            </p>
          </div>

          <div className="panel p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-[14px] font-medium text-text">
                Trong một chu kỳ
              </h2>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    aria-pressed={period === p}
                    className={`h-6 w-6 rounded border font-mono text-[10px] transition-colors ${
                      period === p
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-line text-muted hover:text-text'
                    }`}
                    aria-label={`Chu kỳ ${p}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={periodData} margin={{ top: 4, right: 6, bottom: 0, left: -16 }}>
                  <CartesianGrid stroke="#22304B" strokeOpacity={0.5} vertical={false} />
                  <XAxis
                    dataKey="symbol"
                    tick={{ fill: '#8A9AB8', fontSize: 9 }}
                    stroke="#22304B"
                    interval={0}
                  />
                  <YAxis tick={{ fill: '#5A6883', fontSize: 9 }} stroke="#22304B" width={40} />
                  <Tooltip content={<ChartTooltip unit={metricMeta.unit} />} />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                    {periodData.map((d) => (
                      <Cell key={d.z} fill={d.color} fillOpacity={0.78} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-1 text-[10px] text-faint">
              Chu kỳ {period}: {periodData.length} nguyên tố có dữ liệu {metricMeta.short.toLowerCase()}.
              Màu cột theo nhóm nguyên tố.
            </p>
          </div>
        </div>
      </div>

      {/* Electron configuration change */}
      <section className="panel mt-6 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="font-display text-[15px] font-medium text-text">
              Minh hoạ thay đổi cấu hình electron
            </h2>
            <p className="mt-0.5 text-[11px] text-muted">
              Số electron trên mỗi lớp khi đi từ {a.nameVi} (Z={a.z}) sang {b.nameVi} (Z={b.z}).
              Chênh lệch số electron: Δ = {b.z - a.z > 0 ? '+' : ''}
              {b.z - a.z}.
            </p>
          </div>
          <p className="num text-[10px] text-faint">
            {a.configShort} → {b.configShort}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {[a, b].map((el, idx) => (
            <div key={el.z}>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: idx === 0 ? A_COLOR : B_COLOR }}
                />
                <span className="text-[12px] text-text">
                  {el.symbol} · {el.nameVi}
                </span>
                <span className="num ml-auto text-[10px] text-faint">
                  {el.shells.reduce((s, n) => s + n, 0)} e⁻
                </span>
              </div>
              <div className="space-y-1">
                {el.shells.map((count, i) => {
                  const other = (idx === 0 ? b : a).shells[i] ?? 0
                  const diff = idx === 0 ? other - count : count - other
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-9 font-mono text-[10px] text-faint">
                        {SHELL_NAMES[i]}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(count / 32) * 100}%`,
                            background: SHELL_COLORS[i % SHELL_COLORS.length],
                            opacity: 0.8,
                          }}
                        />
                      </div>
                      <span className="num w-6 text-right text-[10px] text-text">{count}</span>
                      <span
                        className={`num w-7 text-right text-[9px] ${
                          diff === 0 ? 'text-faint' : diff > 0 ? 'text-[#7DD3A7]' : 'text-[#F97362]'
                        }`}
                      >
                        {diff === 0 ? '·' : diff > 0 ? `+${diff}` : diff}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-md border border-line/80 bg-surface-2/40 p-3 text-[11px] leading-relaxed text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <p>
            Khi Z tăng trong cùng một chu kỳ, electron được thêm vào cùng lớp ngoài cùng (hoặc lớp d
            bên trong), điện tích hạt nhân hiệu dụng tăng, do đó bán kính nguyên tử thường giảm và
            năng lượng ion hoá tăng. Dữ liệu trên biểu đồ cho thấy xu hướng đó, kèm các ngoại lệ thực
            tế.
          </p>
        </div>
      </section>
    </div>
  )
}
