import { NextResponse } from "next/server";

export async function POST() {
  // For local demo, fake success and set a cookie.
  const res = NextResponse.redirect(new URL("/app/dashboard", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  res.cookies.set("better-auth.sessionToken", "dev", { httpOnly: true, path: "/" });
  return res;
}

export async function GET() {
  // Support GET to allow redirect-based flows if needed
  const res = NextResponse.redirect(new URL("/app/dashboard", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  res.cookies.set("better-auth.sessionToken", "dev", { httpOnly: true, path: "/" });
  return res;
}
