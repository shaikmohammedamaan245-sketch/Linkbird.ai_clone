import { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const { className, variant = "primary", ...rest } = props;
  return <button className={clsx("btn", variant === "primary" ? "btn-primary" : "border", className)} {...rest} />;
}
