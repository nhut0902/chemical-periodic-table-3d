import { SHELL_COLORS, SHELL_NAMES, type Element, type Subshell } from '../../data/elements'
import { DataRow, SectionTitle } from './DataRow'

const L_LETTER = ['s', 'p', 'd', 'f']

function superscript(n: number) {
  return String(n)
    .split('')
    .map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)])
    .join('')
}

/** Hund's rule: one electron per orbital first, then pair with opposite spin. */
function OrbitalBoxes({ subshell }: { subshell: Subshell }) {
  const orbitals = subshell.l * 2 + 1
  const arrows: string[][] = Array.from({ length: orbitals }, () => [])
  for (let i = 0; i < subshell.count; i++) {
    const box = i < orbitals ? i : i - orbitals
    arrows[box].push(i < orbitals ? '↑' : '↓')
  }
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="num w-14 shrink-0 text-[11px] text-muted">
        {subshell.n}
        {L_LETTER[subshell.l]}
        <sup className="text-[9px] text-faint">{superscript(subshell.count)}</sup>
      </span>
      <div className="flex flex-wrap gap-1">
        {arrows.map((a, i) => (
          <span
            key={i}
            className="flex h-6 w-7 items-center justify-center gap-0.5 rounded-[3px] border border-line/80 bg-abyss-soft font-mono text-[11px] leading-none text-primary"
          >
            {a.join('') || '\u00a0'}
          </span>
        ))}
      </div>
    </div>
  )
}

export function ConfigTab({ element }: { element: Element }) {
  const maxShell = Math.max(...element.shells, 1)
  return (
    <div className="space-y-7">
      <div>
        <SectionTitle hint="NIST ASD">Cấu hình electron</SectionTitle>
        <div className="rounded-lg border border-line bg-abyss-soft p-3.5">
          <p className="num break-words text-[13px] leading-relaxed text-text">
            {element.configString}
          </p>
          <p className="num mt-2 text-[12px] text-primary">{element.configShort}</p>
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-faint">
          Cấu hình trạng thái cơ bản, được tính từ Z theo quy tắc Aufbau/Madelung và hiệu chỉnh các
          ngoại lệ đã công bố (Cr, Cu, Nb, Mo, Ru, Rh, Pd, Ag, La, Ce, Gd, Pt, Au, Ac, Th, Pa, U,
          Np, Cm, Lr). Electron lớp ngoài cùng: {element.valenceElectrons}.
        </p>
      </div>

      <div>
        <SectionTitle hint="Hund's rule">Giản đồ orbital</SectionTitle>
        <div className="divide-y divide-line/40 rounded-lg border border-line px-3 py-1">
          {element.config.map((s) => (
            <OrbitalBoxes key={`${s.n}${s.l}`} subshell={s} />
          ))}
        </div>
        <p className="mt-2 text-[10px] text-faint">
          Mỗi ô là một orbital; mũi tên biểu diễn spin. Quy tắc Hund: các orbital cùng mức năng lượng
          được điền electron độc thân trước.
        </p>
      </div>

      <div>
        <SectionTitle hint="Bohr / shell">Phân bố electron theo lớp</SectionTitle>
        <div className="space-y-2">
          {element.shells.map((count, i) => {
            const n = i + 1
            return (
              <div key={n} className="flex items-center gap-3">
                <span className="w-12 font-mono text-[11px] text-muted">
                  {SHELL_NAMES[i]} <span className="text-faint">n={n}</span>
                </span>
                <div className="relative h-3 flex-1 overflow-hidden rounded-sm bg-surface-2">
                  <div
                    className="absolute inset-y-0 left-0 rounded-sm"
                    style={{
                      width: `${(count / 32) * 100}%`,
                      background: SHELL_COLORS[i % SHELL_COLORS.length],
                      opacity: 0.75,
                    }}
                  />
                </div>
                <span className="num w-8 text-right text-[11px] text-text">{count}</span>
              </div>
            )
          })}
        </div>
        <p className="mt-2 text-[10px] text-faint">
          Thang 0–32 electron (sức chứa tối đa của một lớp theo 2n²). Tổng: {element.z} electron.
        </p>
      </div>

      <div>
        <SectionTitle>Phân lớp theo năng lượng</SectionTitle>
        <dl>
          {element.config.map((s) => (
            <DataRow
              key={`row-${s.n}${s.l}`}
              label={`${s.n}${L_LETTER[s.l]} (l=${s.l})`}
              value={s.count}
              unit="e⁻"
              note={s.count === 2 * (2 * s.l + 1) ? 'bão hoà' : undefined}
            />
          ))}
        </dl>
        <p className="mt-2 text-[10px] text-faint">Lớp ngoài cùng: n = {maxShell}.</p>
      </div>
    </div>
  )
}
