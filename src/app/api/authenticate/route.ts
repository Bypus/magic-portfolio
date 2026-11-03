import {
  PAGE_ACCESS_COOKIE,
  PAGE_ACCESS_MAX_AGE,
  clearAttempts,
  clientKey,
  createAccessToken,
  isCorrectPassword,
  takeAttempt,
} from "@/utils/pageAccess";
import * as cookie from "cookie";
import { type NextRequest, NextResponse } from "next/server";
import { guardApiRequest, readSmallJson, RequestBodyError } from "@/utils/apiSecurity";

const privateHeaders = { "Cache-Control": "private, no-store" };

export async function POST(request: NextRequest) {
  const denied = guardApiRequest(request);
  if (denied) return denied;
  if (!process.env.PAGE_ACCESS_PASSWORD) {
    console.error("PAGE_ACCESS_PASSWORD environment variable is not set");
    return NextResponse.json({ message: "Internal server error" }, { status: 500, headers: privateHeaders });
  }

  const client = clientKey(request.headers);
  const retryAfter = takeAttempt(client);
  if (retryAfter > 0) {
    return NextResponse.json(
      { message: "Too many attempts, try again later" },
      { status: 429, headers: { ...privateHeaders, "Retry-After": String(retryAfter) } },
    );
  }

  let password: unknown;
  try {
    const body = await readSmallJson(request);
    password = body && typeof body === "object" && "password" in body ? body.password : undefined;
  } catch (error) {
    const status = error instanceof RequestBodyError ? error.status : 400;
    return NextResponse.json({ message: "Invalid request" }, { status, headers: privateHeaders });
  }

  if (!isCorrectPassword(password)) {
    return NextResponse.json({ message: "Incorrect password" }, { status: 401, headers: privateHeaders });
  }

  const token = createAccessToken();
  if (!token) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500, headers: privateHeaders });
  }

  clearAttempts(client);
  const response = NextResponse.json({ success: true }, { status: 200, headers: privateHeaders });
  response.headers.set(
    "Set-Cookie",
    cookie.serialize(PAGE_ACCESS_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: PAGE_ACCESS_MAX_AGE,
      sameSite: "strict",
      path: "/",
    }),
  );
  return response;
}
