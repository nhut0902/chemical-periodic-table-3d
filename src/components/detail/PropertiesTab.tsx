import { CATEGORIES } from '../../data/categories'
import { formatKelvin, kelvinToCelsius, type Element } from '../../data/elements'
import { DataRow, SectionTitle } from './DataRow'

function Meter({
  label,
  value,
  max,
  unit,
  color,
}: {
  label: string
  value: number | null
  max: number
  unit: string
  color: string
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[11px] text-muted">{label}</span>
        <span className="num text-[11px] text-text">
          {value === null ? '—' : value}
          {value !== null && <span className="ml-1 text-[9px] text-faint">{unit}</span>}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: value === null ? '0%' : `${Math.min(100, (value / max) * 100)}%`,
            background: color,
            opacity: 0.85,
          }}
        />
      </div>
    </div>
  )
}

export function PropertiesTab({ element }: { element: Element }) {
  const cat = CATEGORIES[element.category]
  const celsius = (k: number | null) => {
    const c = kelvinToCelsius(k)
    return c === null ? '—' : `${c.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} °C`
  }

  return (
    <div className="space-y-7">
      <div>
        <SectionTitle hint="20 °C, 1 atm">Dữ liệu vật lý</SectionTitle>
        <dl>
          <DataRow label="Khối lượng mol" value={element.mass} unit="g·mol⁻¹" />
          <DataRow label="Khối lượng riêng" value={element.density ?? null} unit="g·cm⁻³" />
          <DataRow
            label="Nhiệt độ nóng chảy"
            value={`${formatKelvin(element.melt)} · ${celsius(element.melt)}`}
          />
          <DataRow
            label="Nhiệt độ sôi"
            value={`${formatKelvin(element.boil)} · ${celsius(element.boil)}`}
          />
          <DataRow label="Trạng thái ở 298 K" value={element.stateAt298} />
        </dl>
      </div>

      <div>
        <SectionTitle hint="Pauling">Hoá tính</SectionTitle>
        <dl>
          <DataRow
            label="Độ âm điện"
            value={element.en ?? null}
            note="thang Pauling, không đơn vị"
          />
          <DataRow
            label="Bán kính cộng hoá trị"
            value={element.radius ?? null}
            unit="pm"
            note="Cordero 2008"
          />
          <DataRow
            label="Năng lượng ion hoá thứ nhất"
            value={element.ionization ?? null}
            unit="kJ·mol⁻¹"
          />
          <DataRow label="Nhóm phân loại" value={cat.labelVi} />
        </dl>
      </div>

      <div>
        <SectionTitle hint="so với toàn bảng">So sánh nhanh</SectionTitle>
        <div className="space-y-3">
          <Meter
            label="Độ âm điện Pauling"
            value={element.en}
            max={4}
            unit="/ 4,0"
            color={cat.color}
          />
          <Meter
            label="Bán kính cộng hoá trị"
            value={element.radius}
            max={260}
            unit="pm"
            color="#38BDF8"
          />
          <Meter
            label="Năng lượng ion hoá 1"
            value={element.ionization}
            max={2400}
            unit="kJ·mol⁻¹"
            color="#A78BFA"
          />
          <Meter
            label="Khối lượng riêng"
            value={element.density}
            max={22.6}
            unit="g·cm⁻³"
            color="#4FD1C5"
          />
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-faint">
          Các thanh được chuẩn hoá theo giá trị lớn nhất trong toàn bộ 118 nguyên tố. Giá trị “—”
          nghĩa là không có dữ liệu đo tin cậy, không phải bằng 0.
        </p>
      </div>

      <p className="text-[10px] leading-relaxed text-faint">
        Nguồn: IUPAC/CIAAW (khối lượng), CRC Handbook (nhiệt độ, khối lượng riêng, độ âm điện),
        Cordero et al. 2008 (bán kính), NIST ASD (năng lượng ion hoá). Với các nguyên tố siêu nặng,
        nhiều thông số chưa được xác định thực nghiệm.
      </p>
    </div>
  )
}
