import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

/**
 * Confirms paid orders. This is the production mechanism (Stripe calls it
 * directly, independent of whether the customer's browser ever reaches the
 * success page). Locally, Stripe can't reach localhost without the Stripe
 * CLI (`stripe listen --forward-to localhost:PORT/api/webhooks/stripe`) — the
 * success page (src/app/checkout/success/page.tsx) has its own fallback
 * verification so checkout can still be tested end-to-end without it.
 */
export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

      await prisma.order
        .update({
          where: { id: orderId },
          data: {
            status: "paid",
            stripePaymentIntentId: paymentIntentId,
            shippingAddress: session.collected_information?.shipping_details
              ? JSON.parse(JSON.stringify(session.collected_information.shipping_details))
              : undefined,
          },
        })
        .catch((error) => {
          console.error("Failed to mark order paid from Stripe webhook:", error);
        });
    }
  }

  return NextResponse.json({ received: true });
}
