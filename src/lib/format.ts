export function formatPrice(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-AE")}`;
}
