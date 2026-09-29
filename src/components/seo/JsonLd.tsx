/**
 * Renders a JSON-LD structured data block. `data` should be a plain
 * schema.org object (or array of them) — this just serializes it safely.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
