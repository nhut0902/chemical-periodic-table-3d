import { ArrowUpRight } from 'lucide-react'
import { SOURCES, DISCLAIMER } from '../../data/sources'

export function Footer({ navigate }: { navigate: (to: string) => void }) {
  return (
    <footer className="mt-24 border-t border-line/70 bg-abyss-soft">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr_0.8fr]">
        <div>
          <p className="font-display text-[13px] font-semibold tracking-[0.16em] text-text">
            THE PERIODIC TABLE
          </p>
          <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-muted">
            Không gian tương tác về 118 nguyên tố hoá học: bảng tuần hoàn theo IUPAC, mô hình nguyên
            tử Three.js và các công cụ so sánh dữ liệu phục vụ học tập.
          </p>
          <p className="mt-4 max-w-md text-[11px] leading-relaxed text-faint">{DISCLAIMER}</p>
          <div className="mt-5 flex gap-4 text-[12px]">
            <button type="button" onClick={() => navigate('/explorer')} className="text-primary link-underline">
              Khám phá 3D
            </button>
            <button type="button" onClick={() => navigate('/lab')} className="text-primary link-underline">
              Phòng thí nghiệm
            </button>
            <button type="button" onClick={() => navigate('/learn')} className="text-primary link-underline">
              Học tập
            </button>
          </div>
        </div>

        <div>
          <p className="label-xs mb-3">Nguồn dữ liệu</p>
          <ul className="space-y-2.5">
            {SOURCES.map((s) => (
              <li key={s.label}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-start gap-1.5 text-[12px] text-muted hover:text-text"
                >
                  <span className="min-w-0">
                    <span className="block">{s.label}</span>
                    <span className="block text-[10px] text-faint">{s.detail}</span>
                  </span>
                  <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 text-faint group-hover:text-primary" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-xs mb-3">Ghi chú khoa học</p>
          <ul className="space-y-2 text-[11px] leading-relaxed text-faint">
            <li>Khối lượng nguyên tử là khối lượng tương đối chuẩn (u), không phải số khối.</li>
            <li>Số neutron hiển thị theo đồng vị phổ biến nhất, được ghi rõ trong hồ sơ.</li>
            <li>Nhiệt độ nóng chảy / sôi quy về K ở 1 atm; quy đổi °C hiển thị kèm.</li>
            <li>Giá trị “—” nghĩa là không có dữ liệu tin cậy, không phải số 0.</li>
            <li>Electron trong mô hình Bohr là minh hoạ, không phải quỹ đạo thực.</li>
          </ul>
          <p className="mt-6 font-mono text-[10px] text-faint">
            React · TypeScript · Three.js · R3F · D3-free charts (Recharts)
          </p>
        </div>
      </div>
      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-1 px-4 py-4 text-[10px] text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Dự án trực quan hoá khoa học — dữ liệu hoá học tham chiếu IUPAC / NIST / CIAAW.</p>
          <p className="num">118 elements · 7 periods · 10 categories</p>
        </div>
      </div>
    </footer>
  )
}
