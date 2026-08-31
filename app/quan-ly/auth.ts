import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import type { Profile } from "./types";

export async function requireProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/quan-ly/dang-nhap");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) redirect("/quan-ly/dang-nhap?error=inactive");

  return { user, profile: profile as Profile };
}
