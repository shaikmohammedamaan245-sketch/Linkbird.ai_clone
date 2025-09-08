import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const email = form.get("email")?.toString() || "";
  if (!email) return new NextResponse("Bad request", { status: 400 });
  // here you would create the user via better-auth + drizzle adapter
  const res = NextResponse.redirect(new URL("/app/dashboard", req.url));
  res.cookies.set("better-auth.sessionToken", "dev", { httpOnly: true, path: "/" });
  return res;
}

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/app/dashboard", req.url));
  res.cookies.set("better-auth.sessionToken", "dev", { httpOnly: true, path: "/" });
  return res;
}
