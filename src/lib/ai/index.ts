export interface AIQuotationContext {
  companyName: string;
  email: string;
  primaryPhone: string;
  address: string;
}

export interface AIKnowledgeProvider {
  getContext(): Promise<AIQuotationContext>;
}

export class KnowledgeProvider implements AIKnowledgeProvider {
  async getContext(): Promise<AIQuotationContext> {
    return {
      companyName: "CÔNG TY TNHH CƠ KHÍ XÂY DỰNG ĐẠI HẢI PHÁT",
      email: "daihaiphat83@gmail.com",
      primaryPhone: "0785.505.518",
      address: "DL12, Khu phố 3B, Thới Hòa, TP. Hồ Chí Minh 820000, Việt Nam",
    };
  }
}

export class QuotationProvider {
  async buildQuotationSummary(projectType: string): Promise<string> {
    return `Đề xuất báo giá cho ${projectType} dựa trên thông tin doanh nghiệp và quy trình kỹ thuật hiện có.`;
  }
}
