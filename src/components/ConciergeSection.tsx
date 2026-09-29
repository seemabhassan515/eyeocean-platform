const ACTIONS = [
  "Contact Concierge",
  "Book an Appointment",
  "Request Product Assistance",
  "Shipping Assistance",
];

export function ConciergeSection() {
  return (
    <section className="bg-eo-obsidian px-6 py-24 text-eo-ivory lg:px-8" id="concierge">
      <div className="mx-auto max-w-[1600px]">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-champagne">
          The EYEOCEAN Concierge
        </p>
        <h2 className="mt-3 max-w-xl text-heading font-display font-medium">
          Personal assistance for exceptional purchases.
        </h2>

        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
          {ACTIONS.map((action) => (
            <button
              key={action}
              type="button"
              className="border-b border-eo-ivory/30 pb-1 text-sm text-eo-ivory/85 transition-colors hover:border-eo-champagne hover:text-eo-ivory"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
