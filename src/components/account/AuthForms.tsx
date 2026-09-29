"use client";

import { useActionState, useState } from "react";
import { loginAction, registerAction } from "@/app/account/actions";
import { Button } from "@/components/ui/Button";

const inputClass =
  "border-b border-eo-platinum bg-transparent py-2 text-sm placeholder:text-eo-grey focus:border-eo-obsidian outline-none focus-visible:[outline:2px_solid_var(--eo-obsidian)] focus-visible:outline-offset-2";

export function AuthForms() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loginState, loginFormAction, loginPending] = useActionState(loginAction, undefined);
  const [registerState, registerFormAction, registerPending] = useActionState(
    registerAction,
    undefined
  );

  return (
    <div>
      <div className="flex gap-8 border-b border-eo-platinum">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={`pb-4 text-[11px] font-medium uppercase tracking-[0.14em] ${
            tab === "login" ? "border-b border-eo-obsidian text-eo-obsidian" : "text-eo-grey"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          className={`pb-4 text-[11px] font-medium uppercase tracking-[0.14em] ${
            tab === "register" ? "border-b border-eo-obsidian text-eo-obsidian" : "text-eo-grey"
          }`}
        >
          Create Account
        </button>
      </div>

      {tab === "login" ? (
        <form action={loginFormAction} className="mt-8 flex flex-col gap-5">
          <label htmlFor="login-email" className="sr-only">
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            required
            placeholder="Email"
            className={inputClass}
          />
          <label htmlFor="login-password" className="sr-only">
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            required
            placeholder="Password"
            className={inputClass}
          />
          {loginState?.error && (
            <p role="alert" className="text-sm text-red-600">
              {loginState.error}
            </p>
          )}
          <Button variant="primary" disabled={loginPending}>
            {loginPending ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      ) : (
        <form action={registerFormAction} className="mt-8 flex flex-col gap-5">
          <label htmlFor="register-name" className="sr-only">
            Full name
          </label>
          <input
            id="register-name"
            name="name"
            required
            placeholder="Full name"
            className={inputClass}
          />
          <label htmlFor="register-email" className="sr-only">
            Email
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            required
            placeholder="Email"
            className={inputClass}
          />
          <label htmlFor="register-password" className="sr-only">
            Password (minimum 8 characters)
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Password (min. 8 characters)"
            className={inputClass}
          />
          {registerState?.error && (
            <p role="alert" className="text-sm text-red-600">
              {registerState.error}
            </p>
          )}
          <Button variant="primary" disabled={registerPending}>
            {registerPending ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      )}
    </div>
  );
}
