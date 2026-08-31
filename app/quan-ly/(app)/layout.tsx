import type { ReactNode } from "react";
import { requireProfile } from "../auth";
import { AdminShell } from "../components/AdminShell";

export default async function ManagementLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireProfile();
  return <AdminShell profile={profile}>{children}</AdminShell>;
}
