import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // In a real app, call better-auth signIn with credentials, then set cookies.
  // This is a placeholder so the UI is functional.
  const form = await req.formData();
  const email = form.get("email")?.toString() || "";
  if (!email) return new NextResponse("Bad request", { status: 400 });
  const res = NextResponse.redirect(new URL("/app/dashboard", req.url));
  res.cookies.set("better-auth.sessionToken", "dev", { httpOnly: true, path: "/" });
  return res;
}

export async function GET(req: NextRequest) {
  // Allow GET for link-based submits
  const res = NextResponse.redirect(new URL("/app/dashboard", req.url));
  res.cookies.set("better-auth.sessionToken", "dev", { httpOnly: true, path: "/" });
  return res;
}
