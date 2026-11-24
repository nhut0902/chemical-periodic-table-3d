import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, RotateCcw, X } from 'lucide-react'
import { QUESTIONS } from '../data/quiz'
import { ELEMENTS } from '../data/elements'
import { DISCLAIMER, SOURCES } from '../data/sources'

const CONCEPTS = [
  {
    index: '01',
    title: 'Cấu tạo nguyên tử',
    body: 'Nguyên tử gồm hạt nhân (proton mang điện +1, neutron không mang điện) và các electron (điện −1). Hạt nhân chiếm gần như toàn bộ khối lượng nhưng chỉ một phần cực nhỏ thể tích; phần còn lại là vùng không gian mà electron có thể xuất hiện.',
    bullets: [
      'Proton quyết định danh tính nguyên tố.',
      'Neutron quyết định đồng vị và độ bền hạt nhân.',
      'Electron quyết định hoá tính và liên kết.',
    ],
    formula: 'A = Z + N',
  },
  {
    index: '02',
    title: 'Số hiệu nguyên tử',
    body: 'Số hiệu nguyên tử Z là số proton trong hạt nhân và cũng là số thứ tự trong bảng tuần hoàn. Với nguyên tử trung hoà, Z bằng số electron. Mọi nguyên tử cùng Z là cùng một nguyên tố, dù số neutron khác nhau.',
    bullets: [
      'Z thay đổi → nguyên tố khác.',
      'Cùng Z, khác N → đồng vị.',
      'Ion: electron khác Z nên có điện tích.',
    ],
    formula: 'Z ≡ số proton',
  },
  {
    index: '03',
    title: 'Nguyên tử khối',
    body: 'Nguyên tử khối tương đối (đơn vị u) là khối lượng trung bình có trọng số của các đồng vị tự nhiên, tính theo độ phổ biến. Số khối A chỉ là tổng proton và neutron của một đồng vị cụ thể, luôn là số nguyên.',
    bullets: [
      '1 u ≈ 1/12 khối lượng nguyên tử ¹²C.',
      'Ví dụ: Cl có 35,45 u vì ³⁵Cl chiếm ~75,8%.',
      'Khối lượng electron rất nhỏ, thường bỏ qua.',
    ],
    formula: 'm̄ = Σ (độ phổ biến × A)',
  },
  {
    index: '04',
    title: 'Cấu hình electron',
    body: 'Electron điền vào các orbital theo mức năng lượng tăng dần (Aufbau/Madelung), mỗi orbital tối đa 2 electron trái chiều spin (Pauli), và các orbital cùng mức nhận electron độc thân trước (Hund). Cấu hình electron giải thích vị trí nhóm, chu kỳ và nhiều tính chất hoá học.',
    bullets: [
      'Thứ tự điền: 1s 2s 2p 3s 3p 4s 3d 4p…',
      'Lớp n chứa tối đa 2n² electron.',
      'Có 20 ngoại lệ đã biết (Cr, Cu, Pd, Au…).',
    ],
    formula: '2n² · Pauli · Hund',
  },
  {
    index: '05',
    title: 'Chu kỳ và nhóm',
    body: 'Chu kỳ = số lớp electron đang dùng (n lớn nhất). Nhóm của nguyên tố nhóm A = số electron hoá trị: nhóm 1–2 là s, nhóm 13–18 là p. Các nguyên tố d và f được xếp thành các khối riêng với quy ước hiển thị tách hàng ở lanthanide và actinide.',
    bullets: [
      'Chu kỳ 3 → lớp ngoài cùng n = 3.',
      'Nhóm 17 → 7 electron hoá trị.',
      'Bán kính giảm dần trong một chu kỳ.',
    ],
    formula: 'chu kỳ = n_max',
  },
  {
    index: '06',
    title: 'Bohr và orbital lượng tử',
    body: 'Mô hình Bohr vẽ electron trên những quỹ đạo tròn xác định — hữu ích để đếm lớp nhưng không đúng với tự nhiên. Cơ học lượng tử mô tả electron bằng hàm sóng: chỉ xác định được xác suất tìm thấy electron, thể hiện qua hình dạng orbital s, p, d, f.',
    bullets: [
      'Bohr: minh hoạ, dễ hiểu, không chính xác tuyệt đối.',
      'Orbital: mô tả xác suất, phù hợp thực nghiệm.',
      'Ứng dụng dùng cả hai, có ghi chú rõ ràng.',
    ],
    formula: '|ψ|² = mật độ xác suất',
  },
]

function Quiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [index, setIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const q = QUESTIONS[index]
  const selected = answers[q.id]
  const answered = selected !== undefined
  const score = useMemo(
    () => QUESTIONS.filter((item) => answers[item.id] === item.answer).length,
    [answers],
  )
  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100

  const choose = (i: number) => {
    if (answered) return
    setAnswers((prev) => ({ ...prev, [q.id]: i }))
  }

  const next = () => {
    if (index < QUESTIONS.length - 1) setIndex((i) => i + 1)
    else setShowResult(true)
  }

  const reset = () => {
    setAnswers({})
    setIndex(0)
    setShowResult(false)
  }

  if (showResult) {
    const pct = Math.round((score / QUESTIONS.length) * 100)
    return (
      <div className="panel p-5">
        <p className="label-xs mb-2">Kết quả</p>
        <p className="num text-[40px] font-medium leading-none text-text">
          {score}
          <span className="text-[18px] text-faint">/{QUESTIONS.length}</span>
        </p>
        <p className="mt-2 text-[13px] text-muted">
          {pct >= 80
            ? 'Rất tốt — bạn đã nắm vững cấu tạo nguyên tử và xu hướng tuần hoàn.'
            : pct >= 50
              ? 'Khá ổn. Hãy xem lại phần cấu hình electron và đồng vị.'
              : 'Hãy đọc lại các mục lý thuyết bên trái rồi thử lại.'}
        </p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex h-9 items-center gap-2 rounded-md border border-line px-3 text-[12px] text-text hover:border-primary/40"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Làm lại
        </button>
      </div>
    )
  }

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-line px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="label-xs">Câu hỏi trắc nghiệm</p>
          <p className="num text-[10px] text-faint">
            {index + 1}/{QUESTIONS.length} · {Object.keys(answers).length} đã trả lời
          </p>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="p-4">
        <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-faint">{q.topic}</p>
        <p className="text-[13px] font-medium leading-relaxed text-text">{q.question}</p>

        <div className="mt-3 space-y-1.5">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.answer
            const isPicked = selected === i
            let style = 'border-line text-muted hover:border-primary/40 hover:text-text'
            if (answered) {
              if (isCorrect) style = 'border-[#7DD3A7]/60 bg-[#7DD3A7]/10 text-[#7DD3A7]'
              else if (isPicked) style = 'border-[#F97362]/60 bg-[#F97362]/10 text-[#F97362]'
              else style = 'border-line/60 text-faint'
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => choose(i)}
                disabled={answered}
                className={`flex w-full items-start gap-2.5 rounded-md border px-3 py-2 text-left text-[12px] transition-colors ${style}`}
              >
                <span className="mt-0.5 font-mono text-[10px] opacity-60">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{opt}</span>
                {answered && isCorrect && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                {answered && isPicked && !isCorrect && (
                  <X className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                )}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="mt-3 rounded-md border border-line bg-surface-2/50 p-3">
            <p className="text-[11px] leading-relaxed text-muted">{q.explanation}</p>
            <button
              type="button"
              onClick={next}
              className="mt-3 inline-flex h-8 items-center gap-1.5 rounded bg-primary px-3 text-[11px] font-medium text-abyss"
            >
              {index < QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function LearnView() {
  const blockCounts = useMemo(() => {
    const counts = { s: 0, p: 0, d: 0, f: 0 }
    for (const el of ELEMENTS) counts[el.block] += 1
    return counts
  }, [])

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-8 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <p className="label-xs mb-2">Education mode</p>
        <h1 className="font-display text-[30px] font-medium tracking-tight text-text sm:text-[36px]">
          Hiểu nguyên tử, không chỉ nhìn
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Sáu khái niệm nền tảng giải thích điều gì đang diễn ra trong mô hình 3D, kèm bộ câu hỏi
          trắc nghiệm có đáp án và lời giải cho từng câu.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="space-y-8">
          {CONCEPTS.map((c) => (
            <section key={c.index} className="border-t border-line/70 pt-5">
              <div className="flex items-baseline gap-3">
                <span className="num text-[11px] text-faint">{c.index}</span>
                <h2 className="font-display text-[17px] font-medium text-text">{c.title}</h2>
              </div>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted">{c.body}</p>
              <ul className="mt-3 space-y-1">
                {c.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-[12px] text-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/70" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className="num mt-3 inline-block rounded border border-line bg-surface px-2 py-1 text-[11px] text-primary">
                {c.formula}
              </p>
            </section>
          ))}

          <section className="border-t border-line/70 pt-5">
            <h2 className="font-display text-[17px] font-medium text-text">Bốn khối orbital</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(['s', 'p', 'd', 'f'] as const).map((b) => (
                <div key={b} className="rounded-lg border border-line bg-surface p-3">
                  <p className="font-display text-[20px] leading-none text-primary">{b}</p>
                  <p className="num mt-1 text-[16px] text-text">{blockCounts[b]}</p>
                  <p className="text-[10px] text-faint">nguyên tố</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-4 lg:sticky lg:top-[88px] lg:self-start">
          <Quiz />

          <div className="panel p-4">
            <p className="label-xs mb-2">Nguồn tham khảo</p>
            <ul className="space-y-1.5">
              {SOURCES.slice(0, 4).map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[11px] leading-snug text-muted hover:text-primary"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-line/60 pt-2 text-[10px] leading-relaxed text-faint">
              {DISCLAIMER}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
