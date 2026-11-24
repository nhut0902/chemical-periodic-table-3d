import { memo } from 'react'
import { CATEGORIES } from '../../data/categories'
import type { Element } from '../../data/elements'

interface ElementTileProps {
  element: Element
  dimmed?: boolean
  selected?: boolean
  onSelect: (element: Element) => void
  onHover?: (element: Element | null, rect?: DOMRect) => void
}

function ElementTileBase({ element, dimmed, selected, onSelect, onHover }: ElementTileProps) {
  const cat = CATEGORIES[element.category]
  return (
    <button
      type="button"
      onClick={() => onSelect(element)}
      onMouseEnter={(e) => onHover?.(element, e.currentTarget.getBoundingClientRect())}
      onMouseLeave={() => onHover?.(null)}
      onFocus={(e) => onHover?.(element, e.currentTarget.getBoundingClientRect())}
      onBlur={() => onHover?.(null)}
      aria-label={`${element.nameVi} (${element.symbol}), số hiệu ${element.z}`}
      className="el-tile group relative flex flex-col items-stretch overflow-hidden rounded-[6px] border px-1 pb-[3px] pt-[2px] text-left"
      style={{
        gridColumn: element.col,
        gridRow: element.row + 1,
        height: 'var(--tile-h)',
        borderColor: selected ? cat.color : `${cat.color}4d`,
        background: selected
          ? `linear-gradient(160deg, ${cat.color}33, ${cat.color}14)`
          : `linear-gradient(160deg, ${cat.color}1f, ${cat.color}08)`,
        // custom property consumed by .el-tile:hover
        ['--tile-color' as string]: cat.color,
        opacity: dimmed ? 0.22 : 1,
      }}
    >
      <span className="flex items-start justify-between leading-none">
        <span className="num text-[9px] text-white/45">{element.z}</span>
        {element.radioactive && <span className="text-[8px] text-white/40">☢</span>}
      </span>
      <span
        className="font-display text-[15px] font-semibold leading-none tracking-tight sm:text-[17px]"
        style={{ color: cat.color }}
      >
        {element.symbol}
      </span>
      <span className="mt-auto block w-full truncate whitespace-nowrap text-[8px] leading-tight text-white/55 sm:text-[9px]">
        {element.nameVi}
      </span>
      <span className="num hidden w-full truncate whitespace-nowrap text-[8px] leading-tight text-white/30 sm:block">
        {element.mass.toFixed(element.mass < 100 ? 2 : 1)}
      </span>
    </button>
  )
}

export const ElementTile = memo(ElementTileBase)
