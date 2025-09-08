"use client";
import Link from "next/link";
import { useUIStore } from "@/store/ui";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/leads", label: "Leads" },
  { href: "/app/campaigns", label: "Campaigns" },
  { href: "/app/settings", label: "Settings" }
];

export function AppShell({ children, title }: { children: React.ReactNode; title?: string }) {
  const collapsed = useUIStore(s => s.sidebarCollapsed);
  const toggle = useUIStore(s => s.toggleSidebar);
  const pathname = usePathname();
  const openAuth = useUIStore(s => s.openAuth);
  const closeAuth = useUIStore(s => s.closeAuth);
  const authOpen = useUIStore(s => s.authOpen);
  const [session, setSession] = useState<{ authenticated: boolean; email?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/session").then(r=>r.json()).then(setSession).catch(()=>setSession({ authenticated: false }));
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-[auto_1fr]">
      <aside className={`h-screen sticky top-0 p-3 border-r border-neutral-200 dark:border-neutral-800 ${collapsed ? "w-16" : "w-64"} transition-all`}>
        <div className="flex items-center justify-between mb-6">
          <Link href="/app/dashboard" className="font-bold text-brand-600">Linkbird.ai</Link>
          <button onClick={toggle} className="text-sm opacity-60">≡</button>
        </div>
        <nav className="space-y-1">
          {NAV.map(item => {
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`block rounded-xl px-3 py-2 ${active ? "bg-brand-50 dark:bg-neutral-800 text-brand-700" : "hover:bg-neutral-100 dark:hover:bg-neutral-900"}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-6 text-sm opacity-70">
          {session?.authenticated ? (
            <div className="flex items-center justify-between">
              <span className="truncate max-w-[140px]">{session.email || "Signed in"}</span>
              <a className="underline" href="/api/auth/logout">Logout</a>
            </div>
          ) : (
            <button className="underline" onClick={openAuth}>Sign in</button>
          )}
        </div>
      </aside>
      <main>
        <header className="container-px py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-xl font-semibold">{title}</h1>
        </header>
        <div className="container-px py-6">{children}</div>
      </main>
    </div>
  );
}
