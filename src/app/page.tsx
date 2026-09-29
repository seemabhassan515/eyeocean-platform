import { Hero } from "@/components/Hero";
import { NewArrivals } from "@/components/NewArrivals";
import { DepartmentBento } from "@/components/DepartmentBento";
import { JournalTeaser } from "@/components/JournalTeaser";
import { ConciergeSection } from "@/components/ConciergeSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Statically generated at build time, then refreshed in the background at
// most once per hour — new products/articles show up without a full
// redeploy. See prisma/schema.prisma's Phase 11 note for the wider context.
export const revalidate = 3600;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/opengraph-image`,
};

export default function Home() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <Hero />
      <NewArrivals />
      <DepartmentBento />
      <JournalTeaser />
      <ConciergeSection />
    </>
  );
}
