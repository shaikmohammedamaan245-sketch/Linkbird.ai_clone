"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { useUIStore } from "@/store/ui";

type Campaign = {
  id: string;
  name: string;
  status: "draft"|"active"|"paused"|"completed";
  totalLeads: number;
  successLeads: number;
  responseRate: number;
  createdAt: string;
};

async function fetchCampaigns({ pageParam }: any) {
  const url = new URL("/api/campaigns", window.location.origin);
  if (pageParam) url.searchParams.set("cursor", pageParam);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export default function CampaignsPage() {
  const setSelectedCampaignId = useUIStore(s => s.setSelectedCampaignId);
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["campaigns"],
    queryFn: fetchCampaigns,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined
  });
  const sentinel = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage(); });
    });
    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select className="input max-w-[200px]" onChange={(e)=>{/* filter client-side for demo */}}>
          <option>All statuses</option>
          <option>Draft</option>
          <option>Active</option>
          <option>Paused</option>
          <option>Completed</option>
        </select>
      </div>
      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Total Leads</th>
              <th>Successful</th>
              <th>Response Rate</th>
              <th>Progress</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {status === "pending" && Array.from({length:6}).map((_,i)=>(<tr key={i}><td colSpan={8}><div className="skeleton h-8 w-full" /></td></tr>))}
            {data?.pages?.flatMap((p: any) => p.items)?.map((c: Campaign) => (
              <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer" onClick={()=>setSelectedCampaignId(c.id)}>
                <td>{c.name}</td>
                <td><Badge tone={c.status === "active" ? "success" : c.status === "paused" ? "warning" : "muted"}>{c.status}</Badge></td>
                <td>{c.totalLeads}</td>
                <td>{c.successLeads}</td>
                <td>{Math.round(c.responseRate)}%</td>
                <td><Progress value={Math.round((c.successLeads / Math.max(1, c.totalLeads)) * 100)} /></td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="space-x-2">
                  <button className="btn">Edit</button>
                  <button className="btn">Pause/Resume</button>
                  <button className="btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div ref={sentinel} className="h-10" />
      </div>
      <CampaignSheet />
    </div>
  );
}

function CampaignSheet() {
  const id = useUIStore(s => s.selectedCampaignId);
  const close = () => useUIStore.getState().setSelectedCampaignId(null);
  const [data, setData] = useState<any | null>(null);
  useEffect(() => {
    if (!id) return;
    setData(null);
    fetch(`/api/campaigns/${id}`).then(r=>r.json()).then(setData);
  }, [id]);
  if (!id) return null;
  return (
    <div className="sheet" onClick={(e)=>{ if (e.currentTarget === e.target) close(); }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Campaign Details</h3>
        <button onClick={close}>✕</button>
      </div>
      {!data && <div className="skeleton h-24 w-full" />}
      {data && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm opacity-70">Name</div>
              <div className="font-medium">{data.name}</div>
            </div>
            <div>
              <div className="text-sm opacity-70">Status</div>
              <div><Badge tone={data.status === "active" ? "success" : data.status === "paused" ? "warning" : "muted"}>{data.status}</Badge></div>
            </div>
            <div>
              <div className="text-sm opacity-70">Created</div>
              <div>{new Date(data.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <div>
            <div className="text-sm opacity-70 mb-2">Metrics</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="card p-3">
                <div className="text-xs opacity-60">Total Leads</div>
                <div className="text-lg font-semibold">{data.metrics.totalLeads}</div>
              </div>
              <div className="card p-3">
                <div className="text-xs opacity-60">Successful</div>
                <div className="text-lg font-semibold">{data.metrics.successLeads}</div>
              </div>
              <div className="card p-3">
                <div className="text-xs opacity-60">Response Rate</div>
                <div className="text-lg font-semibold">{Math.round(data.metrics.responseRate)}%</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm opacity-70 mb-2">Recent Leads</div>
            <div className="card overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leads.map((l: any) => (
                    <tr key={l.id}>
                      <td>{l.name}</td>
                      <td>{l.email}</td>
                      <td><Badge tone={l.status === "converted" ? "success" : l.status === "pending" ? "muted" : "warning"}>{l.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
