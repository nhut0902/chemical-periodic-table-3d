import { ArrowUpRight, Box, Orbit, Waves } from 'lucide-react'
import { SHELL_COLORS, SHELL_NAMES, type Element } from '../../data/elements'
import { DISCLAIMER } from '../../data/sources'
import { SectionTitle } from './DataRow'

export function AtomTab({ element, onExplorer }: { element: Element; onExplorer: () => void }) {
  const subshells = element.config.map((s) => `${s.n}${['s', 'p', 'd', 'f'][s.l]}${s.count}`).join('  ')

  return (
    <div className="space-y-7">
      <div>
        <SectionTitle hint={`${element.isotope}${element.symbol}`}>Thành phần mô hình</SectionTitle>
        <dl className="space-y-2.5">
          <div className="flex items-center justify-between gap-4 border-b border-line/50 pb-2">
            <dt className="flex items-center gap-2 text-[12px] text-muted">
              <span className="h-2 w-2 rounded-full bg-[#F97362]" /> Proton
            </dt>
            <dd className="num text-[13px] text-text">{element.z}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-line/50 pb-2">
            <dt className="flex items-center gap-2 text-[12px] text-muted">
              <span className="h-2 w-2 rounded-full bg-[#94A3B8]" /> Neutron
            </dt>
            <dd className="num text-[13px] text-text">
              {element.neutrons}{' '}
              <span className="text-[10px] text-faint">theo đồng vị {element.isotope}{element.symbol}</span>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-line/50 pb-2">
            <dt className="flex items-center gap-2 text-[12px] text-muted">
              <span className="h-2 w-2 rounded-full bg-primary" /> Electron (trung hoà)
            </dt>
            <dd className="num text-[13px] text-text">{element.z}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-2 text-[12px] text-muted">
              <Waves className="h-3.5 w-3.5 text-accent" /> Lớp electron
            </dt>
            <dd className="num text-[13px] text-text">{element.shells.length}</dd>
          </div>
        </dl>
      </div>

      <div>
        <SectionTitle hint="K → Q">Electron theo lớp</SectionTitle>
        <div className="space-y-1.5">
          {element.shells.map((count, i) => (
            <div key={i} className="flex items-center gap-2.5 text-[11px]">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: SHELL_COLORS[i % SHELL_COLORS.length] }}
              />
              <span className="w-16 text-muted">
                {SHELL_NAMES[i]} (n={i + 1})
              </span>
              <span className="num text-text">{count} e⁻</span>
              <span className="ml-auto font-mono text-[10px] text-faint">
                tối đa {2 * (i + 1) ** 2}
              </span>
            </div>
          ))}
        </div>
        <p className="num mt-2 text-[10px] text-faint">{subshells}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-line p-3.5">
          <p className="flex items-center gap-2 text-[11px] font-medium text-primary">
            <Box className="h-3.5 w-3.5" /> Bohr · minh hoạ
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
            Electron được đặt trên các vòng tròn tượng trưng cho lớp K, L, M… phục vụ việc đếm và
            ghi nhớ phân bố electron.
          </p>
        </div>
        <div className="rounded-lg border border-line p-3.5">
          <p className="flex items-center gap-2 text-[11px] font-medium text-accent">
            <Orbit className="h-3.5 w-3.5" /> Orbital · xác suất
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
            Đám mây điểm mô phỏng mật độ xác suất |ψ|² với cấu trúc lobe của phân lớp s, p, d, f.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-surface-2/40 p-3.5">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          Lưu ý khoa học
        </p>
        <p className="text-[11px] leading-relaxed text-muted">{DISCLAIMER}</p>
      </div>

      <div>
        <SectionTitle>Điều khiển</SectionTitle>
        <ul className="space-y-1 text-[11px] text-muted">
          <li>• Kéo chuột / một ngón: xoay 360°.</li>
          <li>• Cuộn chuột / chụm hai ngón: zoom.</li>
          <li>• Chuột phải / hai ngón: pan.</li>
          <li>• Nút “Camera” đưa góc nhìn về mặc định.</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={onExplorer}
        className="group inline-flex items-center gap-2 text-[12px] text-primary"
      >
        Mở mô hình lớn trong Khám phá 3D
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </button>
    </div>
  )
}
