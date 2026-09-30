"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { addAddressAction, logoutAction, removeAddressAction } from "@/app/account/actions";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

export type AccountAddress = {
  id: string;
  label: string;
  line1: string;
  line2: string | null;
  city: string;
  region: string | null;
  postalCode: string | null;
  country: string;
};

export type AccountOrder = {
  id: string;
  status: string;
  total: number;
  currencyCode: string;
  createdAt: string;
  items: { id: string; name: string; quantity: number; price: number }[];
};

const inputClass =
  "border-b border-eo-platinum bg-transparent py-2 text-sm placeholder:text-eo-grey focus:border-eo-obsidian outline-none focus-visible:[outline:2px_solid_var(--eo-obsidian)] focus-visible:outline-offset-2";

export function AccountDashboard({
  customer,
  addresses,
  orders,
}: {
  customer: { name: string; email: string };
  addresses: AccountAddress[];
  orders: AccountOrder[];
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addState, addFormAction, addPending] = useActionState(addAddressAction, undefined);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-eo-platinum pb-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-grey">
            Account
          </p>
          <h1 className="mt-2 text-heading font-display font-medium">{customer.name}</h1>
          <p className="mt-1 text-sm text-eo-grey">{customer.email}</p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-[11px] font-medium uppercase tracking-[0.12em] underline decoration-eo-champagne underline-offset-4"
          >
            Sign Out
          </button>
        </form>
      </div>

      <section className="mt-12">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-grey">
          Orders
        </h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-eo-grey">
            You have no orders yet — items you check out will appear here.
          </p>
        ) : (
          <ul className="mt-6 flex flex-col gap-6">
            {orders.map((order) => (
              <li key={order.id} className="border border-eo-platinum p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-eo-obsidian">
                    Order {order.id.slice(-8).toUpperCase()}
                  </p>
                  <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-eo-grey">
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-eo-grey">
                  {new Date(order.createdAt).toLocaleDateString("en-AE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <ul className="mt-4 flex flex-col gap-1">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm text-eo-grey">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity, order.currencyCode)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t border-eo-platinum pt-3 text-sm font-medium">
                  <span>Total</span>
                  <span>{formatPrice(order.total, order.currencyCode)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-grey">
          Returns
        </h2>
        <p className="mt-4 text-sm text-eo-grey">
          Returns can be requested from an order once you have one.
        </p>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-grey">
            Saved Addresses
          </h2>
          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className="text-[11px] font-medium uppercase tracking-[0.12em] underline decoration-eo-champagne underline-offset-4"
          >
            {showAddForm ? "Cancel" : "Add Address"}
          </button>
        </div>

        {showAddForm && (
          <form
            action={addFormAction}
            className="mt-6 grid grid-cols-1 gap-4 border border-eo-platinum p-6 sm:grid-cols-2"
          >
            <label htmlFor="address-label" className="sr-only">
              Label
            </label>
            <input
              id="address-label"
              name="label"
              placeholder="Label (e.g. Home)"
              className={inputClass}
            />
            <label htmlFor="address-country" className="sr-only">
              Country
            </label>
            <input
              id="address-country"
              name="country"
              placeholder="Country"
              required
              className={inputClass}
            />
            <label htmlFor="address-line1" className="sr-only">
              Address line 1
            </label>
            <input
              id="address-line1"
              name="line1"
              placeholder="Address line 1"
              required
              className={`sm:col-span-2 ${inputClass}`}
            />
            <label htmlFor="address-line2" className="sr-only">
              Address line 2
            </label>
            <input
              id="address-line2"
              name="line2"
              placeholder="Address line 2 (optional)"
              className={`sm:col-span-2 ${inputClass}`}
            />
            <label htmlFor="address-city" className="sr-only">
              City
            </label>
            <input
              id="address-city"
              name="city"
              placeholder="City"
              required
              className={inputClass}
            />
            <label htmlFor="address-region" className="sr-only">
              State / Region
            </label>
            <input
              id="address-region"
              name="region"
              placeholder="State / Region"
              className={inputClass}
            />
            <label htmlFor="address-postalCode" className="sr-only">
              Postal code
            </label>
            <input
              id="address-postalCode"
              name="postalCode"
              placeholder="Postal code"
              className={inputClass}
            />
            {addState?.error && (
              <p role="alert" className="text-sm text-red-600 sm:col-span-2">
                {addState.error}
              </p>
            )}
            <div className="sm:col-span-2">
              <Button variant="primary" disabled={addPending}>
                {addPending ? "Saving..." : "Save Address"}
              </Button>
            </div>
          </form>
        )}

        <ul className="mt-6 flex flex-col gap-4">
          {addresses.length === 0 && !showAddForm && (
            <p className="text-sm text-eo-grey">No saved addresses yet.</p>
          )}
          {addresses.map((a) => (
            <li
              key={a.id}
              className="flex items-start justify-between gap-4 border border-eo-platinum p-4"
            >
              <div>
                <p className="text-sm font-medium text-eo-obsidian">{a.label}</p>
                <p className="text-sm text-eo-grey">
                  {a.line1}
                  {a.line2 ? `, ${a.line2}` : ""}
                </p>
                <p className="text-sm text-eo-grey">
                  {a.city}
                  {a.region ? `, ${a.region}` : ""} {a.postalCode ?? ""}
                </p>
                <p className="text-sm text-eo-grey">{a.country}</p>
              </div>
              <form action={removeAddressAction}>
                <input type="hidden" name="id" value={a.id} />
                <button
                  type="submit"
                  className="text-xs uppercase tracking-[0.1em] text-eo-grey transition-colors duration-[var(--eo-duration)] ease-[var(--eo-ease)] hover:text-eo-obsidian"
                >
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-grey">
          Preferences
        </h2>
        <div className="mt-4 flex items-center gap-4 text-sm text-eo-grey">
          <span>Currency: AED</span>
          <span>Language: English</span>
        </div>
        <p className="mt-2 text-xs text-eo-grey">
          Multiple currencies and languages are planned for a later phase.
        </p>
      </section>

      <section className="mt-12 border-t border-eo-platinum pt-8">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-grey">
          Concierge
        </h2>
        <Link
          href="/#concierge"
          className="mt-4 inline-block text-sm underline decoration-eo-champagne underline-offset-4"
        >
          Contact the EYEOCEAN Concierge
        </Link>
      </section>
    </div>
  );
}
