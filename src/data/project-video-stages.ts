import type { ScrollScrubStage } from "@/lib/scrollScrub";

// Verified local assets only. Until an approved process video is delivered, the
// homepage "Video công trình" block scrubs these images across the existing
// Khảo sát → Gia công → Hoàn thiện narrative. `time` values are the future video
// cue points and are only displayed when a real video source is wired in.
export const PROJECT_VIDEO_STAGES: readonly ScrollScrubStage[] = [
  {
    time: 0,
    label: "Khảo sát",
    image: "/images/gates/gate02.webp",
    alt: "Bản vẽ kỹ thuật cổng CNC dùng để chốt phương án sau khảo sát tại Đại Hải Phát",
  },
  {
    time: 4,
    label: "Gia công",
    image: "/images/factory/factory01.webp",
    alt: "Gia công khung lan can CNC tại xưởng Đại Hải Phát",
  },
  {
    time: 9,
    label: "Hoàn thiện",
    image: "/images/railings/railing07.webp",
    alt: "Lan can CNC hoàn thiện tại công trình Đại Hải Phát",
  },
];
