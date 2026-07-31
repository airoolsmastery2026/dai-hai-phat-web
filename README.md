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
