# DAI HAI PHAT AI OS

Đây không chỉ là một website giới thiệu. Đây là **AI Digital Engineering Office** của Đại Hải Phát, tập trung tư vấn và tiếp nhận nhu cầu cho các hạng mục dân dụng và nội thất.

## Phạm vi sản phẩm

- Cửa cổng dân dụng
- Cầu thang và lan can
- Mái che
- Nội thất
- Cải tạo không gian
- AI tư vấn, lập hồ sơ kỹ thuật và bàn giao CRM

Không mở rộng sang các công trình cơ khí công nghiệp quy mô lớn khi chưa có yêu cầu rõ ràng.

## Kiến trúc sản phẩm v1.0

Phiên bản đầu tiên phải giữ kiến trúc đơn giản, dễ vận hành và chỉ gồm một luồng chính:

```text
Website Next.js
  → AI Assistant
  → Knowledge Base Đại Hải Phát
  → Ước tính sơ bộ
  → Lưu hồ sơ khách hàng
  → Thông báo Telegram hoặc email
  → Nhân viên tiếp nhận
```

### Protected core invariant — Public AI Chatbot

Trợ lý AI/chatbot công khai là **năng lực cốt lõi bắt buộc và là điểm vào chính của DHP-AIOS**, không phải block marketing tùy chọn.

- Homepage phải luôn mount luồng AI consultation thực tại `#ai-office`.
- Header/điểm chuyển đổi chính phải luôn có đường vào trực tiếp tới chatbot.
- Các hạng mục dịch vụ phải có thể truyền `service` preset vào AI intake để không mất ngữ cảnh.
- Có thể tối ưu copy, layout, lazy-loading và hiệu năng, nhưng không được xóa, ẩn, thay thế chatbot bằng `/contact`, hoặc chỉ giữ engine nội bộ mà làm mất public entry.
- Mọi thay đổi có nguy cơ làm mất public chatbot phải bị regression test chặn và chỉ được thực hiện khi chủ sở hữu sản phẩm yêu cầu rõ ràng.
- Mọi thay đổi vị trí, entry point hoặc composition của chatbot phải vượt qua audit, lint, typecheck, unit tests, production build và kiểm tra public preview trước khi merge.

Bốn năng lực bắt buộc của v1:

1. Tư vấn đúng phạm vi cửa cổng, cầu thang, lan can, mái che, nội thất và cải tạo nhà ở.
2. Thu thập thông tin dự án gồm kích thước, địa điểm, vật liệu, ngân sách, thời gian và hình ảnh.
3. Chỉ đưa ước tính sơ bộ; báo giá chính thức phải được xác nhận sau khi kỹ sư kiểm tra hoặc khảo sát.
4. Lưu hồ sơ khách hàng và chuyển tiếp cho nhân viên mà không yêu cầu khách nhập lại thông tin.

## Giới hạn kiến trúc v1.0

Chưa triển khai trong v1 nếu chưa có dữ liệu vận hành chứng minh nhu cầu:

- Nhiều AI agent độc lập.
- Chatwoot self-host.
- ERP hoặc CRM quy mô lớn.
- Workflow nhiều tầng hoặc orchestration phức tạp.
- Package, dịch vụ hoặc abstraction không phục vụ trực tiếp cho luồng tư vấn và tiếp nhận khách hàng.

Mọi module mới phải chứng minh ít nhất một trong các giá trị sau: tăng tỷ lệ chuyển đổi, giảm thời gian xử lý, tăng độ chính xác, tăng an toàn dữ liệu hoặc giảm chi phí vận hành.

## Nguyên tắc ưu tiên

1. Mobile First
2. Performance First
3. Customer Experience
4. AI First
5. SEO
6. Security

## Quy tắc kiến trúc

- Giữ Next.js và TypeScript.
- Không thay đổi kiến trúc khi chưa có yêu cầu hoặc lý do kỹ thuật rõ ràng.
- Không thêm package hoặc file dư thừa.
- Không hardcode dữ liệu có source of truth hiện hữu.
- Mỗi thay đổi phải có mục tiêu sản phẩm, hiệu năng, trải nghiệm hoặc độ tin cậy cụ thể.
- Ưu tiên mở rộng module hiện có trước khi tạo thêm hệ thống hoặc agent mới.

## Chế độ thực hiện liên tục trên GitHub

AI được trao quyền xử lý liên tục trong repository này:

- Không hỏi xác nhận lại sau từng file hoặc từng commit.
- Không dừng sau báo cáo trung gian.
- Tự xử lý tuần tự các hạng mục trong phạm vi đã xác định.
- Gom commit trên branch bằng `[skip ci]` khi đang làm batch.
- Chỉ kích hoạt một vòng kiểm tra tổng trước khi merge.
- Chỉ dừng khi có lỗi thực tế, thiếu quyền, thiếu dữ liệu bắt buộc hoặc gặp thay đổi có rủi ro cao.

## Hướng dẫn AI contributor

Mọi coding agent phải đọc và tuân thủ [`AGENTS.md`](./AGENTS.md) trước khi thay đổi mã nguồn.

## Quality gate

Trước khi merge vào `main`, batch phải vượt qua:

- Lint
- Type-check
- Unit tests
- Next.js build

Vercel là deployment platform. GitHub Actions `Quality` là gate kiểm chứng mã độc lập khi Vercel gặp giới hạn build hoặc lỗi hạ tầng.

## Repository

Repository này là nguồn sự thật duy nhất cho mã nguồn, contract API, logic AI, CRM handoff và quy tắc vận hành sản phẩm.
