import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-[var(--eo-duration)] ease-[var(--eo-ease)] disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-eo-obsidian text-eo-ivory px-8 py-4 hover:bg-eo-black",
  secondary:
    "border border-eo-obsidian text-eo-obsidian px-8 py-4 hover:bg-eo-obsidian hover:text-eo-ivory",
  ghost:
    "text-eo-obsidian px-1 py-1 border-b border-transparent hover:border-eo-champagne",
};

type CommonProps = { variant?: Variant; className?: string };
type AnchorProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" };
type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };

export function Button({
  as = "button",
  variant = "primary",
  className = "",
  ...props
}: AnchorProps | ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;
  if (as === "a") {
    return <a className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />;
  }
  return <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />;
}
