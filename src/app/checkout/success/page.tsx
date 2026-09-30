import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/format";
import { ClearCartOnMount } from "@/components/checkout/ClearCartOnMount";

export const metadata = { title: "Order Confirmed", robots: { index: false, follow: false } };

/**
 * Stripe's webhook (src/app/api/webhooks/stripe/route.ts) is what marks an
 * order "paid" in production. Locally, Stripe can't reach localhost without
 * the Stripe CLI, so this page also verifies directly with Stripe on load —
 * a fallback, not a replacement for the webhook (a customer who closes the
 * tab before this page loads still gets a confirmed order via the webhook).
 */
async function ensureOrderIsPaid(stripeCheckoutSessionId: string, currentStatus: string) {
  if (currentStatus === "paid") return;

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(stripeCheckoutSessionId);
  if (session.payment_status !== "paid") return;

  await prisma.order.update({
    where: { stripeCheckoutSessionId },
    data: {
      status: "paid",
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
      shippingAddress: session.collected_information?.shipping_details
        ? JSON.parse(JSON.stringify(session.collected_information.shipping_details))
        : undefined,
    },
  });
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  if (!sessionId) notFound();

  let order = await prisma.order.findUnique({
    where: { stripeCheckoutSessionId: sessionId },
    include: { items: { include: { product: { include: { brand: true } } } } },
  });
  if (!order) notFound();

  await ensureOrderIsPaid(sessionId, order.status).catch((error) => {
    console.error("Fallback order verification failed:", error);
  });

  order = await prisma.order.findUnique({
    where: { stripeCheckoutSessionId: sessionId },
    include: { items: { include: { product: { include: { brand: true } } } } },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-[700px] px-6 py-24 text-center lg:px-8">
      <ClearCartOnMount />
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-champagne-text">
        {order.status === "paid" ? "Order Confirmed" : "Processing"}
      </p>
      <h1 className="mt-3 text-heading font-display font-medium">
        {order.status === "paid" ? "Thank you." : "Confirming your payment..."}
      </h1>
      <p className="mt-4 text-sm text-eo-grey">
        {order.status === "paid"
          ? `Order reference ${order.id}. A confirmation has been recorded to your account.`
          : "This can take a few seconds. Refresh this page if it doesn't update shortly."}
      </p>

      <ul className="mt-12 flex flex-col gap-4 border-t border-eo-platinum pt-8 text-left">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between text-sm">
            <span>
              {item.product.brand.name} — {item.product.name} × {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity, order.currencyCode)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-eo-platinum pt-6 text-sm font-medium">
        <span>Total</span>
        <span>{formatPrice(order.total, order.currencyCode)}</span>
      </div>

      <Link
        href="/account"
        className="mt-12 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-eo-sm bg-eo-obsidian px-8 py-4 text-[11px] font-medium uppercase tracking-[0.14em] text-eo-ivory transition-colors duration-[var(--eo-duration)] ease-[var(--eo-ease)] hover:bg-eo-black"
      >
        View in Account
      </Link>
    </div>
  );
}
