export const CONVERSATION_STATES = [
  "START",
  "WELCOME",
  "SERVICE_SELECTION",
  "PROJECT_TYPE",
  "LOCATION",
  "IMAGE_COLLECTION",
  "SIZE_COLLECTION",
  "STYLE_COLLECTION",
  "MATERIAL_COLLECTION",
  "BUDGET_COLLECTION",
  "TIME_COLLECTION",
  "REQUIREMENT_COLLECTION",
  "ANALYSIS",
  "SIMILAR_PROJECT_SEARCH",
  "OPTION_COMPARISON",
  "PROPOSAL_BUILDING",
  "CONFIDENCE_CHECK",
  "SURVEY_BOOKING",
  "QUOTE_REQUEST",
  "HUMAN_HANDOVER",
  "DONE",
] as const;

export type ConversationState = (typeof CONVERSATION_STATES)[number];

export type MemoryField =
  | "intentGroup"
  | "intent"
  | "service"
  | "projectType"
  | "location"
  | "images"
  | "dimensions"
  | "style"
  | "material"
  | "budget"
  | "timeline"
  | "priority"
  | "surveyWindow"
  | "quoteRequest"
  | "name"
  | "phone"
  | "surveyAddress"
  | "email"
  | "zalo";

export interface StoredImage {
  storageKey: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface ProjectMemory {
  intentGroup?: string;
  intent?: string;
  service?: string;
  projectType?: string;
  location?: string;
  images: StoredImage[];
  imagesDeferred?: boolean;
  dimensions?: string;
  style?: string;
  material?: string;
  budget?: string;
  timeline?: string;
  priority?: string;
  surveyWindow?: string;
  quoteRequest?: string;
  name?: string;
  phone?: string;
  surveyAddress?: string;
  email?: string;
  zalo?: string;
}

export interface ProposalSnapshot {
  progress: 10 | 20 | 35 | 50 | 70 | 90 | 100;
  summary: string;
  facts: string[];
  missing: string[];
  costRange: null;
  verificationNote: string;
}

export interface ConversationSession {
  version: 1;
  id: string;
  state: ConversationState;
  visitedStates: ConversationState[];
  memory: ProjectMemory;
  handoverStep: number;
  confidence: number;
  leadScore: number;
  proposal: ProposalSnapshot;
  updatedAt: string;
}

export interface QuestionOption {
  label: string;
  value: string;
}

export interface ConversationQuestion {
  id: string;
  state: ConversationState;
  field: MemoryField;
  prompt: string;
  supportingText: string;
  inputType: "choice" | "file" | "text" | "tel" | "email";
  options?: readonly QuestionOption[];
  required: boolean;
  allowAssistedMeasurement?: boolean;
}

export interface ConversationHistoryItem {
  field: MemoryField;
  label: string;
  value: string;
}

const option = (label: string, value = label): QuestionOption => ({ label, value });

const QUESTIONS: Partial<Record<ConversationState, ConversationQuestion>> = {
  WELCOME: {
    id: "intent-group",
    state: "WELCOME",
    field: "intentGroup",
    prompt: "Chào anh/chị, hôm nay mình hỗ trợ việc gì?",
    supportingText: "Cứ chọn ý gần nhất; mình sẽ hỏi thêm từng câu ngắn để hiểu đúng nhu cầu.",
    inputType: "choice",
    options: [
      option("Tư vấn hoặc triển khai dự án", "Dự án mới"),
      option("Hỗ trợ sau thi công", "Sau thi công"),
      option("Hợp tác hoặc nội dung khác", "Hợp tác / Khác"),
    ],
    required: true,
  },
  SERVICE_SELECTION: {
    id: "service",
    state: "SERVICE_SELECTION",
    field: "service",
    prompt: "Anh/chị đang muốn làm hạng mục nào?",
    supportingText: "Nếu chưa gọi đúng tên hạng mục, chọn ý gần nhất hoặc nhắn mô tả tự nhiên.",
    inputType: "choice",
    options: [
      option("Cửa cổng"),
      option("Cầu thang và lan can"),
      option("Mái che"),
      option("Nội thất"),
      option("Cải tạo không gian"),
      option("Hạng mục khác"),
    ],
    required: true,
  },
  PROJECT_TYPE: {
    id: "project-type",
    state: "PROJECT_TYPE",
    field: "projectType",
    prompt: "Không gian cần làm là nhà hay công trình nào?",
    supportingText: "Thông tin này giúp mình gợi ý cách khảo sát phù hợp hơn.",
    inputType: "choice",
    options: [
      option("Nhà phố"),
      option("Biệt thự"),
      option("Căn hộ"),
      option("Cửa hàng"),
      option("Văn phòng"),
      option("Công trình khác"),
    ],
    required: true,
  },
  LOCATION: {
    id: "location",
    state: "LOCATION",
    field: "location",
    prompt: "Công trình của anh/chị ở khu vực nào?",
    supportingText: "Chỉ cần tỉnh hoặc thành phố ở bước này; địa chỉ cụ thể có thể cung cấp sau.",
    inputType: "choice",
    options: [
      option("TP. Hồ Chí Minh"),
      option("Bình Dương"),
      option("Đồng Nai"),
      option("Long An"),
      option("Tây Ninh"),
      option("Tỉnh hoặc thành khác"),
    ],
    required: true,
  },
  IMAGE_COLLECTION: {
    id: "images",
    state: "IMAGE_COLLECTION",
    field: "images",
    prompt: "Ảnh hiện trạng nào thể hiện rõ khu vực thi công?",
    supportingText:
      "Tải tối đa 5 ảnh JPG, PNG hoặc WebP; nếu chưa có ảnh, anh/chị có thể tiếp tục và bổ sung sau.",
    inputType: "file",
    required: false,
  },
  SIZE_COLLECTION: {
    id: "dimensions",
    state: "SIZE_COLLECTION",
    field: "dimensions",
    prompt: "Anh/chị đã có kích thước sơ bộ chưa?",
    supportingText: "Có thể nhắn rộng × cao × dài; nếu chưa đo, mình sẽ ghi chú để kỹ sư hỗ trợ.",
    inputType: "text",
    required: true,
    allowAssistedMeasurement: true,
  },
  STYLE_COLLECTION: {
    id: "style",
    state: "STYLE_COLLECTION",
    field: "style",
    prompt: "Anh/chị thích không gian mang cảm giác nào?",
    supportingText: "Chọn phong cách gần nhất; nếu chưa rõ, kỹ sư sẽ định hướng từ ảnh tham khảo.",
    inputType: "choice",
    options: [
      option("Hiện đại"),
      option("Tối giản"),
      option("Công nghiệp"),
      option("Tân cổ điển"),
      option("Theo ảnh mẫu"),
      option("Cần kỹ sư định hướng"),
    ],
    required: true,
  },
  MATERIAL_COLLECTION: {
    id: "material",
    state: "MATERIAL_COLLECTION",
    field: "material",
    prompt: "Anh/chị đang nghiêng về vật liệu nào?",
    supportingText: "Chưa cần quyết định ngay; phương án cuối sẽ được đối chiếu với hiện trạng.",
    inputType: "choice",
    options: [
      option("Sắt hoặc thép"),
      option("Inox"),
      option("Nhôm kính"),
      option("Gỗ hoặc MDF"),
      option("Composite"),
      option("Cần kỹ sư xác định"),
    ],
    required: true,
  },
  BUDGET_COLLECTION: {
    id: "budget",
    state: "BUDGET_COLLECTION",
    field: "budget",
    prompt: "Mức đầu tư nào khiến anh/chị thấy thoải mái?",
    supportingText: "Chọn khoảng gần nhất hoặc chọn chưa xác định; đây chưa phải báo giá.",
    inputType: "choice",
    options: [
      option("Dưới 30 triệu"),
      option("30–60 triệu"),
      option("60–120 triệu"),
      option("120–250 triệu"),
      option("Trên 250 triệu"),
      option("Chưa xác định", "Cần tư vấn ngân sách"),
    ],
    required: true,
  },
  TIME_COLLECTION: {
    id: "timeline",
    state: "TIME_COLLECTION",
    field: "timeline",
    prompt: "Anh/chị mong muốn bắt đầu khi nào?",
    supportingText: "Mốc dự kiến giúp đội ngũ chuẩn bị lịch; có thể điều chỉnh sau khi khảo sát.",
    inputType: "choice",
    options: [
      option("Trong 2 tuần"),
      option("Trong 1 tháng"),
      option("Trong 1–3 tháng"),
      option("Trong 3–6 tháng"),
      option("Sau 6 tháng"),
      option("Chưa xác định", "Cần tư vấn tiến độ"),
    ],
    required: true,
  },
  REQUIREMENT_COLLECTION: {
    id: "priority",
    state: "REQUIREMENT_COLLECTION",
    field: "priority",
    prompt: "Điều gì quan trọng nhất với anh/chị?",
    supportingText: "Chọn một ưu tiên chính; nếu còn phân vân, mình sẽ để AI gợi ý từ hồ sơ.",
    inputType: "choice",
    options: [
      option("Độ bền"),
      option("Thẩm mỹ"),
      option("Chi phí"),
      option("Tiến độ"),
      option("Bảo trì và bảo hành"),
      option("Nhờ AI gợi ý", "Cần AI gợi ý"),
    ],
    required: true,
  },
  CONFIDENCE_CHECK: {
    id: "confidence",
    state: "CONFIDENCE_CHECK",
    field: "surveyWindow",
    prompt: "Bước nào giúp xác minh hồ sơ kỹ thuật chính xác nhất?",
    supportingText: "Khảo sát thực tế bổ sung kích thước, cấu tạo hiện trạng và điều kiện thi công.",
    inputType: "choice",
    options: [option("Đặt khảo sát kỹ thuật", "Yêu cầu khảo sát")],
    required: true,
  },
  SURVEY_BOOKING: {
    id: "survey-window",
    state: "SURVEY_BOOKING",
    field: "surveyWindow",
    prompt: "Khung thời gian khảo sát nào phù hợp?",
    supportingText: "Kỹ sư sẽ xác nhận lịch cụ thể qua kênh liên hệ đã chọn.",
    inputType: "choice",
    options: [
      option("Sáng ngày làm việc"),
      option("Chiều ngày làm việc"),
      option("Tối ngày làm việc"),
      option("Sáng thứ Bảy"),
      option("Chiều thứ Bảy"),
      option("Cần kỹ sư sắp lịch"),
    ],
    required: true,
  },
  QUOTE_REQUEST: {
    id: "quote-request",
    state: "QUOTE_REQUEST",
    field: "quoteRequest",
    prompt: "Hồ sơ nào cần nhận sau khảo sát?",
    supportingText: "Báo giá chính thức chỉ được lập sau khi dữ liệu kỹ thuật được xác minh.",
    inputType: "choice",
    options: [
      option("Proposal kỹ thuật"),
      option("Khoảng chi phí"),
      option("Báo giá chính thức"),
      option("Proposal và báo giá"),
    ],
    required: true,
  },
};

const INTENT_QUESTIONS: Record<string, ConversationQuestion> = {
  "Dự án mới": {
    id: "intent-project",
    state: "WELCOME",
    field: "intent",
    prompt: "Mình nên giúp anh/chị theo hướng nào trước?",
    supportingText: "Cứ chọn điều cần nhất lúc này; hồ sơ vẫn có thể bổ sung sau.",
    inputType: "choice",
    options: [
      option("Hỏi khoảng chi phí", "Hỏi giá"),
      option("Xem mẫu công trình", "Xem mẫu"),
      option("Xin tư vấn"),
      option("So sánh phương án", "So sánh"),
      option("Đặt khảo sát", "Khảo sát"),
      option("Triển khai thi công", "Thi công"),
    ],
    required: true,
  },
  "Sau thi công": {
    id: "intent-aftercare",
    state: "WELCOME",
    field: "intent",
    prompt: "Nội dung sau thi công cần xử lý là gì?",
    supportingText: "Thông tin được phân loại để chuyển đúng quy trình kỹ thuật.",
    inputType: "choice",
    options: [option("Bảo hành"), option("Khiếu nại")],
    required: true,
  },
  "Hợp tác / Khác": {
    id: "intent-other",
    state: "WELCOME",
    field: "intent",
    prompt: "Mục tiêu trao đổi là gì?",
    supportingText: "Chọn đúng mục tiêu để hồ sơ không chuyển sai bộ phận.",
    inputType: "choice",
    options: [option("Hợp tác"), option("Khác")],
    required: true,
  },
};

const HANDOVER_QUESTIONS: readonly ConversationQuestion[] = [
  {
    id: "contact-name",
    state: "HUMAN_HANDOVER",
    field: "name",
    prompt: "Kỹ sư cần xưng hô với anh/chị như thế nào?",
    supportingText: "Tên được lưu cùng hồ sơ tư vấn hiện tại.",
    inputType: "text",
    required: true,
  },
  {
    id: "contact-phone",
    state: "HUMAN_HANDOVER",
    field: "phone",
    prompt: "Số điện thoại xác nhận khảo sát là gì?",
    supportingText: "Số điện thoại chỉ phục vụ hồ sơ và lịch khảo sát này.",
    inputType: "tel",
    required: true,
  },
  {
    id: "survey-address",
    state: "HUMAN_HANDOVER",
    field: "surveyAddress",
    prompt: "Địa chỉ khảo sát cụ thể ở đâu?",
    supportingText: "Ghi số nhà, đường, phường/xã và tỉnh/thành.",
    inputType: "text",
    required: true,
  },
  {
    id: "contact-email",
    state: "HUMAN_HANDOVER",
    field: "email",
    prompt: "Email nhận Proposal là gì?",
    supportingText: "Có thể bỏ qua khi hồ sơ được nhận qua điện thoại hoặc Zalo.",
    inputType: "email",
    required: false,
  },
  {
    id: "contact-zalo",
    state: "HUMAN_HANDOVER",
    field: "zalo",
    prompt: "Số Zalo nhận cập nhật hồ sơ là gì?",
    supportingText: "Có thể bỏ qua khi không sử dụng Zalo.",
    inputType: "tel",
    required: false,
  },
];

const REQUIRED_MEMORY: ReadonlyArray<{ field: MemoryField; label: string }> = [
  { field: "intent", label: "mục tiêu" },
  { field: "service", label: "hạng mục" },
  { field: "projectType", label: "loại công trình" },
  { field: "location", label: "khu vực" },
  { field: "images", label: "ảnh hiện trạng" },
  { field: "dimensions", label: "kích thước" },
  { field: "style", label: "phong cách" },
  { field: "material", label: "vật liệu" },
  { field: "budget", label: "ngân sách" },
  { field: "timeline", label: "thời gian" },
  { field: "priority", label: "ưu tiên" },
];

const STRING_MEMORY_FIELDS: ReadonlyArray<Exclude<MemoryField, "images">> = [
  "intentGroup",
  "intent",
  "service",
  "projectType",
  "location",
  "dimensions",
  "style",
  "material",
  "budget",
  "timeline",
  "priority",
  "surveyWindow",
  "quoteRequest",
  "name",
  "phone",
  "surveyAddress",
  "email",
  "zalo",
];

const CONVERSATION_HISTORY_FIELDS: ReadonlyArray<{
  field: MemoryField;
  label: string;
}> = [
  { field: "intentGroup", label: "Nhóm nhu cầu" },
  { field: "intent", label: "Mục tiêu" },
  { field: "service", label: "Hạng mục" },
  { field: "projectType", label: "Công trình" },
  { field: "location", label: "Khu vực" },
  { field: "images", label: "Ảnh hiện trạng" },
  { field: "dimensions", label: "Kích thước" },
  { field: "style", label: "Phong cách" },
  { field: "material", label: "Vật liệu" },
  { field: "budget", label: "Ngân sách" },
  { field: "timeline", label: "Thời gian" },
  { field: "priority", label: "Ưu tiên" },
  { field: "surveyWindow", label: "Lịch khảo sát" },
  { field: "quoteRequest", label: "Hồ sơ cần nhận" },
  { field: "name", label: "Tên liên hệ" },
  { field: "phone", label: "Điện thoại" },
  { field: "surveyAddress", label: "Địa chỉ khảo sát" },
  { field: "email", label: "Email" },
  { field: "zalo", label: "Zalo" },
];

const CONVERSATION_STOP_WORDS = new Set([
  "anh",
  "chi",
  "cho",
  "co",
  "cong",
  "cua",
  "duoc",
  "giup",
  "la",
  "lam",
  "minh",
  "muon",
  "nha",
  "nho",
  "toi",
  "tu",
  "van",
  "voi",
]);

const CHOICE_ALIASES: Readonly<Record<string, ReadonlyArray<readonly [string, string]>>> = {
  "intent-group": [
    ["tu van", "Dự án mới"],
    ["du an moi", "Dự án mới"],
    ["bao hanh", "Sau thi công"],
    ["sau thi cong", "Sau thi công"],
    ["hop tac", "Hợp tác / Khác"],
  ],
  service: [
    ["lam cong", "Cửa cổng"],
    ["cua cong", "Cửa cổng"],
    ["bo cong", "Cửa cổng"],
    ["cau thang", "Cầu thang và lan can"],
    ["lan can", "Cầu thang và lan can"],
    ["mai che", "Mái che"],
    ["noi that", "Nội thất"],
    ["cai tao", "Cải tạo không gian"],
  ],
  location: [
    ["sai gon", "TP. Hồ Chí Minh"],
    ["tphcm", "TP. Hồ Chí Minh"],
    ["tp hcm", "TP. Hồ Chí Minh"],
    ["ho chi minh", "TP. Hồ Chí Minh"],
    ["binh duong", "Bình Dương"],
    ["dong nai", "Đồng Nai"],
    ["long an", "Long An"],
    ["tay ninh", "Tây Ninh"],
  ],
  "intent-project": [
    ["chi phi", "Hỏi giá"],
    ["bao gia", "Hỏi giá"],
    ["tham khao gia", "Hỏi giá"],
    ["xem mau", "Xem mẫu"],
    ["so sanh", "So sánh"],
    ["khao sat", "Khảo sát"],
    ["thi cong", "Thi công"],
  ],
  style: [
    ["chua biet", "Cần kỹ sư định hướng"],
    ["tu van giup", "Cần kỹ sư định hướng"],
  ],
  material: [
    ["chua biet", "Cần kỹ sư xác định"],
    ["tu van giup", "Cần kỹ sư xác định"],
  ],
  budget: [
    ["chua biet", "Cần tư vấn ngân sách"],
    ["khong ro", "Cần tư vấn ngân sách"],
    ["tu van giup", "Cần tư vấn ngân sách"],
  ],
  timeline: [
    ["chua biet", "Cần tư vấn tiến độ"],
    ["chua chot", "Cần tư vấn tiến độ"],
  ],
  priority: [
    ["chua biet", "Cần AI gợi ý"],
    ["goi y giup", "Cần AI gợi ý"],
  ],
};

function normalizeConversationText(value: string): string {
  return value
    .toLocaleLowerCase("vi-VN")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findBudgetChoice(
  question: ConversationQuestion,
  normalizedMessage: string,
): string | null {
  if (question.id !== "budget") return null;
  const match = normalizedMessage.match(/(\d+(?:[.,]\d+)?)\s*(ty|trieu|tr)?\b/);
  if (!match) return null;

  let amountInMillions = Number(match[1].replace(",", "."));
  if (!Number.isFinite(amountInMillions)) return null;
  if (match[2] === "ty") amountInMillions *= 1_000;

  const value =
    amountInMillions < 30
      ? "Dưới 30 triệu"
      : amountInMillions <= 60
        ? "30–60 triệu"
        : amountInMillions <= 120
          ? "60–120 triệu"
          : amountInMillions <= 250
            ? "120–250 triệu"
          : "Trên 250 triệu";
  return question.options?.some((item) => item.value === value) ? value : null;
}

export function resolveConversationChoice(
  question: ConversationQuestion,
  message: string,
): string | null {
  if (question.inputType !== "choice" || !question.options?.length) return null;
  const normalizedMessage = normalizeConversationText(message);
  if (!normalizedMessage) return null;

  const directMatch = question.options.find((item) => {
    const label = normalizeConversationText(item.label);
    const value = normalizeConversationText(item.value);
    return normalizedMessage === label || normalizedMessage === value;
  });
  if (directMatch) return directMatch.value;

  const aliasedValue = CHOICE_ALIASES[question.id]?.find(([alias]) =>
    normalizedMessage.includes(alias),
  )?.[1];
  if (
    aliasedValue &&
    question.options.some((item) => item.value === aliasedValue)
  ) {
    return aliasedValue;
  }

  const budgetChoice = findBudgetChoice(question, normalizedMessage);
  if (budgetChoice) return budgetChoice;

  const messageTokens = new Set(
    normalizedMessage
      .split(" ")
      .filter((token) => token.length > 1 && !CONVERSATION_STOP_WORDS.has(token)),
  );
  const scored = question.options
    .map((item) => {
      const optionTokens = Array.from(
        new Set(
          normalizeConversationText(`${item.label} ${item.value}`)
            .split(" ")
            .filter(
              (token) =>
                token.length > 1 && !CONVERSATION_STOP_WORDS.has(token),
            ),
        ),
      );
      const score = optionTokens.reduce(
        (total, token) => total + (messageTokens.has(token) ? 1 : 0),
        0,
      );
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score);

  if (!scored.length || scored[0].score === scored[1]?.score) return null;
  return scored[0].item.value;
}

export function getConversationHistory(
  session: ConversationSession,
): ConversationHistoryItem[] {
  return CONVERSATION_HISTORY_FIELDS.flatMap<ConversationHistoryItem>(
    ({ field, label }) => {
      if (field === "images") {
        const value = session.memory.images.length
          ? `${session.memory.images.length} ảnh đã chọn`
          : session.memory.imagesDeferred
            ? "Mình sẽ bổ sung sau"
            : null;
        return value ? [{ field, label, value }] : [];
      }

      const value = session.memory[field];
      return typeof value === "string" && value.trim()
        ? [{ field, label, value: value.trim() }]
        : [];
    },
  );
}

const REQUIRED_STATE_BY_FIELD: ReadonlyArray<{
  field: MemoryField;
  state: ConversationState;
}> = [
  { field: "intent", state: "WELCOME" },
  { field: "service", state: "SERVICE_SELECTION" },
  { field: "projectType", state: "PROJECT_TYPE" },
  { field: "location", state: "LOCATION" },
  { field: "images", state: "IMAGE_COLLECTION" },
  { field: "dimensions", state: "SIZE_COLLECTION" },
  { field: "style", state: "STYLE_COLLECTION" },
  { field: "material", state: "MATERIAL_COLLECTION" },
  { field: "budget", state: "BUDGET_COLLECTION" },
  { field: "timeline", state: "TIME_COLLECTION" },
  { field: "priority", state: "REQUIREMENT_COLLECTION" },
];

const STATE_PROGRESS: Record<ConversationState, ProposalSnapshot["progress"]> = {
  START: 10,
  WELCOME: 10,
  SERVICE_SELECTION: 10,
  PROJECT_TYPE: 20,
  LOCATION: 20,
  IMAGE_COLLECTION: 35,
  SIZE_COLLECTION: 35,
  STYLE_COLLECTION: 50,
  MATERIAL_COLLECTION: 50,
  BUDGET_COLLECTION: 70,
  TIME_COLLECTION: 70,
  REQUIREMENT_COLLECTION: 70,
  ANALYSIS: 90,
  SIMILAR_PROJECT_SEARCH: 90,
  OPTION_COMPARISON: 90,
  PROPOSAL_BUILDING: 90,
  CONFIDENCE_CHECK: 90,
  SURVEY_BOOKING: 90,
  QUOTE_REQUEST: 90,
  HUMAN_HANDOVER: 90,
  DONE: 100,
};

const STATE_LABELS: Record<ConversationState, string> = {
  START: "Khởi tạo",
  WELCOME: "Mục tiêu",
  SERVICE_SELECTION: "Hạng mục",
  PROJECT_TYPE: "Loại công trình",
  LOCATION: "Khu vực",
  IMAGE_COLLECTION: "Ảnh hiện trạng",
  SIZE_COLLECTION: "Kích thước",
  STYLE_COLLECTION: "Phong cách",
  MATERIAL_COLLECTION: "Vật liệu",
  BUDGET_COLLECTION: "Ngân sách",
  TIME_COLLECTION: "Thời gian",
  REQUIREMENT_COLLECTION: "Ưu tiên",
  ANALYSIS: "Phân tích",
  SIMILAR_PROJECT_SEARCH: "Đối chiếu công trình",
  OPTION_COMPARISON: "So sánh phương án",
  PROPOSAL_BUILDING: "Tạo Proposal",
  CONFIDENCE_CHECK: "Kiểm tra độ chính xác",
  SURVEY_BOOKING: "Đặt khảo sát",
  QUOTE_REQUEST: "Yêu cầu báo giá",
  HUMAN_HANDOVER: "Bàn giao kỹ sư",
  DONE: "Hoàn tất hồ sơ",
};

function hasMemoryValue(memory: ProjectMemory, field: MemoryField): boolean {
  const value = memory[field];
  return Array.isArray(value) ? value.length > 0 : typeof value === "string" && value.trim().length > 0;
}

function hasCollectionResponse(memory: ProjectMemory, field: MemoryField): boolean {
  if (field === "images") {
    return memory.images.length > 0 || memory.imagesDeferred === true;
  }
  return hasMemoryValue(memory, field);
}

function calculateConfidence(memory: ProjectMemory): number {
  const completed = REQUIRED_MEMORY.reduce(
    (score, item) => score + (hasMemoryValue(memory, item.field) ? 7 : 0),
    0,
  );
  const dimensionsVerified = memory.dimensions && memory.dimensions !== "Cần khảo sát đo đạc" ? 3 : 0;
  const materialVerified = memory.material && memory.material !== "Cần kỹ sư xác định" ? 3 : 0;
  const surveyData = memory.surveyWindow && memory.surveyWindow !== "Yêu cầu khảo sát" ? 5 : 0;
  const contactData = memory.phone && memory.surveyAddress ? 5 : 0;
  return Math.min(95, completed + dimensionsVerified + materialVerified + surveyData + contactData);
}

function calculateLeadScore(memory: ProjectMemory, confidence: number): number {
  const budgetScore = memory.budget ? 20 : 0;
  const timelineScore = memory.timeline?.includes("2 tuần")
    ? 20
    : memory.timeline?.includes("1 tháng")
      ? 18
      : memory.timeline?.includes("1–3")
        ? 15
        : memory.timeline
          ? 10
          : 0;
  const intentScore =
    memory.intent === "Khảo sát" || memory.intent === "Thi công"
      ? 20
      : memory.intent === "Hỏi giá"
        ? 18
        : memory.intent
          ? 12
          : 0;
  const commitmentScore = (memory.surveyWindow ? 5 : 0) + (memory.phone ? 5 : 0);
  return Math.min(100, budgetScore + timelineScore + intentScore + commitmentScore + Math.round(confidence / 4));
}

function buildProposal(memory: ProjectMemory, state: ConversationState): ProposalSnapshot {
  const facts = [
    memory.service && `Hạng mục: ${memory.service}`,
    memory.projectType && `Công trình: ${memory.projectType}`,
    memory.location && `Khu vực: ${memory.location}`,
    memory.dimensions && `Kích thước: ${memory.dimensions}`,
    memory.style && `Phong cách: ${memory.style}`,
    memory.material && `Vật liệu ưu tiên: ${memory.material}`,
    memory.budget && `Ngân sách: ${memory.budget}`,
    memory.timeline && `Triển khai: ${memory.timeline}`,
    memory.priority && `Ưu tiên: ${memory.priority}`,
    memory.images.length > 0 && `Ảnh hiện trạng: ${memory.images.length} ảnh`,
    memory.imagesDeferred && "Ảnh hiện trạng: sẽ bổ sung sau",
  ].filter((fact): fact is string => Boolean(fact));

  const missing = REQUIRED_MEMORY.filter(({ field }) => !hasMemoryValue(memory, field)).map(
    ({ label }) => label,
  );

  const summary = memory.service
    ? `Hồ sơ ${memory.service.toLowerCase()}${memory.projectType ? ` cho ${memory.projectType.toLowerCase()}` : ""}${memory.location ? ` tại ${memory.location}` : ""}.`
    : "Hồ sơ sẽ tăng dần theo từng dữ liệu được xác nhận.";

  return {
    progress: STATE_PROGRESS[state],
    summary,
    facts,
    missing,
    costRange: null,
    verificationNote:
      "Khoảng chi phí, phương án kỹ thuật và công trình tương tự chỉ được xác nhận sau khi đối chiếu Knowledge Base và khảo sát thực tế.",
  };
}

function enrichSession(session: ConversationSession): ConversationSession {
  const confidence = calculateConfidence(session.memory);
  return {
    ...session,
    confidence,
    leadScore: calculateLeadScore(session.memory, confidence),
    proposal: buildProposal(session.memory, session.state),
    updatedAt: new Date().toISOString(),
  };
}

function visitState(session: ConversationSession, state: ConversationState): ConversationSession {
  const visitedStates = session.visitedStates.includes(state)
    ? session.visitedStates
    : [...session.visitedStates, state];
  return { ...session, state, visitedStates };
}

function applyMemoryValue(
  memory: ProjectMemory,
  field: MemoryField,
  value: string | StoredImage[],
): ProjectMemory {
  if (field === "images") {
    return { ...memory, images: value as StoredImage[], imagesDeferred: false };
  }
  return { ...memory, [field]: (value as string).trim() };
}

function sanitizeMemory(value: Partial<ProjectMemory>): ProjectMemory {
  const images = Array.isArray(value.images)
    ? value.images
        .filter(
          (image): image is StoredImage =>
            typeof image === "object" &&
            image !== null &&
            typeof image.storageKey === "string" &&
            image.storageKey.length > 0 &&
            image.storageKey.length <= 500 &&
            typeof image.name === "string" &&
            image.name.length > 0 &&
            image.name.length <= 255 &&
            typeof image.size === "number" &&
            Number.isFinite(image.size) &&
            image.size > 0 &&
            image.size <= 10 * 1024 * 1024 &&
            ["image/jpeg", "image/png", "image/webp"].includes(image.type) &&
            typeof image.lastModified === "number" &&
            Number.isFinite(image.lastModified),
        )
        .slice(0, 5)
    : [];
  const sanitized: ProjectMemory = {
    images,
    imagesDeferred: images.length === 0 && value.imagesDeferred === true,
  };

  STRING_MEMORY_FIELDS.forEach((field) => {
    const fieldValue = value[field];
    if (typeof fieldValue !== "string") return;
    const normalized = fieldValue.trim().slice(0, 500);
    if (!normalized) return;
    if ((field === "phone" || field === "zalo") && !/^\+?\d[\d .-]{7,14}\d$/.test(normalized)) {
      return;
    }
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return;
    if (field === "name" && normalized.length < 2) return;
    if (field === "surveyAddress" && normalized.length < 8) return;
    Object.assign(sanitized, { [field]: normalized });
  });

  return sanitized;
}

function getSafeRestoredState(
  requestedState: ConversationState,
  memory: ProjectMemory,
): ConversationState {
  const requestedIndex = CONVERSATION_STATES.indexOf(requestedState);
  const incomplete = REQUIRED_STATE_BY_FIELD.find(
    ({ field, state }) =>
      !hasCollectionResponse(memory, field) &&
      requestedIndex > CONVERSATION_STATES.indexOf(state),
  );
  if (incomplete) return incomplete.state;
  if (
    requestedIndex > CONVERSATION_STATES.indexOf("SURVEY_BOOKING") &&
    (!memory.surveyWindow || memory.surveyWindow === "Yêu cầu khảo sát")
  ) {
    return "SURVEY_BOOKING";
  }
  if (requestedIndex > CONVERSATION_STATES.indexOf("QUOTE_REQUEST") && !memory.quoteRequest) {
    return "QUOTE_REQUEST";
  }
  if (requestedIndex >= CONVERSATION_STATES.indexOf("HUMAN_HANDOVER")) {
    if (!memory.name) return "HUMAN_HANDOVER";
    if (!memory.phone) return "HUMAN_HANDOVER";
    if (!memory.surveyAddress) return "HUMAN_HANDOVER";
  }
  return requestedState;
}

function advanceAfterAnswer(session: ConversationSession): ConversationSession {
  if (session.state === "REQUIREMENT_COLLECTION") {
    return ["ANALYSIS", "SIMILAR_PROJECT_SEARCH", "OPTION_COMPARISON", "PROPOSAL_BUILDING", "CONFIDENCE_CHECK"]
      .reduce(
        (current, state) => visitState(current, state as ConversationState),
        session,
      );
  }

  if (session.state === "HUMAN_HANDOVER") {
    const nextStep = session.handoverStep + 1;
    return nextStep < HANDOVER_QUESTIONS.length
      ? { ...session, handoverStep: nextStep }
      : visitState({ ...session, handoverStep: nextStep }, "DONE");
  }

  const currentIndex = CONVERSATION_STATES.indexOf(session.state);
  const nextState = CONVERSATION_STATES[currentIndex + 1];
  return nextState ? visitState(session, nextState) : session;
}

function validateImages(value: string | StoredImage[]): string | null {
  if (!Array.isArray(value) || value.length === 0) return "Cần ít nhất một ảnh hiện trạng.";
  if (value.length > 5) return "Chỉ nhận tối đa 5 ảnh cho một hồ sơ.";
  const invalid = value.find(
    (image) =>
      !["image/jpeg", "image/png", "image/webp"].includes(image.type) ||
      image.storageKey.trim().length === 0 ||
      image.storageKey.length > 500 ||
      image.name.trim().length === 0 ||
      image.name.length > 255 ||
      image.size <= 0 ||
      image.size > 10 * 1024 * 1024,
  );
  return invalid ? `Ảnh ${invalid.name} không đúng định dạng hoặc vượt quá 10 MB.` : null;
}

function validateText(question: ConversationQuestion, value: string | StoredImage[]): string | null {
  if (Array.isArray(value)) return "Dữ liệu không đúng định dạng.";
  const normalized = value.trim();
  if (question.required && normalized.length === 0) return "Cần bổ sung dữ liệu trước khi tiếp tục.";
  if (!question.required && normalized.length === 0) return null;
  if (normalized.length > 500) return "Dữ liệu vượt quá giới hạn 500 ký tự.";
  if (
    question.inputType === "choice" &&
    !question.options?.some((item) => item.value === normalized)
  ) {
    return "Lựa chọn không hợp lệ.";
  }
  if (question.field === "name" && normalized.length < 2) return "Tên cần có ít nhất 2 ký tự.";
  if (question.field === "surveyAddress" && normalized.length < 8) {
    return "Địa chỉ cần đủ số nhà, đường và khu vực.";
  }
  if (
    (question.inputType === "tel" || question.field === "zalo") &&
    !/^\+?\d[\d .-]{7,14}\d$/.test(normalized)
  ) {
    return "Số liên hệ chưa đúng định dạng.";
  }
  if (question.inputType === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return "Email chưa đúng định dạng.";
  }
  return null;
}

export function createAIConversation(): ConversationSession {
  const base: ConversationSession = {
    version: 1,
    id:
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
    state: "WELCOME",
    visitedStates: ["START", "WELCOME"],
    memory: { images: [] },
    handoverStep: 0,
    confidence: 0,
    leadScore: 0,
    proposal: {
      progress: 10,
      summary: "Hồ sơ sẽ tăng dần theo từng dữ liệu được xác nhận.",
      facts: [],
      missing: REQUIRED_MEMORY.map(({ label }) => label),
      costRange: null,
      verificationNote:
        "Khoảng chi phí, phương án kỹ thuật và công trình tương tự chỉ được xác nhận sau khi đối chiếu Knowledge Base và khảo sát thực tế.",
    },
    updatedAt: new Date().toISOString(),
  };
  return enrichSession(base);
}

export function getConversationQuestion(session: ConversationSession): ConversationQuestion | null {
  if (session.state === "HUMAN_HANDOVER") {
    return HANDOVER_QUESTIONS[session.handoverStep] ?? null;
  }
  if (session.state === "WELCOME" && session.memory.intentGroup) {
    return INTENT_QUESTIONS[session.memory.intentGroup] ?? QUESTIONS.WELCOME ?? null;
  }
  return QUESTIONS[session.state] ?? null;
}

export function answerConversation(
  session: ConversationSession,
  value: string | StoredImage[],
): ConversationSession {
  const question = getConversationQuestion(session);
  if (!question) throw new Error("Phiên tư vấn không có câu hỏi hợp lệ.");

  const error = question.inputType === "file" ? validateImages(value) : validateText(question, value);
  if (error) throw new Error(error);

  const withAnswer: ConversationSession = {
    ...session,
    memory: applyMemoryValue(session.memory, question.field, value),
  };
  return enrichSession(
    question.field === "intentGroup" ? withAnswer : advanceAfterAnswer(withAnswer),
  );
}

export function deferImageCollection(
  session: ConversationSession,
): ConversationSession {
  const question = getConversationQuestion(session);
  if (session.state !== "IMAGE_COLLECTION" || question?.field !== "images") {
    throw new Error("Chỉ có thể bổ sung ảnh sau tại bước ảnh hiện trạng.");
  }

  const deferred: ConversationSession = {
    ...session,
    memory: {
      ...session.memory,
      images: [],
      imagesDeferred: true,
    },
  };
  return enrichSession(advanceAfterAnswer(deferred));
}

export function restoreAIConversation(serialized: string | null): ConversationSession {
  if (!serialized) return createAIConversation();
  try {
    const parsed = JSON.parse(serialized) as Partial<ConversationSession>;
    if (
      parsed.version !== 1 ||
      typeof parsed.id !== "string" ||
      parsed.id.length === 0 ||
      !parsed.state ||
      !CONVERSATION_STATES.includes(parsed.state) ||
      !parsed.memory ||
      !Array.isArray(parsed.memory.images) ||
      !Array.isArray(parsed.visitedStates)
    ) {
      return createAIConversation();
    }

    const memory = sanitizeMemory(parsed.memory);
    const state = getSafeRestoredState(parsed.state, memory);
    const stateIndex = CONVERSATION_STATES.indexOf(state);
    let handoverStep =
      typeof parsed.handoverStep === "number"
        ? Math.max(0, Math.min(Math.trunc(parsed.handoverStep), HANDOVER_QUESTIONS.length))
        : 0;
    if (state === "HUMAN_HANDOVER") {
      if (!memory.name) handoverStep = 0;
      else if (!memory.phone) handoverStep = 1;
      else if (!memory.surveyAddress) handoverStep = 2;
    }

    const fallback = createAIConversation();
    const sanitizedId = parsed.id.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 100);
    const restored: ConversationSession = {
      ...fallback,
      ...parsed,
      version: 1,
      id: sanitizedId || fallback.id,
      state,
      visitedStates: CONVERSATION_STATES.slice(0, stateIndex + 1),
      memory,
      handoverStep,
    };
    return enrichSession(restored);
  } catch {
    return createAIConversation();
  }
}

export function getStateLabel(state: ConversationState): string {
  return STATE_LABELS[state];
}
