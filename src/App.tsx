import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { TopBar } from './components/layout/TopBar'
import { Footer } from './components/layout/Footer'
import { HomeView } from './views/HomeView'
import { ElementView } from './views/ElementView'
import { ExplorerView } from './views/ExplorerView'
import { LabView } from './views/LabView'
import { LearnView } from './views/LearnView'
import { BY_Z } from './data/elements'
import { useRoute } from './lib/hooks'

function NotFound({ navigate }: { navigate: (to: string) => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start px-4 py-24">
      <p className="font-mono text-[11px] tracking-[0.2em] text-faint">404</p>
      <h1 className="mt-2 font-display text-3xl font-medium text-text">
        Không tìm thấy trang này
      </h1>
      <p className="mt-2 text-sm text-muted">
        Đường dẫn không tồn tại trong bảng tuần hoàn. Hãy quay lại bảng chính hoặc mở không gian 3D.
      </p>
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="h-9 rounded-md bg-primary px-4 text-[12px] font-medium text-abyss"
        >
          Bảng tuần hoàn
        </button>
        <button
          type="button"
          onClick={() => navigate('/explorer')}
          className="h-9 rounded-md border border-line px-4 text-[12px] text-text"
        >
          Khám phá 3D
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const { route, navigate } = useRoute()
  const [section, param] = route.segments
  const zParam = param ? Number(param) : NaN
  const element = Number.isFinite(zParam) ? BY_Z.get(zParam) : undefined

  const goElement = (z: number) => navigate(`/element/${z}`)

  useEffect(() => {
    const names: Record<string, string> = {
      '': 'THE PERIODIC TABLE — Bảng tuần hoàn 3D',
      element: element ? `${element.nameVi} (${element.symbol}) — THE PERIODIC TABLE` : 'Nguyên tố',
      explorer: 'Khám phá nguyên tử 3D — THE PERIODIC TABLE',
      lab: 'Phòng thí nghiệm so sánh — THE PERIODIC TABLE',
      learn: 'Học tập — THE PERIODIC TABLE',
    }
    document.title = names[section ?? ''] ?? 'THE PERIODIC TABLE'
  }, [section, element])

  let view: React.ReactNode
  if (!section) {
    view = <HomeView navigate={navigate} onSelect={(el) => goElement(el.z)} />
  } else if (section === 'element' && element) {
    view = (
      <ElementView
        key={element.z}
        element={element}
        navigate={navigate}
        onSelect={(el) => goElement(el.z)}
      />
    )
  } else if (section === 'explorer') {
    view = (
      <ExplorerView
        element={element ?? BY_Z.get(26)!}
        onSelect={(el) => navigate(`/explorer/${el.z}`)}
      />
    )
  } else if (section === 'lab') {
    const a = Number(route.query.get('a'))
    const b = Number(route.query.get('b'))
    view = (
      <LabView
        key={`${a}-${b}`}
        initialA={Number.isFinite(a) && BY_Z.has(a) ? a : 26}
        initialB={Number.isFinite(b) && BY_Z.has(b) ? b : 29}
      />
    )
  } else if (section === 'learn') {
    view = <LearnView />
  } else {
    view = <NotFound navigate={navigate} />
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(70% 45% at 50% -10%, rgba(56,189,248,0.06), transparent 60%), #080D18',
        }}
      />
      <TopBar section={section ?? ''} navigate={navigate} />
      <main className="flex-1">
        <motion.div
          key={route.path}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {view}
        </motion.div>
      </main>
      <Footer navigate={navigate} />
    </div>
  )
}
