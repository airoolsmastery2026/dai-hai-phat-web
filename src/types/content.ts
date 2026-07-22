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

export interface RelatedProjectRef {
  title: string;
  slug: string;
  category: string;
  image: string;
}

export interface ServiceItem {
  id: number;
  slug: string;
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
  relatedProjects: RelatedProjectRef[];
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
  date: string;
  author: string;
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

export interface NavigationItem {
  label: string;
  href: string;
}
