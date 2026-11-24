import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlaskConical, GraduationCap, Menu, Orbit, Table2, X } from 'lucide-react'

const NAV = [
  { to: '/', label: 'Bảng tuần hoàn', icon: Table2, match: (s: string) => s === '' || s === 'element' },
  { to: '/explorer', label: 'Khám phá 3D', icon: Orbit, match: (s: string) => s === 'explorer' },
  { to: '/lab', label: 'Phòng thí nghiệm', icon: FlaskConical, match: (s: string) => s === 'lab' },
  { to: '/learn', label: 'Học tập', icon: GraduationCap, match: (s: string) => s === 'learn' },
]

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <circle cx="16" cy="16" r="2.6" fill="#38BDF8" />
      <ellipse
        cx="16"
        cy="16"
        rx="12"
        ry="5.2"
        fill="none"
        stroke="#38BDF8"
        strokeOpacity="0.7"
        strokeWidth="1.1"
        transform="rotate(30 16 16)"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="12"
        ry="5.2"
        fill="none"
        stroke="#A78BFA"
        strokeOpacity="0.55"
        strokeWidth="1.1"
        transform="rotate(-30 16 16)"
      />
      <circle cx="25.4" cy="9.5" r="1.7" fill="#A78BFA" />
    </svg>
  )
}

interface TopBarProps {
  section: string
  navigate: (to: string) => void
}

export function TopBar({ section, navigate }: TopBarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [section])

  const go = (to: string) => {
    setOpen(false)
    navigate(to)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        scrolled || open ? 'glass border-b border-white/8' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => go('/')}
          className="flex items-center gap-3 text-left"
          aria-label="THE PERIODIC TABLE — về trang chủ"
        >
          <Logo />
          <span className="leading-none">
            <span className="block font-display text-[13px] font-semibold tracking-[0.16em] text-text">
              PERIODIC
            </span>
            <span className="mt-0.5 block font-mono text-[9px] tracking-[0.28em] text-faint">
              TABLE · 3D
            </span>
          </span>
        </button>

        <nav className="ml-2 hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
          {NAV.map((item) => {
            const active = item.match(section)
            return (
              <button
                key={item.to}
                type="button"
                onClick={() => go(item.to)}
                aria-current={active ? 'page' : undefined}
                className={`relative h-9 rounded-md px-3 text-[13px] transition-colors ${
                  active ? 'text-text' : 'text-muted hover:text-text'
                }`}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-[13px] h-px bg-primary"
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </button>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-muted sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            118 / 118
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Đóng menu' : 'Mở menu'}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/6 md:hidden"
            aria-label="Điều hướng di động"
          >
            <ul className="mx-auto max-w-[1440px] px-4 py-2">
              {NAV.map((item) => {
                const Icon = item.icon
                const active = item.match(section)
                return (
                  <li key={item.to}>
                    <button
                      type="button"
                      onClick={() => go(item.to)}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm ${
                        active ? 'bg-primary/10 text-primary' : 'text-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
