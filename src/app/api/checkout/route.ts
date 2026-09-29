import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getCurrentCustomer } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { rateLimit } from "@/lib/rate-limit";

type CheckoutLine = { id: string; qty: number };

// Countries Stripe Checkout will collect a shipping address for. Adjust to
// match where EYEOCEAN actually ships once that's decided — this is just a
// reasonable Gulf + a few international default.
const ALLOWED_SHIPPING_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  ["AE", "SA", "KW", "QA", "BH", "OM", "US", "GB"];

export async function POST(request: NextRequest) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json({ error: "You must be signed in to check out." }, { status: 401 });
  }

  // 10 checkout attempts per 10 minutes per customer — generous for someone
  // genuinely retrying (changed their mind, fixed a card error), tight
  // enough to blunt scripted abuse creating pending orders / Stripe sessions.
  if (!rateLimit(`checkout:${customer.id}`, 10, 10 * 60 * 1000).allowed) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Please try again shortly." },
      { status: 429 }
    );
  }

  const body = (await request.json().catch(() => null)) as { lines?: CheckoutLine[] } | null;
  const lines = body?.lines?.filter((l) => l?.id && l.qty > 0) ?? [];
  if (lines.length === 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  const slugs = lines.map((l) => l.id);
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    include: { brand: true },
  });
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  if (products.length !== new Set(slugs).size) {
    return NextResponse.json({ error: "One or more items are no longer available." }, { status: 400 });
  }

  const orderItems = lines.map((line) => {
    const product = bySlug.get(line.id)!;
    const quantity = Math.min(10, Math.max(1, Math.floor(line.qty)));
    return { product, quantity };
  });

  const total = orderItems.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);

  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      status: "pending",
      total,
      currencyCode: "AED",
      items: {
        create: orderItems.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
          price: product.price,
        })),
      },
    },
  });

  const origin = request.nextUrl.origin;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,
      line_items: orderItems.map(({ product, quantity }) => ({
        quantity,
        price_data: {
          currency: "aed",
          unit_amount: product.price * 100,
          product_data: { name: `${product.brand.name} — ${product.name}` },
        },
      })),
      shipping_address_collection: { allowed_countries: ALLOWED_SHIPPING_COUNTRIES },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error);
    // The Order row stays as an abandoned "pending" record — harmless, and
    // useful for debugging which checkouts never made it to Stripe.
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable. Please try again." },
      { status: 502 }
    );
  }
}
