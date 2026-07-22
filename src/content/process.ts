export interface ProcessStep {
  title: string;
  desc: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  { title: "Khảo sát", desc: "Tiếp nhận nhu cầu, đo đạc thực tế và xác định mục tiêu dự án." },
  { title: "Thiết kế", desc: "Lập bản vẽ, chọn vật liệu và tối ưu giải pháp thi công." },
  { title: "Định giá", desc: "Đưa ra báo giá rõ ràng, kịch bản tiến độ và ngân sách." },
  { title: "Sản xuất", desc: "Gia công nội thất, composite hoặc kết cấu thép theo quy trình kiểm soát." },
  { title: "Lắp đặt", desc: "Thi công tại công trình và kiểm tra chất lượng từng hạng mục." },
  { title: "Bàn giao", desc: "Nghiệm thu, bảo trì và hỗ trợ sau thi công lâu dài." },
];
