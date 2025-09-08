import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIX = "/app";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const isProtected = url.pathname.startsWith(PROTECTED_PREFIX);
  const session = req.cookies.get("better-auth.sessionToken")?.value;
  if (isProtected && !session) {
    const login = new URL("/login", req.url);
    login.searchParams.set("next", url.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"]
};
