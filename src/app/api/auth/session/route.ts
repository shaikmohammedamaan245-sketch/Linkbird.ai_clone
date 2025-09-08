import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Demo/session cookie based; avoids server-side Better Auth import in environments without config
  const cookie = req.cookies.get("better-auth.sessionToken")?.value;
  const authenticated = Boolean(cookie);
  return NextResponse.json({ authenticated });
}


