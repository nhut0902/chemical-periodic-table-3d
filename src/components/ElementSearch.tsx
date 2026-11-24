import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import { searchElements, type Element } from '../data/elements'
import { CATEGORIES } from '../data/categories'

interface ElementSearchProps {
  onSelect: (element: Element) => void
  placeholder?: string
  size?: 'md' | 'lg'
  hint?: string
}

export function ElementSearch({
  onSelect,
  placeholder = 'Tìm nguyên tố: vàng, Au, 79…',
  size = 'md',
  hint,
}: ElementSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => searchElements(query).slice(0, 7), [query])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const choose = (el: Element) => {
    setOpen(false)
    setQuery('')
    onSelect(el)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % Math.max(1, results.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + Math.max(1, results.length)) % Math.max(1, results.length))
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault()
      choose(results[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <div
        className={`flex items-center gap-2 rounded-lg border border-line bg-surface/90 px-3 transition-colors focus-within:border-primary/60 ${
          size === 'lg' ? 'h-14 rounded-xl px-4' : 'h-11'
        }`}
        style={{ height: size === 'lg' ? 56 : 44 }}
      >
        <Search className={`shrink-0 text-faint ${size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Tìm kiếm nguyên tố"
          aria-expanded={open && query.length > 0}
          aria-controls="element-search-results"
          role="combobox"
          aria-autocomplete="list"
          className={`w-full bg-transparent text-text placeholder:text-faint focus:outline-none ${
            size === 'lg' ? 'text-[15px]' : 'text-[13px]'
          }`}
        />
        {hint && (
          <span className="hidden shrink-0 items-center gap-1 rounded border border-line px-1.5 py-0.5 font-mono text-[9px] text-faint sm:flex">
            {hint}
          </span>
        )}
      </div>

      {open && query.trim().length > 0 && (
        <ul
          id="element-search-results"
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-80 overflow-auto rounded-lg border border-line bg-surface p-1 shadow-[var(--shadow-float)]"
        >
          {results.length === 0 && (
            <li className="px-3 py-3 text-[12px] text-muted">
              Không tìm thấy nguyên tố khớp “{query}”.
            </li>
          )}
          {results.map((el, i) => (
            <li key={el.z} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(el)}
                className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors ${
                  i === active ? 'bg-surface-2' : ''
                }`}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded border font-display text-[12px] font-semibold"
                  style={{
                    borderColor: `${CATEGORIES[el.category].color}66`,
                    color: CATEGORIES[el.category].color,
                    background: CATEGORIES[el.category].tint,
                  }}
                >
                  {el.symbol}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] text-text">
                    {el.nameVi} <span className="text-faint">· {el.nameEn}</span>
                  </span>
                  <span className="num block text-[10px] text-faint">
                    Z={el.z} · {CATEGORIES[el.category].labelVi}
                  </span>
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-faint" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {size === 'lg' && (
        <p className="mt-2 text-[11px] text-faint">
          Gợi ý: nhập số hiệu (79), ký hiệu (Au) hoặc tên tiếng Việt (vàng).
        </p>
      )}
    </div>
  )
}
