import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ authenticated: false });
    return NextResponse.json({ authenticated: true, email: session.user?.email });
  } catch {
    const cookie = req.cookies.get("better-auth.sessionToken")?.value;
    const authenticated = Boolean(cookie);
    return NextResponse.json({ authenticated });
  }
}


