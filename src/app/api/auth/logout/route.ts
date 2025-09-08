import { NextResponse } from "next/server";

export async function GET() {
  // Better Auth manages sessions; clearing cookie for demo.
  const res = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  res.cookies.set("better-auth.sessionToken", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
