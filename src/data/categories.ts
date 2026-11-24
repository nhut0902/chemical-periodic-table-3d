export type CategoryKey =
  | 'alkali'
  | 'alkaline'
  | 'transition'
  | 'post'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble'
  | 'lanthanide'
  | 'actinide'

export interface CategoryMeta {
  key: CategoryKey
  labelVi: string
  labelEn: string
  color: string
  tint: string
  note: string
}

export const CATEGORIES: Record<CategoryKey, CategoryMeta> = {
  alkali: {
    key: 'alkali',
    labelVi: 'Kim loại kiềm',
    labelEn: 'Alkali metal',
    color: '#F97362',
    tint: 'rgba(249, 115, 98, 0.12)',
    note: 'Nhóm 1 (trừ H): 1 electron hoá trị, phản ứng mạnh với nước.',
  },
  alkaline: {
    key: 'alkaline',
    labelVi: 'Kim loại kiềm thổ',
    labelEn: 'Alkaline earth metal',
    color: '#F4A259',
    tint: 'rgba(244, 162, 89, 0.12)',
    note: 'Nhóm 2: 2 electron hoá trị, tạo cation 2+.',
  },
  transition: {
    key: 'transition',
    labelVi: 'Kim loại chuyển tiếp',
    labelEn: 'Transition metal',
    color: '#E9C46A',
    tint: 'rgba(233, 196, 106, 0.12)',
    note: 'Nhóm 3–12: orbital d đang được điền, nhiều trạng thái oxy hoá.',
  },
  post: {
    key: 'post',
    labelVi: 'Kim loại hậu chuyển tiếp',
    labelEn: 'Post-transition metal',
    color: '#7DD3A7',
    tint: 'rgba(125, 211, 167, 0.12)',
    note: 'Kim loại mềm, nhiệt độ nóng chảy thấp hơn kim loại chuyển tiếp.',
  },
  metalloid: {
    key: 'metalloid',
    labelVi: 'Á kim',
    labelEn: 'Metalloid',
    color: '#4FD1C5',
    tint: 'rgba(79, 209, 197, 0.12)',
    note: 'Tính chất trung gian giữa kim loại và phi kim; thường là bán dẫn.',
  },
  nonmetal: {
    key: 'nonmetal',
    labelVi: 'Phi kim',
    labelEn: 'Reactive nonmetal',
    color: '#38BDF8',
    tint: 'rgba(56, 189, 248, 0.12)',
    note: 'Độ âm điện cao, nhận electron để tạo anion hoặc liên kết cộng hoá trị.',
  },
  halogen: {
    key: 'halogen',
    labelVi: 'Halogen',
    labelEn: 'Halogen',
    color: '#63A9FF',
    tint: 'rgba(99, 169, 255, 0.12)',
    note: 'Nhóm 17: 7 electron hoá trị, rất ái electron, tạo muối với kim loại.',
  },
  noble: {
    key: 'noble',
    labelVi: 'Khí hiếm',
    labelEn: 'Noble gas',
    color: '#A78BFA',
    tint: 'rgba(167, 139, 250, 0.12)',
    note: 'Nhóm 18: lớp ngoài bão hoà, hoá tính rất thấp.',
  },
  lanthanide: {
    key: 'lanthanide',
    labelVi: 'Lanthanide',
    labelEn: 'Lanthanide',
    color: '#E879C4',
    tint: 'rgba(232, 121, 196, 0.12)',
    note: 'Nhóm đất hiếm 4f: tính chất hoá học rất giống nhau.',
  },
  actinide: {
    key: 'actinide',
    labelVi: 'Actinide',
    labelEn: 'Actinide',
    color: '#C084FC',
    tint: 'rgba(192, 132, 252, 0.12)',
    note: 'Nhóm 5f: đều phóng xạ, hạt nhân không bền.',
  },
}

export const CATEGORY_ORDER: CategoryKey[] = [
  'alkali',
  'alkaline',
  'transition',
  'post',
  'metalloid',
  'nonmetal',
  'halogen',
  'noble',
  'lanthanide',
  'actinide',
]
