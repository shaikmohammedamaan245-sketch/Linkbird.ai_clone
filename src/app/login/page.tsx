"use client";
import { useEffect } from "react";
import { useUIStore } from "@/store/ui";

export default function LoginPage() {
  const openAuth = useUIStore(s => s.openAuth);
  useEffect(() => {
    openAuth();
  }, [openAuth]);
  return null;
}
