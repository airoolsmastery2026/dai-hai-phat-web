import type { LucideIcon } from "lucide-react";

export interface CompanyConfig {
  name: string;
  shortName: string;
  phones: Array<{ display: string; raw: string }>;
  primaryPhone: string;
  email: string;
  address: string;
  coordinates: { lat: number; lng: number };
  googleMapsUrl: string;
  websiteUrl: string;
  socials: {
    zalo1: string;
    whatsapp1: string;
  };
}

export interface StatItem {
  label: string;
  value: string;
}

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceProcessStep {
  title: string;
  description: string;
}

export interface ServiceFaqItem {
  question: string;
  answer: string;
}

export interface ServiceSeo {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
}

export type AIServicePreset =
  | "Cửa cổng"
  | "Cầu thang và lan can"
  | "Mái che"
  | "Nội thất"
  | "Cải tạo không gian";

export interface ServiceItem {
  id: number;
  slug: string;
  aiService: AIServicePreset;
  title: string;
  subtitle: string;
  summary: string;
  fullDescription: string;
  desc: string;
  features: ServiceFeature[];
  benefits: string[];
  process: ServiceProcessStep[];
  gallery: string[];
  faq: ServiceFaqItem[];
  seo: ServiceSeo;
  schema: Record<string, unknown>;
  image: string;
  icon: LucideIcon;
}

export interface ProjectWorkflowStep {
  title: string;
  description: string;
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface ProjectItem {
  id: number;
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  client: string;
  description: string;
  challenge: string;
  solution: string;
  workflow: ProjectWorkflowStep[];
  materials: string[];
  technologies: string[];
  gallery: string[];
  beforeImages: string[];
  afterImages: string[];
  statistics: StatItem[];
  testimonial: ProjectTestimonial;
  faq: ServiceFaqItem[];
  seo: ServiceSeo;
  schema: Record<string, unknown>;
  image: string;
  summary: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  highlights: string[];
  image: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: number;
  title: string;
  description: string;
}

export interface HomeHeroContent {
  eyebrow: string;
  title: string;
  highlights: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  imageAlt: string;
}

export interface HomeSectionContent {
  eyebrow: string;
  title: string;
  intro?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface HomeAboutContent {
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
}

export interface HomeContactContent {
  eyebrow: string;
  title: string;
  description: string;
  nameLabel: string;
  phoneLabel: string;
  messageLabel: string;
  submitLabel: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  messagePlaceholder: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}
