import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, ctx: any) {
  const id = (ctx?.params?.id as string) || "";
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      id,
      name: `Lead ${id.split('-').pop() || 1}`,
      email: `lead${id.split('-').pop() || 1}@example.com`,
      company: `Company ${(Number(id.split('-').pop() || 1) % 10) + 1}`,
      campaignId: `cmp-${(Number(id.split('-').pop() || 1) % 5) + 1}`,
      status: ['pending','contacted','responded','converted'][Number(id.split('-').pop() || 0) % 4],
      lastContactAt: new Date().toISOString()
    });
  }
  const [item] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return NextResponse.json(item);
}

export async function PATCH(req: Request, ctx: any) {
  const id = (ctx?.params?.id as string) || "";
  if (!process.env.DATABASE_URL) {
    const body = await req.json();
    return NextResponse.json({ id, status: body?.status ?? 'pending' });
  }
  const body = await req.json();
  const [item] = await db.update(leads).set({ status: body.status }).where(eq(leads.id, id)).returning();
  return NextResponse.json(item);
}
