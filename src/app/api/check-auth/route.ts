import { PAGE_ACCESS_COOKIE, isValidAccessToken } from "@/utils/pageAccess";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (isValidAccessToken(request.cookies.get(PAGE_ACCESS_COOKIE)?.value)) {
    return NextResponse.json({ authenticated: true }, { status: 200, headers: { "Cache-Control": "private, no-store" } });
  }
  return NextResponse.json({ authenticated: false }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
}
