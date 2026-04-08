import { supabase } from "@/integrations/supabase/client";

export async function logAudit(
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("audit_logs").insert({
      user_id: user.id,
      user_email: user.email || "",
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      metadata: metadata || {},
    } as any);
  } catch {
    // Silent fail - audit should never break app flow
  }
}

export async function trackActivity(action: string = "page_view") {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("user_activity").insert({
      user_id: user.id,
      user_email: user.email || "",
      action,
    } as any);
  } catch {
    // Silent fail
  }
}
