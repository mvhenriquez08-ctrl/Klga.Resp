import { createClient } from "@supabase/supabase-js";

// Credenciales de Supabase (reemplazar en el archivo .env)
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://cimaupjnzpvhysicyowd.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_VlWvuzbR1MlZEFZzlXROVQ_QDAxBmro";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
