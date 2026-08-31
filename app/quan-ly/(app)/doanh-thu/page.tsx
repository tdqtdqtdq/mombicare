import { requireProfile } from "../../auth";
import { RevenueManager } from "./RevenueManager";

export default async function RevenuePage() {
  const { profile } = await requireProfile();
  return <RevenueManager profile={profile} />;
}
