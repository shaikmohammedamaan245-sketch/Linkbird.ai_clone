import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { campaigns, leads } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const [c] = await db.select().from(campaigns).where(eq(campaigns.id, params.id)).limit(1);
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


