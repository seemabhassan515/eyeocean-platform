import { NextRequest, NextResponse } from "next/server";
import { getFeaturedProductForDepartment } from "@/lib/catalog";

/**
 * One product per department, fetched lazily by MegaMenu only when a
 * customer actually opens that department's menu — not eagerly for every
 * department on every page load.
 */
export async function GET(request: NextRequest) {
  const department = request.nextUrl.searchParams.get("department");
  if (!department) {
    return NextResponse.json({ product: null });
  }

  const product = await getFeaturedProductForDepartment(department);
  return NextResponse.json({ product });
}
