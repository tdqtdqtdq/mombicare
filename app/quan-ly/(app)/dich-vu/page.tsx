import { redirect } from "next/navigation";
import { requireProfile } from "../../auth";
import { ServicesManager } from "./ServicesManager";

export default async function ServicesPage() {
  const { profile } = await requireProfile();
  if (profile.role !== "owner") redirect("/quan-ly");
  return <ServicesManager />;
}
