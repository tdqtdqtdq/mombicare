import { requireProfile } from "../auth";
import { DashboardClient } from "./DashboardClient";

export default async function ManagementDashboardPage() {
  const { profile } = await requireProfile();
  return <DashboardClient profile={profile} />;
}
