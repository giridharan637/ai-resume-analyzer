import { DashboardShell } from "@/components/resume/DashboardShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
