import type {
  ProjectAnalysisRequest,
  ProjectAnalysisResponse,
  ProjectEvidenceContext,
} from "@/lib/ai/analysis";

export const PROJECT_ANALYSIS_FALLBACK_PROVIDER = "dhp-rule-engine";
export const PROJECT_ANALYSIS_FALLBACK_MODEL = "DHP kiểm tra theo quy tắc v1";

/**
 * Builds a bounded, deterministic intake summary when cloud inference is not
 * available. This is intentionally not presented as model-generated advice:
 * it only turns already-confirmed intake fields and evidence availability into
 * a safe checklist so the customer can keep moving toward engineer review.
 */
export function buildDeterministicProjectAnalysis(
  request: ProjectAnalysisRequest,
  evidence: ProjectEvidenceContext,
): ProjectAnalysisResponse {
  const limitations = [
    "Đây là bản tổng hợp tự động theo quy tắc từ hồ sơ đã xác nhận, không phải kết quả suy luận của mô hình AI.",
    "Kích thước, vật liệu, liên kết và khả năng thi công vẫn cần kỹ sư khảo sát xác nhận trước khi chốt phương án.",
  ];

  if (request.imageCount === 0) {
    limitations.unshift(
      "Chưa có ảnh hiện trạng trong hồ sơ; cần bổ sung ảnh hoặc xác minh trực tiếp khi khảo sát.",
    );
  }

  return {
    summary:
      "Hồ sơ đã có đủ nhóm thông tin cơ bản để chuyển sang bước kiểm tra hiện trạng và chuẩn bị khảo sát.",
    recommendation:
      "Giữ phương án ở mức sơ bộ, ưu tiên đối chiếu lại kích thước, điều kiện lắp đặt và vật liệu tại công trình. Kỹ sư cần xác nhận các điểm liên kết, bề mặt hoàn thiện và điều kiện thi công trước khi đưa ra phương án cuối cùng.",
    options: [
      {
        name: "Giữ hướng theo hồ sơ hiện tại",
        suitableWhen:
          "Phù hợp khi khảo sát thực tế xác nhận hiện trạng tương thích với kích thước, vật liệu và phong cách đã ghi nhận.",
        tradeoffs: [
          "Cần đo lại hiện trạng trước khi khóa cấu tạo.",
          "Mẫu vật liệu và bề mặt hoàn thiện vẫn cần đối chiếu thực tế.",
        ],
      },
      {
        name: "Điều chỉnh sau khảo sát",
        suitableWhen:
          "Phù hợp khi điểm neo, nền, khẩu độ hoặc điều kiện tiếp cận thi công khác với dữ liệu hiện có.",
        tradeoffs: [
          "Chi tiết cấu tạo có thể cần thay đổi sau khi đo thực tế.",
          "Kỹ sư cần xác nhận lại vật liệu và cách liên kết phù hợp với hiện trạng.",
        ],
      },
    ],
    surveyChecks: [
      "Đo lại kích thước và cao độ tại vị trí thi công.",
      "Kiểm tra nền, tường, trụ hoặc điểm liên kết hiện hữu.",
      "Đối chiếu mẫu vật liệu, màu sắc và bề mặt hoàn thiện đã chọn.",
      "Xác nhận điều kiện tiếp cận, vận chuyển và trình tự thi công tại công trình.",
    ],
    limitations,
    provider: PROJECT_ANALYSIS_FALLBACK_PROVIDER,
    model: PROJECT_ANALYSIS_FALLBACK_MODEL,
    generatedAt: new Date().toISOString(),
    evidenceCount: evidence.projects.length,
  };
}
