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

- Website phải luôn có entry point trực tiếp tới chatbot và mở drawer tư vấn tức thì từ CTA có `ai=1`; không được buộc khách cuộn tới một section cố định hoặc chuyển qua `/contact` để bắt đầu tư vấn.
- Route `/ai-tu-van` vẫn là trang đích thông tin; CTA tư vấn có `ai=1` phải mở đúng drawer toàn cục và giữ `service` preset khi có.
- Các hạng mục dịch vụ phải có thể truyền `service` preset vào AI intake để không mất ngữ cảnh.
- Dữ liệu khách hàng chỉ được ghi nhận khi vượt qua quality gate phù hợp với từng trường. Tên, số điện thoại, email, địa chỉ khảo sát, kích thước và nội dung tự do không được phép đi tiếp chỉ vì đủ số ký tự.
- `Đúng định dạng` không đồng nghĩa với `đã xác minh`. Không được tuyên bố số điện thoại hoặc email đã xác minh quyền sở hữu nếu chưa có dịch vụ xác minh thực sự trả kết quả thành công.
- Phone, email và Zalo phải được kiểm tra lại qua server trước khi chat ghi nhận; kết quả từ provider/DNS có thể chặn dữ liệu bị xác nhận là invalid, nhưng lỗi dịch vụ ngoài chỉ được ghi là chưa xác minh chứ không được suy diễn thành hợp lệ hoặc không hợp lệ.
- Nếu chính endpoint/lớp validation server lỗi, timeout hoặc trả phản hồi không hợp lệ thì chat phải fail-closed và giữ khách ở bước hiện tại; không được biến lỗi hệ thống thành `ok: true`. Chỉ khi validation server hoạt động và provider/DNS trả trạng thái chưa xác minh mới được ghi là đúng định dạng nhưng chưa xác minh.
- CRM handoff phải kiểm tra lại dữ liệu quan trọng ở boundary server để phiên cũ hoặc dữ liệu localStorage không thể bỏ qua quality gate phía client.
- Hồ sơ đã qua validation phải được tiếp nhận bởi ít nhất một kênh server bền vững trước khi UI báo gửi thành công. `project_inquiries` là kho tiếp nhận chính/idempotent; CRM webhook và automation là kênh đồng bộ hoặc dự phòng, không được là điểm lỗi duy nhất khiến hồ sơ hợp lệ bị mất.
- Chat drawer phải mobile-first: không dùng layout có thể vượt chiều rộng viewport, phải hỗ trợ `dvh`, safe-area, nội dung dài và bàn phím iOS mà không tạo horizontal overflow.
- Có thể tối ưu copy, layout, lazy-loading và hiệu năng, nhưng không được xóa, ẩn hoặc thay thế chatbot bằng kênh liên hệ thụ động.
- Mọi thay đổi có nguy cơ làm mất public chatbot, làm yếu validation hoặc phá mobile boundaries phải bị regression test chặn và chỉ được thực hiện khi chủ sở hữu sản phẩm yêu cầu rõ ràng.
- Mọi thay đổi entry point, composition, validation hoặc CRM handoff của chatbot phải vượt qua audit, lint, typecheck, unit tests và production build trước khi merge.

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

### Optional external AI integrations

Các runtime/skill bên ngoài chỉ được tích hợp theo kiểu **adapter tùy chọn**, không được mặc định trở thành dependency của Website production hoặc thay đổi quyền sở hữu dữ liệu/nghiệp vụ.

- Registry dự án: [`.ai/EXTERNAL_AI_INTEGRATIONS.json`](./.ai/EXTERNAL_AI_INTEGRATIONS.json)
- Architecture contract: [`docs/EXTERNAL_AI_RUNTIME_INTEGRATIONS.md`](./docs/EXTERNAL_AI_RUNTIME_INTEGRATIONS.md)
- OpenViking: context/memory engine tùy chọn, không thay Website source of truth.
- Needle 2: tool router local được đăng ký nhưng tắt mặc định; không phải local coding-model fallback.
- `ip-as-logo`: specialist creative skill chỉ bật theo yêu cầu; output là candidate asset cho đến khi được chấp thuận.
- DeepSeek Harness Anchored Standard: development-only adapter, chỉ dùng khi provider/harness phù hợp và không được làm yếu DHP/UMS authority hoặc cost policy.
- AiToEarn: social-execution runtime tùy chọn đứng **sau** boundary Social Publishing Bot. Website vẫn giữ business truth; AiToEarn chỉ thực thi publish/schedule/status/analytics/engagement đã được phê duyệt qua API/MCP adapter và không được trở thành public Website dependency.

Không clone/vendor toàn bộ upstream vào Website chỉ vì đã đăng ký. Mọi activation phải giữ nguyên service ownership, API boundaries, security/privacy policy, `$0`/provider policy hiện hành và quality gate.

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

**Production deployment invariant:** `main` là source branch của production. Sau mỗi merge, Vercel phải tạo deployment `target=production` có `githubCommitSha` bằng `main` HEAD và các alias `dai-hai-phat-web.vercel.app`, `dai-hai-phat-web-nguyen-huu-huongs-projects-5a8e872f.vercel.app` cùng branch alias `main` phải trỏ vào deployment đó. Preview `READY` không được coi là hoàn tất nếu production alias vẫn ở commit cũ.

## Repository

Repository này là nguồn sự thật duy nhất cho mã nguồn, contract API, logic AI, CRM handoff và quy tắc vận hành sản phẩm.
