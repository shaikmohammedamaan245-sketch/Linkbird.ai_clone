import { db } from "@/db/client";
import { campaigns, leads } from "@/db/schema";

export async function seed() {
  const cs = await db.insert(campaigns).values([
    { name: "Outreach – SaaS CTOs", status: "active" },
    { name: "Cold Inbound – EU Startups", status: "paused" },
    { name: "Newsletter Partnerships", status: "draft" }
  ]).returning();

  const sampleLeads = Array.from({length: 120}).map((_,i)=> ({
    name: `Lead ${i+1}`,
    email: `lead${i+1}@example.com`,
    company: `Company ${Math.ceil(Math.random()*50)}`,
    campaignId: cs[i % cs.length].id,
    status: (["pending","contacted","responded","converted"] as const)[Math.floor(Math.random()*4)],
    lastContactAt: new Date(Date.now() - Math.random()*1000*60*60*24*30),
    interactionCount: Math.floor(Math.random()*6)
  }));
  await db.insert(leads).values(sampleLeads);
  console.log("Seeded.");
}
