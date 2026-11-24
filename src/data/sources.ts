export interface Source {
  label: string
  detail: string
  url: string
}

/** Surfaced in the UI footer and the Education view. */
export const SOURCES: Source[] = [
  {
    label: 'IUPAC — Periodic Table of the Elements',
    detail: 'Số hiệu, nhóm, chu kỳ, khối lượng nguyên tử chuẩn (2021).',
    url: 'https://iupac.org/what-we-do/periodic-table-of-elements/',
  },
  {
    label: 'NIST Atomic Spectra Database',
    detail: 'Cấu hình electron trạng thái cơ bản, năng lượng ion hoá thứ nhất.',
    url: 'https://physics.nist.gov/asd',
  },
  {
    label: 'CIAAW — Standard Atomic Weights',
    detail: 'Khối lượng nguyên tử tương đối và khoảng đồng vị.',
    url: 'https://www.ciaaw.org/atomic-weights.htm',
  },
  {
    label: 'Cordero et al., Dalton Trans. (2008)',
    detail: 'Bán kính cộng hoá trị dùng trong so sánh kích thước nguyên tử.',
    url: 'https://pubs.rsc.org/en/content/articlelanding/2008/dt/b801115j',
  },
  {
    label: 'CRC Handbook of Chemistry and Physics',
    detail: 'Nhiệt độ nóng chảy, nhiệt độ sôi, khối lượng riêng, độ âm điện Pauling.',
    url: 'https://hbcp.chemnetbase.com/',
  },
  {
    label: 'Los Alamos National Laboratory — Periodic Table',
    detail: 'Ứng dụng thực tế và dữ liệu tham khảo cho các nguyên tố.',
    url: 'https://periodic.lanl.gov/',
  },
]

export const DISCLAIMER =
  'Mô hình 3D là công cụ trực quan hoá giáo dục, không theo tỉ lệ thật và không mô tả chuyển động thực của electron. Mô hình Bohr chỉ mang tính minh hoạ; trạng thái lượng tử được trình bày ở chế độ orbital xác suất.'
