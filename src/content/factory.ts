export const FACTORY_OVERVIEW = {
  name: "Nhà máy Đại Hải Phát",
  location: "Long An, Việt Nam",
  established: "2018",
  description: "Nhà máy hiện đại với diện tích 5,000 m² được trang bị công nghệ gia công CNC, hàn robot và hệ thống chất lượng tự động để đảm bảo sản phẩm đạt chuẩn quốc tế.",
  highlights: [
    "Sản xuất đúng tiến độ 100%",
    "Chứng chỉ ISO 9001:2015",
    "Kiểm tra chất lượng 360 độ",
    "Tối ưu môi trường",
  ],
};

export const PRODUCTION_CAPACITY = {
  monthly: "450 m³",
  daily: "18 m³",
  workforce: "120 kỹ sư và công nhân",
  machineCount: "28 máy gia công",
  description: "Năng lực sản xuất liên tục với đội ngũ chuyên môn cao và công nghệ tối tân.",
};

export const MACHINERY = [
  {
    category: "CNC Cutting & Processing",
    items: [
      {
        name: "CNC 5-Axis Router",
        spec: "X:3000mm, Y:1500mm, Z:800mm",
        count: 4,
        purpose: "Gia công composite, gỗ và MDF",
      },
      {
        name: "Sheet Metal Cutter",
        spec: "Laser 1500W",
        count: 2,
        purpose: "Cắt inox, aluminium, sơn tĩnh điện",
      },
    ],
  },
  {
    category: "Welding & Assembly",
    items: [
      {
        name: "Robot Welding Station",
        spec: "ABB IRB 6700",
        count: 6,
        purpose: "Hàn khung thép, cấu kiện",
      },
      {
        name: "Manual Welding Station",
        spec: "500A IGBT Inverter",
        count: 8,
        purpose: "Hàn chi tiết phức tạp",
      },
    ],
  },
  {
    category: "Surface Treatment",
    items: [
      {
        name: "Automated Coating Line",
        spec: "1200 mm width",
        count: 1,
        purpose: "Phủ melamine và sơn công nghiệp",
      },
      {
        name: "Powder Coating Booth",
        spec: "1500 mm width",
        count: 2,
        purpose: "Sơn tĩnh điện chi tiết thép",
      },
    ],
  },
];

export const WORKFLOW = [
  {
    step: 1,
    name: "Khảo sát & Thiết kế",
    description: "Đo đạc tại công trình, lập bản vẽ 3D CAD theo yêu cầu khách hàng.",
    duration: "1-3 ngày",
  },
  {
    step: 2,
    name: "Gia công chi tiết",
    description: "Sử dụng CNC gia công từng bộ phận theo bản vẽ kỹ thuật chính xác.",
    duration: "3-7 ngày",
  },
  {
    step: 3,
    name: "Hàn & Lắp ráp",
    description: "Hàn robot tự động hoặc thủ công tuỳ theo yêu cầu chi tiết.",
    duration: "2-5 ngày",
  },
  {
    step: 4,
    name: "Xử lý bề mặt",
    description: "Phủ melamine, sơn tĩnh điện hoặc xử lý bề mặt khác.",
    duration: "1-3 ngày",
  },
  {
    step: 5,
    name: "Kiểm tra chất lượng",
    description: "Kiểm tra 360° độ theo tiêu chuẩn ISO 9001:2015.",
    duration: "1-2 ngày",
  },
  {
    step: 6,
    name: "Đóng gói & Giao hàng",
    description: "Đóng gói an toàn, vận chuyển đến công trình hoặc kho khách hàng.",
    duration: "1-2 ngày",
  },
];

export const QUALITY_CONTROL = [
  {
    name: "Kiểm tra kích thước",
    method: "CMM (Coordinate Measuring Machine)",
    frequency: "100% sản phẩm",
    tolerance: "±0.5mm",
  },
  {
    name: "Kiểm tra hàn",
    method: "X-ray & Ultra-sonic Inspection",
    frequency: "Mẫu + Đặc thù đơn hàng",
    tolerance: "Per ISO 5817",
  },
  {
    name: "Kiểm tra bề mặt",
    method: "Độ bóng, độ dầu, kiểm tra trầy xước",
    frequency: "100% sản phẩm",
    tolerance: "Ra < 1.6µm",
  },
  {
    name: "Kiểm tra độ bền",
    method: "Thử độ bền chất lượng, chịu lực",
    frequency: "Đặc thù đơn hàng",
    tolerance: "Per design spec",
  },
  {
    name: "Kiểm tra thành phần vật liệu",
    method: "XRF (X-ray Fluorescence)",
    frequency: "Đầu mỗi lô nguyên liệu",
    tolerance: "Per material cert",
  },
];

export const CERTIFICATES = [
  {
    name: "ISO 9001:2015",
    issuer: "TÜV SÜD",
    year: "2020",
    expiry: "2026",
    scope: "Design, manufacture, and installation of composite and steel structures",
  },
  {
    name: "ISO 45001:2018",
    issuer: "Lloyd's Register",
    year: "2021",
    expiry: "2024",
    scope: "Occupational health and safety management",
  },
  {
    name: "ISO 14001:2015",
    issuer: "Bureau Veritas",
    year: "2022",
    expiry: "2025",
    scope: "Environmental management system",
  },
  {
    name: "ABS",
    issuer: "American Bureau of Shipping",
    year: "2021",
    expiry: "2026",
    scope: "Welding and structural fabrication approval",
  },
];

export const FACTORY_TIMELINE = [
  {
    year: "2018",
    event: "Thành lập nhà máy tại Long An",
    description: "Khởi động sản xuất với 30 nhân viên và 8 máy gia công.",
  },
  {
    year: "2019",
    event: "Đầu tư hệ thống CNC hiện đại",
    description: "Mở rộng năng lực với 6 máy CNC 5-axis router và 2 máy cắt laser.",
  },
  {
    year: "2020",
    event: "Đạt chứng chỉ ISO 9001:2015",
    description: "Được công nhận chất lượng sản phẩm theo tiêu chuẩn quốc tế.",
  },
  {
    year: "2021",
    event: "Lắp đặt robot welding station",
    description: "Tăng năng suất hàn tự động lên 6 robot 6-axis ABB IRB 6700.",
  },
  {
    year: "2022",
    event: "Xây dựng hệ thống coating tự động",
    description: "Phủ melamine và sơn công nghiệp tự động với dây chuyền 1200mm.",
  },
  {
    year: "2024",
    event: "Mở rộng quy mô nhà máy",
    description: "Diện tích nhà máy tăng lên 5,000 m², nhân viên mở rộng lên 120 người.",
  },
];

export const STATISTICS = [
  {
    label: "Diện tích nhà máy",
    value: "5,000 m²",
    icon: "building-2",
  },
  {
    label: "Năng lực sản xuất",
    value: "450 m³/tháng",
    icon: "factory",
  },
  {
    label: "Nhân viên",
    value: "120+",
    icon: "users",
  },
  {
    label: "Máy gia công",
    value: "28",
    icon: "cpu",
  },
  {
    label: "Dự án hoàn thành",
    value: "500+",
    icon: "check-circle-2",
  },
  {
    label: "Tỷ lệ đúng tiến độ",
    value: "100%",
    icon: "trending-up",
  },
];

export const GALLERY_IMAGES = [
  {
    category: "CNC Processing",
    url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80",
    title: "Gia công CNC",
  },
  {
    category: "Welding",
    url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80",
    title: "Hàn Robot",
  },
  {
    category: "Assembly",
    url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80",
    title: "Lắp ráp",
  },
  {
    category: "Coating",
    url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80",
    title: "Phủ sơn",
  },
  {
    category: "Quality Control",
    url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80",
    title: "Kiểm tra chất lượng",
  },
  {
    category: "Packaging",
    url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80",
    title: "Đóng gói",
  },
];
