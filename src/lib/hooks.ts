import { useCallback, useEffect, useRef, useState } from 'react'

export interface Route {
  path: string
  segments: string[]
  query: URLSearchParams
}

function readRoute(): Route {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [rawPath, rawQuery = ''] = raw.split('?')
  const path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`
  return {
    path,
    segments: path.split('/').filter(Boolean),
    query: new URLSearchParams(rawQuery),
  }
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(readRoute)

  useEffect(() => {
    const onChange = () => {
      setRoute(readRoute())
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((to: string) => {
    const next = to.startsWith('#') ? to : `#${to}`
    if (window.location.hash === next) {
      setRoute(readRoute())
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      return
    }
    window.location.hash = next
  }, [])

  return { route, navigate }
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

let webglSupport: boolean | null = null
export function supportsWebGL(): boolean {
  if (webglSupport !== null) return webglSupport
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')
    webglSupport = Boolean(gl)
  } catch {
    webglSupport = false
  }
  return webglSupport
}

/** Lightweight tween for numeric values driven by requestAnimationFrame. */
export function useAnimatedNumber(target: number, duration = 600) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const startRef = useRef(0)

  useEffect(() => {
    fromRef.current = value
    startRef.current = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(fromRef.current + (target - fromRef.current) * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  return value
}

export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setWidth(entry.contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, width }
}
