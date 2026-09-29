export type MegaMenuColumn = {
  heading: string;
  links: string[];
};

export type MegaMenuContent = {
  columns: MegaMenuColumn[];
  editorial: { label: string; title: string };
};

export const MEGA_MENU: Record<string, MegaMenuContent> = {
  fashion: {
    columns: [
      { heading: "Women", links: ["New Arrivals", "Ready-to-Wear", "Shoes", "Bags", "Accessories"] },
      { heading: "Men", links: ["New Arrivals", "Tailoring", "Shoes", "Accessories"] },
      { heading: "Designers", links: ["Featured Designers", "Emerging Designers", "Iconic Houses"] },
    ],
    editorial: { label: "Editorial", title: "The New Season" },
  },
  jewelry: {
    columns: [
      { heading: "High Jewelry", links: ["Necklaces", "Earrings", "Bracelets", "Rings"] },
      { heading: "Fine Jewelry", links: ["Diamonds", "Bridal", "Collections"] },
      { heading: "Watches", links: ["New Arrivals", "Iconic Models", "Archive"] },
    ],
    editorial: { label: "Editorial", title: "Master Craftsmanship" },
  },
  beauty: {
    columns: [
      { heading: "Beauty", links: ["Skincare", "Makeup", "Fragrance", "Hair"] },
      { heading: "Wellness", links: ["Body", "Wellbeing", "Gifting"] },
    ],
    editorial: { label: "Editorial", title: "Exceptional Objects" },
  },
  technology: {
    columns: [
      { heading: "Technology", links: ["Consumer Technology", "Audio", "Smart Home"] },
      { heading: "Living", links: ["Design Objects", "Luxury Living"] },
    ],
    editorial: { label: "Editorial", title: "Modern Icons" },
  },
  art: {
    columns: [
      { heading: "Art", links: ["Paintings", "Sculpture", "Photography"] },
      { heading: "Collectibles", links: ["Limited Editions", "Cultural Objects", "Design"] },
    ],
    editorial: { label: "Editorial", title: "Archival Pieces" },
  },
  lifestyle: {
    columns: [
      { heading: "Lifestyle", links: ["Travel", "Hospitality", "Experiences"] },
      { heading: "Gifts", links: ["Gifts Under AED 1,000", "Signature Gifting"] },
    ],
    editorial: { label: "Editorial", title: "Luxury Without Boundaries" },
  },
};
