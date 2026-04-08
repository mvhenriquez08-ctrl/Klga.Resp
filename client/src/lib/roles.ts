import { supabase } from "@/integrations/supabase/client";

export type AppRole =
  | "owner"
  | "admin"
  | "medico"
  | "kinesiologo"
  | "enfermeria"
  | "supervisor"
  | "lector";

export async function getUserRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error || !data) return [];
  return data.map((r: any) => r.role as AppRole);
}

export async function isOwner(userId: string): Promise<boolean> {
  const roles = await getUserRoles(userId);
  return roles.includes("owner");
}

export async function hasAnyRole(
  userId: string,
  roles: AppRole[]
): Promise<boolean> {
  const userRoles = await getUserRoles(userId);
  return roles.some(r => userRoles.includes(r));
}
