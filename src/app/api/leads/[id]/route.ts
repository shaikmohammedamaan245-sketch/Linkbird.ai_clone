import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const [item] = await db.select().from(leads).where(eq(leads.id, params.id)).limit(1);
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const [item] = await db.update(leads).set({ status: body.status }).where(eq(leads.id, params.id)).returning();
  return NextResponse.json(item);
}
