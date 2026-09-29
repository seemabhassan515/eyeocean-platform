import { getCurrentCustomer } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AuthForms } from "@/components/account/AuthForms";
import { AccountDashboard } from "@/components/account/AccountDashboard";

export const metadata = { title: "Account", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 lg:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-champagne-text">
          Account
        </p>
        <h1 className="mt-3 text-heading font-display font-medium">Welcome</h1>
        <div className="mt-10">
          <AuthForms />
        </div>
      </div>
    );
  }

  const [addresses, orders] = await Promise.all([
    prisma.address.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        label: true,
        line1: true,
        line2: true,
        city: true,
        region: true,
        postalCode: true,
        country: true,
      },
    }),
    prisma.order.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: { include: { brand: true } } } } },
    }),
  ]);

  const orderSummaries = orders.map((order) => ({
    id: order.id,
    status: order.status,
    total: order.total,
    currencyCode: order.currencyCode,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      name: `${item.product.brand.name} — ${item.product.name}`,
      quantity: item.quantity,
      price: item.price,
    })),
  }));

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-16 lg:px-8">
      <AccountDashboard
        customer={{ name: customer.name, email: customer.email }}
        addresses={addresses}
        orders={orderSummaries}
      />
    </div>
  );
}
