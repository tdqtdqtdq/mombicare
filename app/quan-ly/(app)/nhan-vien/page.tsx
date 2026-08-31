import { redirect } from "next/navigation";
import { requireProfile } from "../../auth";
import { EmployeesManager } from "./EmployeesManager";

export default async function EmployeesPage() {
  const { profile } = await requireProfile();
  if (profile.role !== "owner") redirect("/quan-ly");
  return <EmployeesManager />;
}
