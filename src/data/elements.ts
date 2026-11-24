import { RAW_A } from './rawA'
import { RAW_B } from './rawB'
import type { CategoryKey } from './categories'

export type Block = 's' | 'p' | 'd' | 'f'

export interface Subshell {
  n: number
  l: number
  count: number
}

export interface Element {
  z: number
  symbol: string
  nameEn: string
  nameVi: string
  mass: number
  group: number
  period: number
  category: CategoryKey
  melt: number | null
  boil: number | null
  density: number | null
  en: number | null
  radius: number | null
  ionization: number | null
  year: number | null
  discoverer: string | null
  applications: string
  fact: string
  /** Most abundant (or longest-lived) isotope mass number used for the nucleus model. */
  isotope: number
  neutrons: number
  config: Subshell[]
  configString: string
  configShort: string
  shells: number[]
  block: Block
  valenceElectrons: number
  /** True when every isotope is radioactive (Z ≥ 84, plus Tc and Pm). */
  radioactive: boolean
  stateAt298: 'rắn' | 'lỏng' | 'khí' | 'không xác định'
  /** Grid placement: 18 columns, rows 1..7 then f-block rows 9 and 10. */
  col: number
  row: number
}

const L_LETTER = ['s', 'p', 'd', 'f']
const L_CAPACITY = [2, 6, 10, 14]

/** Aufbau (Madelung) filling order. */
const AUFBAU: Array<[number, number]> = [
  [1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [4, 0], [3, 2], [4, 1],
  [5, 0], [4, 2], [5, 1], [6, 0], [4, 3], [5, 2], [6, 1], [7, 0],
  [5, 3], [6, 2], [7, 1],
]

/**
 * Documented ground-state exceptions to the aufbau rule (NIST Atomic Spectra
 * Database). Listed as full subshell occupation overrides.
 */
const CONFIG_EXCEPTIONS: Record<number, Array<[number, number, number]>> = {
  24: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 5], [4, 0, 1]],
  29: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 1]],
  41: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 4], [5, 0, 1]],
  42: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 5], [5, 0, 1]],
  44: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 7], [5, 0, 1]],
  45: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 8], [5, 0, 1]],
  46: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 10]],
  47: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 10], [5, 0, 1]],
  57: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 10], [4, 3, 0], [5, 0, 2], [5, 1, 6], [5, 2, 1], [6, 0, 2]],
  58: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 10], [4, 3, 1], [5, 0, 2], [5, 1, 6], [5, 2, 1], [6, 0, 2]],
  64: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 10], [4, 3, 7], [5, 0, 2], [5, 1, 6], [5, 2, 1], [6, 0, 2]],
  78: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 10], [4, 3, 14], [5, 0, 2], [5, 1, 6], [5, 2, 9], [6, 0, 1]],
  79: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 10], [4, 3, 14], [5, 0, 2], [5, 1, 6], [5, 2, 10], [6, 0, 1]],
  89: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 10], [4, 3, 14], [5, 0, 2], [5, 1, 6], [5, 2, 10], [5, 3, 0], [6, 0, 2], [6, 1, 6], [6, 2, 1], [7, 0, 2]],
  90: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 10], [4, 3, 14], [5, 0, 2], [5, 1, 6], [5, 2, 10], [5, 3, 0], [6, 0, 2], [6, 1, 6], [6, 2, 2], [7, 0, 2]],
  91: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 10], [4, 3, 14], [5, 0, 2], [5, 1, 6], [5, 2, 10], [5, 3, 2], [6, 0, 2], [6, 1, 6], [6, 2, 1], [7, 0, 2]],
  92: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 10], [4, 3, 14], [5, 0, 2], [5, 1, 6], [5, 2, 10], [5, 3, 3], [6, 0, 2], [6, 1, 6], [6, 2, 1], [7, 0, 2]],
  93: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 10], [4, 3, 14], [5, 0, 2], [5, 1, 6], [5, 2, 10], [5, 3, 4], [6, 0, 2], [6, 1, 6], [6, 2, 1], [7, 0, 2]],
  96: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 10], [4, 3, 14], [5, 0, 2], [5, 1, 6], [5, 2, 10], [5, 3, 7], [6, 0, 2], [6, 1, 6], [6, 2, 1], [7, 0, 2]],
  103: [[1, 0, 2], [2, 0, 2], [2, 1, 6], [3, 0, 2], [3, 1, 6], [3, 2, 10], [4, 0, 2], [4, 1, 6], [4, 2, 10], [4, 3, 14], [5, 0, 2], [5, 1, 6], [5, 2, 10], [5, 3, 14], [6, 0, 2], [6, 1, 6], [6, 2, 0], [7, 0, 2], [7, 1, 1]],
}

/** Mass number of the most abundant (or longest-lived) isotope, Z = 1..118. */
const ISOTOPE_MASS: number[] = [
  1, 4, 7, 9, 11, 12, 14, 16, 19, 20, 23, 24, 27, 28, 31, 32, 35, 40, 39, 40,
  45, 48, 51, 52, 55, 56, 59, 58, 63, 64, 69, 74, 75, 80, 79, 84, 85, 88, 89, 90,
  93, 98, 98, 102, 103, 106, 107, 114, 115, 120, 121, 130, 127, 132, 133, 138, 139, 140, 141, 142,
  145, 152, 153, 158, 159, 164, 165, 166, 169, 174, 175, 180, 181, 184, 187, 192, 193, 195, 197, 202,
  205, 208, 209, 209, 210, 222, 223, 226, 227, 232, 231, 238, 237, 244, 243, 247, 247, 251, 252, 257,
  258, 259, 266, 267, 268, 269, 270, 269, 278, 281, 282, 285, 286, 289, 290, 293, 294, 294,
]

const NOBLE_CORES: Array<[number, string]> = [
  [2, 'He'], [10, 'Ne'], [18, 'Ar'], [36, 'Kr'], [54, 'Xe'], [86, 'Rn'],
]

function buildConfig(z: number): Subshell[] {
  const override = CONFIG_EXCEPTIONS[z]
  if (override && override.reduce((sum, [, , c]) => sum + c, 0) === z) {
    return override.filter(([, , c]) => c > 0).map(([n, l, count]) => ({ n, l, count }))
  }
  let left = z
  const result: Subshell[] = []
  for (const [n, l] of AUFBAU) {
    if (left <= 0) break
    const count = Math.min(left, L_CAPACITY[l])
    result.push({ n, l, count })
    left -= count
  }
  return result
}

function formatTerm(n: number, l: number, count: number) {
  const sup = String(count)
    .split('')
    .map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)])
    .join('')
  return `${n}${L_LETTER[l]}${sup}`
}

function shortConfig(config: Subshell[], z: number): string {
  let coreIdx = -1
  for (let i = 0; i < NOBLE_CORES.length; i++) {
    if (NOBLE_CORES[i][0] < z) coreIdx = i
  }
  if (coreIdx < 0) return config.map((s) => formatTerm(s.n, s.l, s.count)).join(' ')
  const [coreZ, coreSymbol] = NOBLE_CORES[coreIdx]
  let toRemove = coreZ
  const parts: string[] = []
  for (const s of config) {
    const removed = Math.min(toRemove, s.count)
    toRemove -= removed
    if (s.count - removed > 0) parts.push(formatTerm(s.n, s.l, s.count - removed))
  }
  return `[${coreSymbol}] ${parts.join(' ')}`.trim()
}

function stateAt(melt: number | null, boil: number | null): Element['stateAt298'] {
  if (melt === null) return 'không xác định'
  if (melt > 298.15) return 'rắn'
  if (boil !== null && boil > 298.15) return 'lỏng'
  return 'khí'
}

function parseRows(raw: string, startZ: number): Array<Record<string, string>> {
  const rows = raw
    .trim()
    .split('\n')
    .filter((line) => line.includes('|'))
  return rows.map((line, i) => {
    const f = line.split('|').map((s) => s.trim())
    if (f.length !== 17) {
      throw new Error(`Element row ${startZ + i} has ${f.length} fields, expected 17`)
    }
    return {
      symbol: f[0], nameEn: f[1], nameVi: f[2], mass: f[3], group: f[4], period: f[5],
      category: f[6], melt: f[7], boil: f[8], density: f[9], en: f[10], radius: f[11],
      ionization: f[12], year: f[13], discoverer: f[14], applications: f[15], fact: f[16],
    }
  })
}

const num = (v: string): number | null => {
  if (v === '-' || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function gridPosition(z: number, group: number, period: number): { col: number; row: number } {
  if (z >= 57 && z <= 71) return { col: 3 + (z - 57), row: 9 }
  if (z >= 89 && z <= 103) return { col: 3 + (z - 89), row: 10 }
  return { col: group, row: period }
}

function buildElement(rec: Record<string, string>, index: number): Element {
  const z = index + 1
  const group = Number(rec.group)
  const period = Number(rec.period)
  const category = rec.category as CategoryKey
  const melt = num(rec.melt)
  const boil = num(rec.boil)
  const config = buildConfig(z)
  const shells: number[] = []
  for (const s of config) shells[s.n - 1] = (shells[s.n - 1] ?? 0) + s.count
  for (let i = 0; i < shells.length; i++) shells[i] = shells[i] ?? 0
  const isotope = ISOTOPE_MASS[z - 1]
  const block: Block =
    category === 'lanthanide' || category === 'actinide'
      ? 'f'
      : group === 1 || group === 2 || z === 2
        ? 's'
        : group >= 13
          ? 'p'
          : 'd'
  const valence = shells[shells.length - 1] ?? 0
  const pos = gridPosition(z, group, period)
  return {
    z,
    symbol: rec.symbol,
    nameEn: rec.nameEn,
    nameVi: rec.nameVi,
    mass: Number(rec.mass),
    group,
    period,
    category,
    melt,
    boil,
    density: num(rec.density),
    en: num(rec.en),
    radius: num(rec.radius),
    ionization: num(rec.ionization),
    year: num(rec.year),
    discoverer: rec.discoverer && rec.discoverer !== '-' ? rec.discoverer : null,
    applications: rec.applications,
    fact: rec.fact,
    isotope,
    neutrons: isotope - z,
    config,
    configString: config.map((s) => formatTerm(s.n, s.l, s.count)).join(' '),
    configShort: shortConfig(config, z),
    shells,
    block,
    valenceElectrons: valence,
    radioactive: z >= 84 || z === 43 || z === 61,
    stateAt298: stateAt(melt, boil),
    col: pos.col,
    row: pos.row,
  }
}

const records = [...parseRows(RAW_A, 1), ...parseRows(RAW_B, 57)]

export const ELEMENTS: Element[] = records.map(buildElement)

if (ELEMENTS.length !== 118) {
  throw new Error(`Dataset integrity: expected 118 elements, parsed ${ELEMENTS.length}`)
}

export const BY_Z = new Map<number, Element>(ELEMENTS.map((e) => [e.z, e]))

export function getElement(z: number): Element {
  const el = BY_Z.get(z)
  if (!el) throw new Error(`Unknown element Z=${z}`)
  return el
}

export function searchElements(query: string): Element[] {
  const q = query.trim().toLowerCase()
  if (!q) return ELEMENTS
  return ELEMENTS.filter((el) => {
    return (
      el.symbol.toLowerCase().includes(q) ||
      el.nameEn.toLowerCase().includes(q) ||
      el.nameVi.toLowerCase().includes(q) ||
      String(el.z) === q ||
      String(el.z).startsWith(q)
    )
  })
}

export const SHELL_NAMES = ['K', 'L', 'M', 'N', 'O', 'P', 'Q']

/** Visible shell colours: a cool → warm ramp, one tint per shell. */
export const SHELL_COLORS = ['#38BDF8', '#60A5FA', '#A78BFA', '#F472B6', '#FB923C', '#FBBF24', '#34D399']

export function formatKelvin(k: number | null): string {
  if (k === null) return '—'
  return `${k.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} K`
}

export function kelvinToCelsius(k: number | null): number | null {
  return k === null ? null : k - 273.15
}

/** Trend series helper: only elements that actually have the metric. */
export function metricSeries(
  metric: 'radius' | 'ionization' | 'en' | 'density' | 'mass',
  period?: number,
): Element[] {
  return ELEMENTS.filter((el) => el[metric] !== null && (period === undefined || el.period === period))
}
