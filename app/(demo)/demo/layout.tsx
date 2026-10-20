import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { PrototypeProvider } from "@/components/prototype-provider";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <PrototypeProvider>
      <AppShell mode="demo">{children}</AppShell>
    </PrototypeProvider>
  );
}
