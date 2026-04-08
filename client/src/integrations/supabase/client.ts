import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Asegúrate de que estas variables de entorno estén disponibles en tu entorno de cliente.
// En un proyecto React/Vite, suelen ser accesibles a través de import.meta.env o process.env
// y deben comenzar con VITE_ o NEXT_PUBLIC_ para ser expuestas al cliente.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        "Error: Las variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY deben estar definidas para el cliente."
    );
    throw new Error("Faltan las variables de entorno de Supabase para el cliente.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
