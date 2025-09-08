import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { campaigns, leads } from "@/db/schema";
import { desc, eq, lt } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const PAGE = 20;

  let cursorData: { createdAt: string; id: string } | null = null;
  if (cursor) {
    try {
      cursorData = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
    } catch {}
  }

  const rows = await db
    .select()
    .from(campaigns)
    .where(
      cursorData
        ? lt(campaigns.createdAt, new Date(cursorData.createdAt) as unknown as any)
        : undefined
    )
    .orderBy(desc(campaigns.createdAt), desc(campaigns.id))
    .limit(PAGE);

  const items = await Promise.all(rows.map(async (c) => {
    const ls = await db.select().from(leads).where(eq(leads.campaignId, c.id));
    const totalLeads = ls.length;
    const successLeads = ls.filter(l => l.status === "converted").length;
    const responded = ls.filter(l => l.status === "responded" || l.status === "converted").length;
    const responseRate = totalLeads ? (responded / totalLeads) * 100 : 0;
    return {
      id: c.id,
      name: c.name,
      status: c.status,
      totalLeads,
      successLeads,
      responseRate,
      createdAt: c.createdAt
    };
  }));
  const last = items.length === PAGE ? items[items.length - 1] : null;
  const nextCursor = last
    ? Buffer.from(
        JSON.stringify({ createdAt: last.createdAt, id: last.id }),
        "utf8"
      ).toString("base64")
    : null;
  return NextResponse.json({ items, nextCursor });
}
