# THE PERIODIC TABLE — Bảng tuần hoàn hoá học 3D

Ứng dụng trực quan hoá khoa học tương tác: đủ **118 nguyên tố**, mô hình nguyên tử dựng
bằng Three.js / React Three Fiber, phòng thí nghiệm so sánh dữ liệu thực và chế độ học tập
có trắc nghiệm.

Thiết kế và quy chuẩn giao diện: xem [DESIGN.md](DESIGN.md).

## Công nghệ

React 19 · TypeScript · Vite · Tailwind CSS v4 · Three.js · React Three Fiber · Drei ·
Framer Motion · Recharts · Lucide.

Không có API trả phí, không cần biến môi trường. Font được self-host qua `@fontsource`
nên ứng dụng chạy offline sau khi build.

## Chạy dự án

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # typecheck (tsc -b) + build production
npm run preview
npm run lint
```

## Cấu trúc

```
src/
  data/
    rawA.ts, rawB.ts   dataset 118 nguyên tố (định dạng pipe, 17 trường/nguyên tố)
    elements.ts        parser + kiểm tra toàn vẹn, cấu hình electron (Aufbau + ngoại lệ),
                       lớp electron, khối orbital, vị trí IUPAC, tìm kiếm
    categories.ts      10 nhóm nguyên tố + màu/ghi chú dùng chung cho bảng và 3D
    quiz.ts            10 câu hỏi trắc nghiệm kèm lời giải
    sources.ts         nguồn tham chiếu + tuyên bố giới hạn mô hình
  three/
    AtomStage.tsx      Canvas, camera, HUD, thanh điều khiển (mode, tốc độ, nhãn, lớp)
    AtomModel.tsx      hạt nhân InstancedMesh, lớp electron động, đám mây orbital
    orbital.ts         lấy mẫu |ψ|² lược đồ cho s, p, d, f
  components/
    table/             bảng tuần hoàn 18 cột, ô nguyên tố, legend/filter, tooltip
    detail/            5 tab hồ sơ nguyên tố
    layout/            top bar, footer
    ElementSearch.tsx  tìm kiếm có bàn phím
    ParticleField.tsx  nền hạt chuyển động (canvas 2D, tôn trọng reduced-motion)
  views/
    HomeView, ElementView, ExplorerView, LabView, LearnView
  lib/hooks.ts         hash router, media query, WebGL detection
```

Thêm nguyên tố mới hoặc sửa dữ liệu: chỉ cần sửa `rawA.ts` / `rawB.ts` — mọi giá trị dẫn
xuất (cấu hình electron, phân lớp, phân bố lớp, vị trí bảng, số neutron theo đồng vị) được
tính tự động. Parser sẽ ném lỗi ngay khi khởi động nếu số dòng khác 118 hoặc sai số trường.

## Ghi chú khoa học

- Khối lượng nguyên tử là khối lượng tương đối chuẩn (u), không phải số khối.
- Số neutron hiển thị theo đồng vị phổ biến nhất, ghi rõ ký hiệu đồng vị.
- Nhiệt độ nóng chảy/sôi quy về K ở 1 atm, kèm quy đổi °C.
- Giá trị không có dữ liệu tin cậy hiển thị “—”, không bị thay bằng số 0.
- Mô hình 3D không theo tỉ lệ thật; Bohr là minh hoạ, orbital là mô phỏng xác suất.
- Nguồn: IUPAC, CIAAW, NIST ASD, CRC Handbook, Cordero et al. 2008.
