# DHP SketchUp Extension — Giai đoạn 1

## 1. Mục tiêu

Giai đoạn 1 tạo một quy trình ngắn, trực quan và đủ dùng cho Đại Hải Phát:

**Chọn dự án → kéo ảnh hiện trạng → chọn mẫu → nhập kích thước → áp vật liệu → render thử → kéo thanh so sánh ảnh cũ/ảnh render → lưu phương án → xuất báo giá sơ bộ.**

Phạm vi ưu tiên là nội thất dân dụng, bắt đầu bằng tủ áo, tủ bếp, kệ TV và tủ trang trí. Các module cửa cổng, lan can, cầu thang và mái che dùng cùng kiến trúc nhưng triển khai sau khi luồng nội thất ổn định.

---

## 2. Nguyên tắc UX

- Một màn hình chỉ có một nhiệm vụ chính.
- Người dùng ưu tiên chọn, kéo thả, thanh trượt và preset thay vì nhập biểu mẫu dài.
- Panel bên phải dạng ngăn kéo; khu vực SketchUp vẫn là vùng làm việc chính.
- Mọi thay đổi tham số cập nhật preview tức thời nhưng chỉ ghi hình học khi người dùng bấm **Áp dụng**.
- Hành động chính luôn nằm cuối panel và cố định khi cuộn.
- Mỗi bước có giá trị mặc định hợp lý và có thể quay lại bước trước.
- Không mở nhiều cửa sổ dialog cùng lúc.

---

## 3. Cấu trúc giao diện tinh gọn

### 3.1. Thanh công cụ nhỏ

1. Dự án
2. Thư viện
3. Tạo nhanh
4. Vật liệu
5. Render
6. So sánh
7. Báo giá

### 3.2. Panel ngăn kéo

```text
[Dự án hiện tại ▼]
[Hạng mục ▼]

Ảnh hiện trạng
[Kéo ảnh vào đây]

Mẫu thiết kế
[Danh sách thẻ mẫu kéo ngang]

Kích thước
[Rộng ─────●────]
[Cao  ─────●────]
[Sâu  ─────●────]

Vật liệu
[Preset vật liệu dạng chip]

[Render thử]
```

### 3.3. Chế độ hiển thị theo ngữ cảnh

- Chưa chọn đối tượng: hiển thị thư viện và tạo nhanh.
- Đã chọn một DHP Object: hiển thị kích thước, vật liệu, phụ kiện và báo giá.
- Đã render: tự mở tab **So sánh**.
- Có lỗi model: hiển thị nút **Sửa tự động** trước các thao tác render hoặc bóc tách.

---

## 4. Luồng kéo thả

### 4.1. Kéo ảnh hiện trạng

Nguồn hỗ trợ:

- JPG, JPEG, PNG, HEIC sau khi local service chuyển đổi.
- Kéo từ File Explorer/Finder vào vùng dropzone.
- Dán từ clipboard.
- Chọn ảnh từ DHP Field khi đã đồng bộ.

Sau khi nhận ảnh:

1. Tạo bản sao trong thư mục dự án.
2. Sinh thumbnail.
3. Đọc orientation.
4. Cho phép crop và xoay nhanh.
5. Gắn vai trò: ảnh hiện trạng, ảnh tham khảo, vật liệu tham khảo hoặc bản phác thảo.

### 4.2. Kéo mẫu vào SketchUp

- Card mẫu có ảnh, tên, kích thước chuẩn và mức giá tham khảo.
- Kéo card từ panel vào viewport.
- Khi rê chuột, hiển thị ghost preview.
- Click để đặt điểm neo.
- Chuột trái đặt; Esc hủy; phím mũi tên đổi hướng; Shift khóa trục.
- Sau khi đặt, mở mini inspector thay vì form lớn.

### 4.3. Kéo vật liệu

- Kéo chip vật liệu lên mặt hoặc component.
- Thả lên một face: áp cho face.
- Thả lên DHP Object: áp theo quy tắc vật liệu của toàn bộ đối tượng.
- Giữ Alt/Option để thay mọi vật liệu cùng mã trong model.
- Có nút hoàn tác ngay trong toast 5 giây.

---

## 5. Điều khiển bằng thanh kéo

### 5.1. Slider kích thước

Mỗi thông số có:

- Thanh kéo.
- Ô số mm.
- Nút giảm/tăng theo bước.
- Preset thường dùng.

Ví dụ:

```text
Rộng  [1200] mm   −  ─────●─────  +
Preset: 1200 | 1600 | 1800 | 2400
```

Quy tắc:

- Drag cập nhật preview tối đa 30 fps.
- Không tái tạo toàn bộ model ở mỗi pixel kéo.
- Dùng geometry proxy hoặc bounding preview trong khi kéo.
- Khi thả slider mới commit operation vào SketchUp.
- Giữ Shift để bước nhỏ; giữ Ctrl/Cmd để nhập tự do.

### 5.2. Slider vật liệu và ánh sáng

- Độ bóng.
- Độ nhám.
- Cường độ ánh sáng.
- Nhiệt độ màu.
- Exposure.
- Góc nắng.

Các slider này chỉ thay preset render, không làm biến đổi dữ liệu giá nếu chưa bấm lưu vật liệu.

---

## 6. Thanh kéo so sánh ảnh cũ và ảnh render

### 6.1. Mục tiêu

Cho phép nhân viên và khách hàng nhìn trực tiếp sự khác biệt giữa:

- Ảnh hiện trạng và ảnh render.
- Phương án A và phương án B.
- Render trước và sau khi đổi vật liệu.
- Render thô và render hậu kỳ.

### 6.2. Giao diện

```text
┌─────────────────────────────────────┐
│ Ảnh hiện trạng      Ảnh render      │
│        ◀───────●────────▶            │
│          Kéo để so sánh              │
└─────────────────────────────────────┘

[Hoán đổi] [Dọc/ ngang] [Khớp ảnh] [Toàn màn hình]
```

### 6.3. Chế độ so sánh

1. **Swipe dọc:** thanh kéo trái/phải.
2. **Swipe ngang:** thanh kéo trên/dưới.
3. **Fade:** thanh trượt opacity.
4. **Blink:** chuyển đổi A/B bằng phím Space.
5. **Side-by-side:** hai ảnh song song.

MVP triển khai Swipe dọc và Fade trước.

### 6.4. Căn chỉnh ảnh

Ảnh hiện trạng và render thường không trùng camera. Công cụ **Khớp ảnh** gồm:

- Đặt 4 điểm tham chiếu trên ảnh cũ.
- Đặt 4 điểm tương ứng trên render.
- Tính homography trong local service.
- Lưu transform riêng, không ghi đè ảnh gốc.
- Có nút reset.

MVP cho phép căn chỉnh thủ công:

- Zoom.
- Pan X/Y.
- Rotate.
- Scale.

Homography tự động xếp vào P1 sau khi kiểm thử.

### 6.5. Quy tắc ảnh

- Hai ảnh phải dùng cùng canvas và aspect ratio khi hiển thị.
- Không crop phá hủy file gốc.
- Giới hạn preview tối đa 2560 px cạnh dài để giữ mượt.
- Render full-resolution chỉ tải khi xuất.
- Slider phải phản hồi dưới 16 ms trên máy mục tiêu.

### 6.6. Lưu phiên so sánh

```json
{
  "comparison_id": "uuid",
  "project_id": "DHP-PROJ-2026-001",
  "left_asset_id": "survey-001",
  "right_asset_id": "render-004",
  "mode": "vertical-swipe",
  "position": 0.52,
  "alignment": {
    "scale": 1.02,
    "rotation_deg": -0.4,
    "offset_x": 8,
    "offset_y": -3
  },
  "created_at": "2026-08-05T08:22:00+07:00"
}
```

### 6.7. Xuất ảnh so sánh

- Xuất ảnh tĩnh chia đôi.
- Xuất ảnh trước/sau có nhãn Đại Hải Phát.
- Xuất video MP4 ngắn với thanh kéo tự chạy ở giai đoạn sau.
- Preset Facebook, Zalo, TikTok/Reels và catalog.

---

## 7. Render nhanh trong Giai đoạn 1

### 7.1. Nút Render thử

Một nút duy nhất với menu phụ:

- Nhanh — 720p.
- Chuẩn — 1080p.
- Trong suốt — ảnh sản phẩm.

Không hiển thị hàng chục thông số render ở giao diện chính.

### 7.2. Preset thay vì cấu hình phức tạp

Preset đầu tiên:

- Phòng ngủ ban ngày.
- Phòng ngủ ánh sáng ấm.
- Phòng khách ban ngày.
- Bếp sáng sạch.
- Sản phẩm nền trắng.

Nút **Tinh chỉnh** mở ngăn kéo phụ gồm exposure, nhiệt độ màu và góc camera.

### 7.3. Trạng thái render

```text
Đang chuẩn hóa vật liệu
→ Đang xuất scene
→ Đang render
→ Đang tạo preview
→ Hoàn tất
```

Cho phép tiếp tục làm việc khi render chạy trong local service. Có hủy render và render lại từ preset trước.

---

## 8. Thành phần UI cần xây

- `ProjectSelector`
- `DropzoneCard`
- `AssetCarousel`
- `DraggableAssetCard`
- `ParamSlider`
- `MaterialChip`
- `StickyActionBar`
- `RenderPresetPicker`
- `RenderProgressCard`
- `BeforeAfterSlider`
- `ImageAlignmentControls`
- `ComparisonExportDialog`
- `ContextInspector`
- `UndoToast`

Mỗi component chỉ đảm nhiệm một nhiệm vụ và phải hỗ trợ keyboard, touch, loading, empty và error state.

---

## 9. Kiến trúc kỹ thuật Before/After Slider

### 9.1. Frontend

- Một canvas/container chung.
- Ảnh trái làm nền.
- Ảnh phải phủ trên và clip theo vị trí slider.
- Pointer Events cho chuột, bút và cảm ứng.
- `requestAnimationFrame` để cập nhật vị trí.
- Không re-render toàn bộ component trong mỗi pointermove.
- Keyboard: mũi tên ±1%, Shift + mũi tên ±5%.
- ARIA role slider với `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.

### 9.2. Ruby bridge

Ruby không xử lý pointermove. JavaScript chỉ gửi sự kiện khi:

- Người dùng thả tay.
- Lưu phiên so sánh.
- Đổi asset.
- Yêu cầu xuất ảnh.

Điều này tránh làm nghẽn bridge Ruby ↔ HtmlDialog.

### 9.3. Local service

- Chuẩn hóa orientation.
- Sinh preview.
- Căn chỉnh transform.
- Composite ảnh xuất.
- Quản lý cache.
- Xóa cache theo LRU.

---

## 10. Dữ liệu Giai đoạn 1

### Project

- ID, tên, khách hàng, trạng thái.
- Đường dẫn model.
- Ảnh hiện trạng.
- Các phương án render.

### DesignVariant

- Mã phương án.
- Asset gốc.
- Bộ tham số.
- Vật liệu.
- Camera.
- Render preset.
- Giá sơ bộ.

### RenderAsset

- File preview.
- File full resolution.
- Kích thước.
- Trạng thái.
- Engine/preset.
- Timestamp.

### ComparisonSession

- Hai asset.
- Mode.
- Vị trí slider.
- Alignment.
- Export preset.

---

## 11. Phạm vi triển khai P0

### Sprint 1A — UX shell

- Toolbar nhỏ.
- Drawer panel.
- Project selector.
- Dropzone ảnh.
- Asset carousel.
- Param slider.
- Sticky action bar.

### Sprint 1B — Dựng tủ nhanh

- Tủ áo tham số.
- Kéo mẫu vào model.
- Resize bằng slider.
- Material chips.
- Undo/redo.
- Metadata.

### Sprint 1C — Render preview

- Render preset picker.
- Local render queue interface.
- Preview gallery.
- Progress/cancel/retry.

### Sprint 1D — So sánh ảnh

- Before/After vertical slider.
- Fade mode.
- Touch và keyboard.
- Pan/zoom/scale alignment.
- Lưu ComparisonSession.
- Xuất ảnh chia đôi có nhãn.

### Sprint 1E — BOM và báo giá sơ bộ

- BOM tủ.
- Price code.
- Hao hụt.
- Giá sơ bộ.
- CSV/PDF cơ bản.

---

## 12. Tiêu chí nghiệm thu

1. Người dùng tạo phương án tủ đầu tiên trong tối đa 5 phút kể từ khi mở plugin.
2. Có thể kéo ảnh hiện trạng vào dự án bằng chuột hoặc chọn file.
3. Có thể kéo một mẫu tủ vào viewport và đặt đúng điểm neo.
4. Slider kích thước phản hồi mượt và chỉ commit model khi thả.
5. Có thể kéo vật liệu lên đối tượng.
6. Render thử chạy không khóa giao diện SketchUp.
7. Ảnh render tự xuất hiện trong gallery khi hoàn tất.
8. Before/After Slider hoạt động bằng chuột, touch và bàn phím.
9. Có thể điều chỉnh scale, pan và vị trí ảnh để khớp tương đối.
10. Lưu và mở lại phiên so sánh không mất trạng thái.
11. Xuất được ảnh trước/sau có logo và nhãn.
12. Tất cả chức năng chính hoạt động local, không bắt buộc Internet.

---

## 13. Những phần chưa đưa vào Giai đoạn 1

- Render video walkthrough.
- Panorama 360.
- Căn chỉnh homography tự động.
- CNC hoàn chỉnh.
- Multi-user realtime.
- AI chạy lệnh dựng hình phức tạp.
- Cloud render farm.

Các phần này chỉ triển khai sau khi luồng chọn/kéo thả/render/so sánh đạt tiêu chí nghiệm thu.
