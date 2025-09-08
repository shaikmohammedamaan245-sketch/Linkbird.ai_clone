import { ReactNode } from "react";
import { clsx } from "clsx";

export function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: "success" | "warning" | "muted" }) {
  return <span className={clsx("badge", tone === "success" && "badge-success", tone === "warning" && "badge-warning", tone === "muted" && "badge-muted")}>{children}</span>;
}
