"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthorsProvider } from "@/context/AuthorsContext";
import Navigation from "./Navigation";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthorsProvider>
        <Navigation />
        <main className="min-h-screen">{children}</main>
      </AuthorsProvider>
    </ThemeProvider>
  );
}
