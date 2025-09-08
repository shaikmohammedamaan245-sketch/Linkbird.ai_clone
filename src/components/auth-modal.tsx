"use client";
import React from "react";
import { useUIStore } from "@/store/ui";

export function AuthModal() {
  const open = useUIStore(s => s.authOpen);
  const close = useUIStore(s => s.closeAuth);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-50" onClick={(e)=>{ if(e.currentTarget === e.target) close(); }}>
      <div className="card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Sign in</h2>
          <button onClick={close}>✕</button>
        </div>
        <form className="space-y-3" action="/api/auth/login" method="post">
          <input name="email" type="email" placeholder="Email" required className="input" />
          <input name="password" type="password" placeholder="Password" required className="input" />
          <button type="submit" className="btn btn-primary w-full">Continue</button>
        </form>
        <div className="my-3 text-center opacity-70 text-sm">or</div>
        <form action="/api/auth/google" method="post">
          <button type="submit" className="btn w-full">Continue with Google</button>
        </form>
      </div>
    </div>
  );
}


