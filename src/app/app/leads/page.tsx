"use client";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useUIStore } from "@/store/ui";
import { Badge } from "@/components/ui/badge";

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  campaignName: string;
  status: "pending"|"contacted"|"responded"|"converted";
  lastContactAt: string | null;
};

async function fetchLeads({ pageParam, queryKey }: any) {
  const [_k, params] = queryKey;
  const url = new URL("/api/leads", window.location.origin);
  if (pageParam) url.searchParams.set("cursor", pageParam);
  if (params.q) url.searchParams.set("q", params.q);
  if (params.status) url.searchParams.set("status", params.status);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to load leads");
  return res.json();
}

export default function LeadsPage() {
  const { q, status } = useUIStore(s => s.leadFilter);
  const setSelectedLeadId = useUIStore(s => s.setSelectedLeadId);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status: qStatus, refetch } = useInfiniteQuery({
    queryKey: ["leads", { q, status }],
    queryFn: fetchLeads,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined
  });

  useEffect(() => { refetch(); }, [q, status, refetch]);

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

  const pages = data?.pages ?? [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input className="input" placeholder="Search leads" onChange={(e)=>useUIStore.getState().setLeadFilter({ q: e.target.value })} />
        <select className="input max-w-[200px]" onChange={(e)=>useUIStore.getState().setLeadFilter({ status: e.target.value || null })}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="responded">Responded</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Email</th>
              <th>Company</th>
              <th>Campaign</th>
              <th>Status</th>
              <th>Last Contact</th>
            </tr>
          </thead>
          <tbody>
            {qStatus === "pending" && Array.from({length:8}).map((_,i)=> <tr key={i}><td colSpan={6}><div className="skeleton h-8 w-full" /></td></tr>)}
            {pages.map((p: any) => p.items.map((lead: Lead) => (
              <tr key={lead.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer" onClick={()=>setSelectedLeadId(lead.id)}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.company}</td>
                <td>{lead.campaignName}</td>
                <td>
                  <Badge tone={lead.status === "converted" ? "success" : lead.status === "pending" ? "muted" : "warning"}>{lead.status}</Badge>
                </td>
                <td>{lead.lastContactAt ? new Date(lead.lastContactAt).toLocaleDateString() : "—"}</td>
              </tr>
            )))}
          </tbody>
        </table>
        <div ref={sentinel} className="h-10" />
      </div>

      <LeadSheet />
    </div>
  );
}

function LeadSheet() {
  const id = useUIStore(s => s.selectedLeadId);
  useEffect(()=>{
    function onKey(e: KeyboardEvent){ if(e.key === "Escape") useUIStore.getState().setSelectedLeadId(null); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const close = () => useUIStore.getState().setSelectedLeadId(null);

  const [lead, setLead] = useState<any | null>(null);
  useEffect(()=>{
    if (!id) return;
    setLead(null);
    fetch(`/api/leads/${id}`).then(r=>r.json()).then(setLead);
  }, [id]);

  const [open, setOpen] = [Boolean(id), ()=>{}];
  if (!open || !id) return null;
  return (
    <div className="sheet" onClick={(e)=>{ if (e.currentTarget === e.target) close(); }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Lead Details</h3>
        <button onClick={close}>✕</button>
      </div>
      <div className="space-y-4">
        {!lead && <div className="skeleton h-24 w-full" />}
        {lead && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm opacity-70">Name</div>
              <div className="font-medium">{lead.name}</div>
            </div>
            <div>
              <div className="text-sm opacity-70">Email</div>
              <div>{lead.email}</div>
            </div>
            <div>
              <div className="text-sm opacity-70">Company</div>
              <div>{lead.company}</div>
            </div>
            <div>
              <div className="text-sm opacity-70">Status</div>
              <div><Badge tone={lead.status === "converted" ? "success" : lead.status === "pending" ? "muted" : "warning"}>{lead.status}</Badge></div>
            </div>
          </div>
        )}
        <form className="space-y-2" onSubmit={(e)=>{e.preventDefault(); fetch(`/api/leads/${id}`, { method:"PATCH", body: JSON.stringify({ status: (e.target as any).status.value }), headers:{ "Content-Type":"application/json" } }).then(()=>useUIStore.getState().setSelectedLeadId(null));}}>
          <label className="text-sm opacity-70">Update Status</label>
          <select name="status" className="input">
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="responded">Responded</option>
            <option value="converted">Converted</option>
          </select>
          <button className="btn btn-primary" type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}
