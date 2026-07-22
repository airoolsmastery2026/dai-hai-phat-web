export interface CmsProvider {
  name: string;
  readiness: "ready" | "planned";
  notes: string;
}

export const CMS_PROVIDERS: CmsProvider[] = [
  { name: "Sanity", readiness: "planned", notes: "Schema can be mapped to the existing content modules." },
  { name: "Contentful", readiness: "planned", notes: "Content types can mirror services, projects, blog, faq, and testimonials." },
  { name: "Strapi", readiness: "planned", notes: "REST or GraphQL endpoints can populate the same typed content layer." },
  { name: "PayloadCMS", readiness: "planned", notes: "Collections can be implemented without coupling to the UI layer." },
];
