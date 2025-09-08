import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { campaigns, leads } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, ctx: any) {
  const params = ctx?.params as { id?: string };
  const idParam = params?.id as string;
  if (!process.env.DATABASE_URL) {
    const i = Number((idParam || '').split('-').pop() || 1) || 1;
    return NextResponse.json({
      id: idParam,
      name: `Campaign ${i}`,
      status: (['draft','active','paused','completed'] as const)[i % 4],
      createdAt: new Date(Date.now() - i * 172800000).toISOString(),
      metrics: { totalLeads: 100 + i * 3, successLeads: 20 + (i % 30), responseRate: 10 + (i % 50) },
      leads: Array.from({ length: 10 }).map((_,j)=>({ id: `mock-${i}-${j}`, name: `Lead ${j+1}`, email: `lead${j+1}@example.com`, status: (['pending','contacted','responded','converted'] as const)[j%4] }))
    });
  }
  const [c] = await db.select().from(campaigns).where(eq(campaigns.id, idParam)).limit(1);
  if (!c) return new NextResponse("Not found", { status: 404 });
  const ls = await db.select().from(leads).where(eq(leads.campaignId, c.id));
  const totalLeads = ls.length;
  const successLeads = ls.filter(l => l.status === "converted").length;
  const responded = ls.filter(l => l.status === "responded" || l.status === "converted").length;
  const responseRate = totalLeads ? (responded / totalLeads) * 100 : 0;
  return NextResponse.json({
    id: c.id,
    name: c.name,
    status: c.status,
    createdAt: c.createdAt,
    metrics: { totalLeads, successLeads, responseRate },
    leads: ls.slice(0, 20).map(l => ({ id: l.id, name: l.name, email: l.email, status: l.status }))
  });
}


