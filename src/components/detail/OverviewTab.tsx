import { CATEGORIES } from '../../data/categories'
import { formatKelvin, type Element } from '../../data/elements'
import { DataRow, SectionTitle } from './DataRow'

export function OverviewTab({ element }: { element: Element }) {
  const cat = CATEGORIES[element.category]
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]"
          style={{ borderColor: `${cat.color}66`, background: cat.tint, color: cat.color }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: cat.color }} />
          {cat.labelVi}
        </span>
        <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-faint">
          {element.block}-block
        </span>
        <span className="rounded-full border border-line px-2.5 py-1 text-[10px] text-faint">
          {element.stateAt298} ở 298 K
        </span>
        {element.radioactive && (
          <span className="rounded-full border border-[#F97362]/40 bg-[#F97362]/10 px-2.5 py-1 text-[10px] text-[#F97362]">
            Phóng xạ
          </span>
        )}
      </div>

      <div>
        <SectionTitle hint="Z / ký hiệu">Định danh</SectionTitle>
        <dl>
          <DataRow label="Số hiệu nguyên tử (Z)" value={element.z} note="= số proton" />
          <DataRow label="Ký hiệu hoá học" value={<span className="font-display">{element.symbol}</span>} />
          <DataRow label="Tên tiếng Việt" value={element.nameVi} />
          <DataRow label="Tên tiếng Anh" value={element.nameEn} />
          <DataRow
            label="Nguyên tử khối tương đối"
            value={element.mass}
            unit="u"
            note="giá trị chuẩn IUPAC"
          />
        </dl>
      </div>

      <div>
        <SectionTitle hint={`đồng vị ${element.isotope}${element.symbol}`}>Cấu tạo nguyên tử trung hoà</SectionTitle>
        <dl>
          <DataRow label="Proton" value={element.z} unit="hạt" />
          <DataRow
            label="Neutron"
            value={element.neutrons}
            unit="hạt"
            note={`theo ${element.isotope}${element.symbol}`}
          />
          <DataRow label="Electron" value={element.z} unit="hạt" note="trạng thái trung hoà" />
          <DataRow label="Cấu hình electron" value={<span className="text-[11px]">{element.configShort}</span>} />
          <DataRow label="Phân bố theo lớp" value={element.shells.join(' · ')} note="K, L, M, …" />
          <DataRow
            label="Nhóm / chu kỳ"
            value={
              element.category === 'lanthanide' || element.category === 'actinide'
                ? `f-block / ${element.period}`
                : `${element.group} / ${element.period}`
            }
          />
        </dl>
      </div>

      <div>
        <SectionTitle hint="điều kiện thường">Trạng thái vật lý</SectionTitle>
        <dl>
          <DataRow label="Nhiệt độ nóng chảy" value={formatKelvin(element.melt)} />
          <DataRow label="Nhiệt độ sôi" value={formatKelvin(element.boil)} />
        </dl>
      </div>

      <div>
        <SectionTitle>Phát hiện</SectionTitle>
        <dl>
          <DataRow
            label="Năm"
            value={element.year === null ? '—' : element.year < 0 ? `≈ ${Math.abs(element.year)} TCN` : element.year}
            note={element.year !== null && element.year < 0 ? 'thời cổ đại' : undefined}
          />
          <DataRow label="Người phát hiện" value={element.discoverer ?? 'Không rõ'} />
        </dl>
      </div>

      <blockquote
        className="rounded-lg border border-line bg-surface-2/60 p-3.5 text-[12px] leading-relaxed text-muted"
        style={{ borderLeft: `2px solid ${cat.color}` }}
      >
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          Sự thật thú vị
        </span>
        {element.fact}
      </blockquote>
    </div>
  )
}
