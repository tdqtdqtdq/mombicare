import { requireProfile } from "../../auth";
import { CommissionReport } from "./CommissionReport";

export default async function CommissionPage() {
  const { profile } = await requireProfile();
  return <CommissionReport profile={profile} />;
}
