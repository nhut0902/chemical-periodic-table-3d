export interface Question {
  id: number
  topic: string
  question: string
  options: string[]
  answer: number
  explanation: string
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    topic: 'Cấu tạo nguyên tử',
    question: 'Một nguyên tử có số hiệu nguyên tử Z = 26. Số proton trong hạt nhân là bao nhiêu?',
    options: ['13', '26', '52', '56'],
    answer: 1,
    explanation:
      'Số hiệu nguyên tử Z bằng đúng số proton trong hạt nhân. Với Z = 26 (sắt), hạt nhân có 26 proton; nguyên tử trung hoà cũng có 26 electron.',
  },
  {
    id: 2,
    topic: 'Cấu tạo nguyên tử',
    question: 'Nguyên tử trung hoà có 17 proton thì có bao nhiêu electron?',
    options: ['7', '17', '35', '18'],
    answer: 1,
    explanation:
      'Trung hoà về điện nên số electron bằng số proton: 17 electron (clo). Con số 35 là số khối của đồng vị ³⁵Cl, không phải số electron.',
  },
  {
    id: 3,
    topic: 'Cấu hình electron',
    question: 'Cấu hình electron ở trạng thái cơ bản của Na (Z = 11) là',
    options: ['1s² 2s² 2p⁶ 3s¹', '1s² 2s² 2p⁵ 3s²', '1s² 2s² 3s² 3p⁷', '1s² 2s² 2p⁶ 3s²'],
    answer: 0,
    explanation:
      'Điền theo quy tắc Aufbau: 1s²2s²2p⁶ (10 electron) rồi 3s¹. Na ở nhóm 1, chu kỳ 3, có 1 electron hoá trị ở lớp ngoài cùng.',
  },
  {
    id: 4,
    topic: 'Chu kỳ và nhóm',
    question: 'Nguyên tố ở chu kỳ 3, nhóm 17 là nguyên tố nào?',
    options: ['S', 'Cl', 'Ar', 'Br'],
    answer: 1,
    explanation:
      'Chu kỳ 3 nghĩa là lớp ngoài cùng n = 3; nhóm 17 nghĩa là 7 electron hoá trị: 3s²3p⁵ — đó là clo (Cl, Z = 17).',
  },
  {
    id: 5,
    topic: 'Đồng vị',
    question: 'Đồng vị ²³Na (Z = 11) có bao nhiêu neutron?',
    options: ['11', '12', '23', '34'],
    answer: 1,
    explanation:
      'Số neutron = số khối − số proton = 23 − 11 = 12. Số khối 23 là số nucleon, không phải nguyên tử khối tương đối 22,99 u.',
  },
  {
    id: 6,
    topic: 'Nguyên tử khối',
    question: 'Nguyên tử khối tương đối khác số khối của một đồng vị ở điểm nào?',
    options: [
      'Chúng luôn bằng nhau',
      'Nguyên tử khối là trung bình có trọng số của các đồng vị tự nhiên',
      'Số khối tính theo đơn vị gam',
      'Nguyên tử khối chỉ tính electron',
    ],
    answer: 1,
    explanation:
      'Số khối A là tổng proton + neutron của một đồng vị cụ thể. Nguyên tử khối tương đối là giá trị trung bình theo độ phổ biến của các đồng vị, nên thường không phải số nguyên.',
  },
  {
    id: 7,
    topic: 'Xu hướng tuần hoàn',
    question: 'Nguyên tố nào có độ âm điện lớn nhất theo thang Pauling?',
    options: ['Oxy', 'Flo', 'Clo', 'Nitơ'],
    answer: 1,
    explanation:
      'Flo có độ âm điện 3,98 — cao nhất trong bảng. Oxy là 3,44; clo 3,16; nitơ 3,04.',
  },
  {
    id: 8,
    topic: 'Xu hướng tuần hoàn',
    question: 'Trong một chu kỳ, khi đi từ trái sang phải, bán kính nguyên tử thường',
    options: ['tăng', 'giảm', 'không đổi', 'tăng rồi giảm đều đặn'],
    answer: 1,
    explanation:
      'Điện tích hạt nhân tăng trong khi electron được thêm vào cùng lớp, lực hút hạt nhân–electron mạnh hơn nên bán kính giảm dần. Đây là xu hướng chung, có ngoại lệ cục bộ.',
  },
  {
    id: 9,
    topic: 'Lớp electron',
    question: 'Lớp N (n = 4) có thể chứa tối đa bao nhiêu electron?',
    options: ['8', '18', '32', '50'],
    answer: 2,
    explanation:
      'Số electron tối đa của lớp n là 2n². Với n = 4: 2 × 16 = 32 electron (gồm 4s, 4p, 4d, 4f).',
  },
  {
    id: 10,
    topic: 'Mô hình nguyên tử',
    question: 'Phát biểu nào đúng về mô hình Bohr trong ứng dụng này?',
    options: [
      'Electron thực sự chuyển động trên các vòng tròn quanh hạt nhân',
      'Đây là mô hình minh hoạ phân bố lớp electron, không phải quỹ đạo thực',
      'Mô hình Bohr thay thế hoàn toàn cơ học lượng tử',
      'Electron đứng yên tại một điểm xác định',
    ],
    answer: 1,
    explanation:
      'Mô hình Bohr chỉ là công cụ minh hoạ để đếm và ghi nhớ lớp electron. Trong cơ học lượng tử, electron không có quỹ đạo xác định; ta chỉ nói tới xác suất tìm thấy nó (orbital).',
  },
]
