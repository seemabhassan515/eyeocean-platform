import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (client) return client;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY must be set (see .env.example) to use checkout."
    );
  }

  client = new Stripe(secretKey);
  return client;
}
