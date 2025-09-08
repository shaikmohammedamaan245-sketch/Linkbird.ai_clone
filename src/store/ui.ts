"use client";
import { create } from "zustand";

type UIState = {
  sidebarCollapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
  leadFilter: { q: string; status: string | null; };
  setLeadFilter: (u: Partial<UIState['leadFilter']>) => void;
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string | null) => void;
  authOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  setCollapsed: (v) => set({ sidebarCollapsed: v }),
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  leadFilter: { q: "", status: null },
  setLeadFilter: (u) => set(s => ({ leadFilter: { ...s.leadFilter, ...u } })),
  selectedLeadId: null,
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),
  selectedCampaignId: null,
  setSelectedCampaignId: (id) => set({ selectedCampaignId: id }),
  authOpen: false,
  openAuth: () => set({ authOpen: true }),
  closeAuth: () => set({ authOpen: false })
}));
