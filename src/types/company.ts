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

export interface ServiceItem {
  id: number;
  title: string;
  desc: string;
  image: string;
  icon: LucideIcon;
}

export interface ArticleItem {
  id: number;
  title: string;
  category: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
}
