import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import {
  Pause,
  Play,
  RotateCcw,
  Tag,
  RefreshCw,
  CircleDot,
  Sparkles,
  Info,
} from 'lucide-react'
import type { Element } from '../data/elements'
import { SHELL_COLORS, SHELL_NAMES } from '../data/elements'
import { CATEGORIES } from '../data/categories'
import { AtomModel } from './AtomModel'
import type { OrbitalKind } from './orbital'
import { supportsWebGL, useMediaQuery, useReducedMotion } from '../lib/hooks'

type Mode = 'bohr' | 'orbital'

function CameraRig({ autoRotate, resetToken }: { autoRotate: boolean; resetToken: number }) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null)
  const { camera } = useThree()

  useEffect(() => {
    const c = controls.current
    if (!c) return
    camera.position.set(0, 3.6, 13.8)
    c.target.set(0, 0, 0)
    c.update()
  }, [resetToken, camera])

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.075}
      rotateSpeed={0.72}
      zoomSpeed={0.85}
      panSpeed={0.7}
      minDistance={3.2}
      maxDistance={30}
      autoRotate={autoRotate}
      autoRotateSpeed={0.55}
    />
  )
}

function WebGLFallback() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <CircleDot className="h-8 w-8 text-primary" aria-hidden />
      <p className="font-display text-lg text-text">Thiết bị chưa hỗ trợ WebGL</p>
      <p className="max-w-sm text-sm text-muted">
        Mô hình nguyên tử 3D cần WebGL. Hãy bật tăng tốc phần cứng trong trình duyệt, hoặc dùng
        Chrome/Firefox bản mới. Toàn bộ dữ liệu nguyên tố vẫn xem được ở các tab khác.
      </p>
    </div>
  )
}

export interface AtomStageProps {
  element: Element
  defaultMode?: Mode
  /** "panel" is used inside the detail page, "stage" in the 3D explorer. */
  variant?: 'panel' | 'stage'
  className?: string
  onModeChange?: (mode: Mode) => void
}

export function AtomStage({
  element,
  defaultMode = 'bohr',
  variant = 'panel',
  className = '',
  onModeChange,
}: AtomStageProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const reducedMotion = useReducedMotion()
  const webgl = useMemo(() => supportsWebGL(), [])

  const [mode, setMode] = useState<Mode>(defaultMode)
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [labels, setLabels] = useState(variant === 'stage')
  const [orbitalFilter, setOrbitalFilter] = useState<'auto' | OrbitalKind>('auto')
  const [labelParts, setLabelParts] = useState({
    proton: true,
    neutron: true,
    electron: true,
  })
  const [autoRotate, setAutoRotate] = useState(!reducedMotion)
  const [resetToken, setResetToken] = useState(0)
  const [ready, setReady] = useState(false)
  const [activeShells, setActiveShells] = useState<number[]>(() =>
    element.shells.map((_, i) => i + 1),
  )

  useEffect(() => {
    setActiveShells(element.shells.map((_, i) => i + 1))
  }, [element])

  useEffect(() => {
    onModeChange?.(mode)
  }, [mode, onModeChange])

  useEffect(() => {
    if (reducedMotion) {
      setPaused(true)
      setAutoRotate(false)
    }
  }, [reducedMotion])

  const toggleShell = (n: number) => {
    setActiveShells((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n].sort((a, b) => a - b),
    )
  }

  const stageHeight = variant === 'stage' ? 'h-[clamp(360px,58vh,640px)]' : 'h-[clamp(300px,42vh,440px)]'

  return (
    <div className={`panel overflow-hidden ${className}`}>
      <div className={`relative ${stageHeight} grid-field`}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 45%, rgba(56,189,248,0.10), transparent 70%), radial-gradient(40% 40% at 70% 20%, rgba(167,139,250,0.08), transparent 70%)',
          }}
        />
        {webgl ? (
          <Canvas
            dpr={[1, isMobile ? 1.4 : 1.75]}
            camera={{ position: [0, 3.6, 13.8], fov: 45, near: 0.1, far: 120 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => {
              gl.setClearColor('#000000', 0)
              setReady(true)
            }}
            aria-label={`Mô hình nguyên tử 3D của ${element.nameEn}`}
          >
            <CameraRig autoRotate={autoRotate && !paused} resetToken={resetToken} />
            <AtomModel
              element={element}
              mode={mode}
              paused={paused}
              speed={speed}
              labels={labels}
              activeShells={activeShells}
              orbitalKinds={orbitalFilter === 'auto' ? undefined : [orbitalFilter]}
              labelParts={labelParts}
            />
          </Canvas>
        ) : (
          <WebGLFallback />
        )}

        {/* HUD: identity */}
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-md border font-display text-base font-semibold"
            style={{
              borderColor: `${CATEGORIES[element.category].color}66`,
              background: CATEGORIES[element.category].tint,
              color: CATEGORIES[element.category].color,
            }}
          >
            {element.symbol}
          </div>
          <div className="leading-tight">
            <p className="font-mono text-[10px] tracking-[0.1em] text-faint">
              Z = {element.z} · {element.symbol}-{element.isotope}
            </p>
            <p className="text-sm font-medium text-text">{element.nameVi}</p>
          </div>
        </div>

        <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-abyss/60 px-2.5 py-1 text-[10px] text-muted">
          <Info className="h-3 w-3" aria-hidden />
          Không theo tỉ lệ thật
        </div>

        {!ready && webgl && (
          <div className="absolute inset-0 flex items-center justify-center bg-abyss/80">
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="h-3 w-3 animate-spin rounded-full border border-primary/30 border-t-primary" />
              Đang dựng mô hình WebGL…
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-faint">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F97362]" /> proton {element.z}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#94A3B8]" /> neutron {element.neutrons}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> electron {element.z}
          </span>
          <span className="ml-auto hidden sm:inline">
            {mode === 'bohr'
              ? 'Bohr: quỹ đạo minh hoạ — không phải quỹ đạo thực'
              : 'Orbital: đám mây xác suất |ψ|² lược đồ'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="hairline flex flex-wrap items-center gap-2 bg-abyss-soft px-3 py-2.5">
        <div
          className="flex rounded-md border border-line p-0.5"
          role="group"
          aria-label="Chế độ hiển thị nguyên tử"
        >
          <button
            type="button"
            onClick={() => setMode('bohr')}
            aria-pressed={mode === 'bohr'}
            className={`rounded px-2.5 py-1 text-[11px] transition-colors ${
              mode === 'bohr' ? 'bg-primary/15 text-primary' : 'text-muted hover:text-text'
            }`}
          >
            Bohr · minh hoạ
          </button>
          <button
            type="button"
            onClick={() => setMode('orbital')}
            aria-pressed={mode === 'orbital'}
            className={`rounded px-2.5 py-1 text-[11px] transition-colors ${
              mode === 'orbital' ? 'bg-accent/15 text-accent' : 'text-muted hover:text-text'
            }`}
          >
            Orbital · xác suất
          </button>
        </div>

        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line px-2.5 text-[11px] text-muted transition-colors hover:border-primary/40 hover:text-text"
          aria-pressed={paused}
        >
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          {paused ? 'Chạy' : 'Tạm dừng'}
        </button>

        <label className="flex h-8 items-center gap-2 rounded-md border border-line px-2.5 text-[11px] text-muted">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          <span className="sr-only">Tốc độ chuyển động</span>
          <input
            type="range"
            min={0.2}
            max={2.4}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="h-1 w-20 accent-primary"
            aria-label="Tốc độ chuyển động electron"
          />
          <span className="num w-7 text-right text-text">{speed.toFixed(1)}×</span>
        </label>

        <button
          type="button"
          onClick={() => setLabels((v) => !v)}
          aria-pressed={labels}
          className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[11px] transition-colors ${
            labels
              ? 'border-accent/40 bg-accent/10 text-accent'
              : 'border-line text-muted hover:text-text'
          }`}
        >
          <Tag className="h-3.5 w-3.5" />
          Nhãn
        </button>

        <button
          type="button"
          onClick={() => setAutoRotate((v) => !v)}
          aria-pressed={autoRotate}
          className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[11px] transition-colors ${
            autoRotate
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'border-line text-muted hover:text-text'
          }`}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Tự xoay
        </button>

        <button
          type="button"
          onClick={() => setResetToken((t) => t + 1)}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line px-2.5 text-[11px] text-muted transition-colors hover:border-primary/40 hover:text-text"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Camera
        </button>

      </div>

      {labels && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-line/60 bg-abyss-soft px-3 py-2">
          <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
            Nhãn
          </span>
          {(
            [
              ['proton', 'Proton', '#F97362'],
              ['neutron', 'Neutron', '#94A3B8'],
              ['electron', 'Electron', '#38BDF8'],
            ] as const
          ).map(([key, label, color]) => (
            <button
              key={key}
              type="button"
              aria-pressed={labelParts[key]}
              onClick={() => setLabelParts((prev) => ({ ...prev, [key]: !prev[key] }))}
              className={`inline-flex h-6 items-center gap-1.5 rounded border px-2 text-[10px] transition-opacity ${
                labelParts[key] ? 'border-line bg-surface-2 text-text' : 'border-line/60 text-faint opacity-55'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
              {label}
            </button>
          ))}
        </div>
      )}

      {mode === 'orbital' && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-line/60 bg-abyss-soft px-3 py-2">
          <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
            Phân lớp
          </span>
          {(['auto', 's', 'p', 'd', 'f'] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => setOrbitalFilter(kind)}
              aria-pressed={orbitalFilter === kind}
              title={
                kind === 'auto'
                  ? 'Tự chọn phân lớp hoá trị'
                  : `Đám mây xác suất orbital ${kind}`
              }
              className={`h-6 rounded border px-2 font-mono text-[10px] transition-colors ${
                orbitalFilter === kind
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-line text-muted hover:text-text'
              }`}
            >
              {kind === 'auto' ? 'tự động' : kind}
            </button>
          ))}
          <span className="ml-auto hidden text-[9px] text-faint sm:block">
            |ψ|² lược đồ · bán kính chuẩn hoá
          </span>
        </div>
      )}

      {mode === 'bohr' && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-line/60 bg-abyss-soft px-3 py-2">
          <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
            Lớp electron
          </span>
          {element.shells.map((count, i) => {
            const n = i + 1
            if (count === 0) return null
            const on = activeShells.includes(n)
            return (
              <button
                key={n}
                type="button"
                onClick={() => toggleShell(n)}
                aria-pressed={on}
                title={`Lớp ${SHELL_NAMES[i]} (n=${n}): ${count} electron`}
                className={`inline-flex h-6 items-center gap-1.5 rounded border px-2 font-mono text-[10px] transition-opacity ${
                  on ? 'border-line bg-surface-2 text-text' : 'border-line/60 text-faint opacity-50'
                }`}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: SHELL_COLORS[i % SHELL_COLORS.length] }}
                />
                {SHELL_NAMES[i]}
                <span className="text-faint">{count}</span>
              </button>
            )
          })}
          <span className="ml-auto hidden text-[9px] text-faint sm:block">
            nhấn để bật/tắt từng lớp
          </span>
        </div>
      )}
    </div>
  )
}
