"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { createSession, destroySession, getCurrentCustomer, hashPassword, verifyPassword } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

type FormState = { error?: string } | undefined;

export async function registerAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const ip = await getClientIp();
  // 5 new accounts per hour per IP — generous for a real person, blunt
  // enough to slow down scripted signup spam.
  if (!rateLimit(`register:${ip}`, 5, 60 * 60 * 1000).allowed) {
    return { error: "Too many attempts. Please try again later." };
  }

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();

  if (!email || !password || !name) return { error: "All fields are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) return { error: "An account with this email already exists." };

  const passwordHash = await hashPassword(password);
  const customer = await prisma.customer.create({ data: { email, name, passwordHash } });
  await createSession(customer.id);
  redirect("/account");
}

export async function loginAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const ip = await getClientIp();
  // 10 attempts per 5 minutes per IP — enough for a real person who
  // mistypes their password a few times, tight enough to slow down
  // credential-stuffing/brute-force attempts.
  if (!rateLimit(`login:${ip}`, 10, 5 * 60 * 1000).allowed) {
    return { error: "Too many attempts. Please try again in a few minutes." };
  }

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Email and password are required." };

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer || !(await verifyPassword(password, customer.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  await createSession(customer.id);
  redirect("/account");
}

export async function logoutAction() {
  await destroySession();
  redirect("/account");
}

export async function addAddressAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const customer = await getCurrentCustomer();
  if (!customer) return { error: "You must be signed in." };

  const label = String(formData.get("label") || "").trim() || "Address";
  const line1 = String(formData.get("line1") || "").trim();
  const line2 = String(formData.get("line2") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const region = String(formData.get("region") || "").trim();
  const postalCode = String(formData.get("postalCode") || "").trim();
  const country = String(formData.get("country") || "").trim();

  if (!line1 || !city || !country) {
    return { error: "Address line, city and country are required." };
  }

  await prisma.address.create({
    data: {
      customerId: customer.id,
      label,
      line1,
      line2: line2 || null,
      city,
      region: region || null,
      postalCode: postalCode || null,
      country,
    },
  });

  revalidatePath("/account");
  return undefined;
}

export async function removeAddressAction(formData: FormData) {
  const customer = await getCurrentCustomer();
  if (!customer) return;

  const id = String(formData.get("id") || "");
  // deleteMany + customerId filter, not delete-by-id alone, so a customer
  // can never delete another customer's address by guessing an id.
  await prisma.address.deleteMany({ where: { id, customerId: customer.id } });
  revalidatePath("/account");
}
