# UMS Pilot — Dai Hai Phat AI OS

## Mục tiêu

Pilot xác nhận UMS có thể đọc project profile, chọn đúng Publishing Bot adapter và tạo kế hoạch an toàn mà không thay đổi dữ liệu hoặc tự đăng nội dung. Website vẫn là nguồn dữ liệu nghiệp vụ chính; Publishing Bot vẫn là nơi sở hữu queue và việc thực thi mạng xã hội.

## Phạm vi giai đoạn đầu

- Project profile: `.ai/ums/project-profile.json`.
- Chế độ mặc định: `preview`.
- Tác vụ đọc ưu tiên: health, queue, trạng thái job, trạng thái token và analytics.
- Tác vụ ghi: tạo job, pause/resume scheduler và retry job chỉ được lập kế hoạch trong pilot.
- Không truy cập trực tiếp database của Website hoặc Publishing Bot.
- Không đưa token, secret hoặc service-role key vào task, profile hay audit log.

## Luồng tích hợp

1. UMS nhận task theo contract `1.0`.
2. Project policy xác nhận capability được phép.
3. Adapter tạo preview từ contract API hiện có của Website và Publishing Bot.
4. Nếu là thao tác ghi, UMS yêu cầu phê duyệt rõ ràng và idempotency key.
5. Adapter chỉ gọi API/service công khai sau khi policy cho phép.
6. UMS ghi audit theo task ID, project ID, capability và kết quả.

## Các đường tắt bị cấm

- `publishing.database.write`: không ghi chéo database.
- `publishing.direct.publish`: không bỏ qua queue, preflight và approval.
- `publishing.job.delete`: không xóa job qua pilot.

## Điều kiện mở ghi thật

Chỉ bật `allowExternalWrites` trong một cấu hình môi trường riêng sau khi hoàn thành kiểm thử contract hai đầu, xác thực service-to-service, chống replay, quan sát lỗi, rollback và phê duyệt của chủ dự án. Không thay đổi cờ này trong project profile đã commit để chứa ngoại lệ production.

## Rollback

Tắt UMS runner hoặc loại adapter khỏi registry. Do pilot không tạo database dùng chung và không thay đổi nguồn dữ liệu sở hữu, rollback không cần migration và không ảnh hưởng chatbot công khai.
