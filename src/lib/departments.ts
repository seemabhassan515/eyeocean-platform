export const DEPARTMENTS = [
  { label: "Fashion", slug: "fashion" },
  { label: "Jewelry", slug: "jewelry" },
  { label: "Beauty & Wellness", slug: "beauty" },
  { label: "Technology & Living", slug: "technology" },
  { label: "Art & Collectibles", slug: "art" },
  { label: "Lifestyle", slug: "lifestyle" },
] as const;

export type Department = (typeof DEPARTMENTS)[number];
