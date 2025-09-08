"use client";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider(props: any) {
  return <NextThemeProvider {...props} />;
}
