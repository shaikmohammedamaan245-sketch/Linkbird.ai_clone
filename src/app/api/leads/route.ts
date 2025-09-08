import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { leads, campaigns } from "@/db/schema";
import { and, desc, ilike, eq, lt, or, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status");

  const PAGE = 20;

  // Demo fallback without DATABASE_URL: serve mock data
  if (!process.env.DATABASE_URL) {
    const all = Array.from({ length: 120 }).map((_, i) => ({
      id: `mock-${i + 1}`,
      name: `Lead ${i + 1}`,
      email: `lead${i + 1}@example.com`,
      company: `Company ${((i % 10) + 1)}`,
      campaignName: `Campaign ${((i % 5) + 1)}`,
      status: (['pending','contacted','responded','converted'] as const)[i % 4],
      lastContactAt: new Date(Date.now() - i * 86400000).toISOString()
    }));
    const filtered = all.filter(l =>
      (!q || l.name.toLowerCase().includes(q.toLowerCase())) &&
      (!status || l.status === status)
    );
    const offset = cursor ? parseInt(Buffer.from(cursor, 'base64').toString('utf8')) : 0;
    const items = filtered.slice(offset, offset + PAGE);
    const nextOffset = offset + PAGE < filtered.length ? offset + PAGE : null;
    const nextCursor = nextOffset !== null ? Buffer.from(String(nextOffset), 'utf8').toString('base64') : null;
    return NextResponse.json({ items, nextCursor });
  }

  // Decode cursor: base64(JSON.stringify({ lastContactAt: string | null, id: string }))
  let cursorData: { lastContactAt: string | null; id: string } | null = null;
  if (cursor) {
    try {
      const raw = Buffer.from(cursor, "base64").toString("utf8");
      const parsed = JSON.parse(raw);
      if (parsed && "id" in parsed) cursorData = parsed;
    } catch {}
  }

  // Base filters
  const baseWhere = and(
    q ? ilike(leads.name, `%${q}%`) : undefined,
    status ? eq(leads.status, status as any) : undefined
  );

  // Keyset pagination condition for next page (ordered by lastContactAt desc, id desc)
  const paginationWhere = cursorData
    ? or(
        // If current row lastContactAt is less than cursor lastContactAt (we are descending)
        cursorData.lastContactAt
          ? lt(leads.lastContactAt, new Date(cursorData.lastContactAt) as unknown as any)
          : // If cursor lastContactAt is null, only rows with non-null come first. Nothing is strictly less than null, so use not null guard.
            sql`${leads.lastContactAt} IS NOT NULL`,
        // Or equal timestamp and id is less (since id is also descending)
        and(
          cursorData.lastContactAt
            ? eq(leads.lastContactAt, new Date(cursorData.lastContactAt) as unknown as any)
            : sql`${leads.lastContactAt} IS NULL`,
          lt(leads.id, cursorData.id as unknown as any)
        )
      )
    : undefined;

  const items = await db.select({
    id: leads.id,
    name: leads.name,
    email: leads.email,
    company: leads.company,
    campaignName: campaigns.name,
    status: leads.status,
    lastContactAt: leads.lastContactAt
  })
  .from(leads)
  .leftJoin(campaigns, eq(leads.campaignId, campaigns.id))
  .where(and(baseWhere, paginationWhere))
  .orderBy(desc(leads.lastContactAt), desc(leads.id))
  .limit(PAGE);

  // Build next cursor from the last item if we filled the page
  const last = items.length === PAGE ? items[items.length - 1] : null;
  const nextCursor = last
    ? Buffer.from(
        JSON.stringify({ lastContactAt: last.lastContactAt, id: last.id }),
        "utf8"
      ).toString("base64")
    : null;

  return NextResponse.json({ items, nextCursor });
}
