export default function Dashboard() {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div className="card p-4"><div className="text-sm opacity-70">Total Campaigns</div><div className="text-2xl font-semibold">—</div></div>
    <div className="card p-4"><div className="text-sm opacity-70">Total Leads</div><div className="text-2xl font-semibold">—</div></div>
    <div className="card p-4"><div className="text-sm opacity-70">Response Rate</div><div className="text-2xl font-semibold">—</div></div>
    <div className="card p-4"><div className="text-sm opacity-70">Converted</div><div className="text-2xl font-semibold">—</div></div>
  </div>;
}
