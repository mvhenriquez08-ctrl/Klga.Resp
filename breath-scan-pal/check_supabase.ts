import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkExtension() {
  console.log("Checking for 'vector' extension...");
  try {
    // Query pg_extension if possible (usually not via REST)
    const { data, error } = await supabase
      .from("pg_extension")
      .select("*")
      .eq("extname", "vector");

    if (error) {
      console.log("Could not query 'pg_extension' directly. This is expected.");
      console.log("Error details:", error.message);
    } else {
      console.log("Vector extension query result:", data);
      return;
    }

    // Try a common RPC if it exists
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "check_extension",
      { name: "vector" }
    );
    if (rpcError) {
      console.log("No 'check_extension' RPC found.");
    } else {
      console.log("RPC result:", rpcData);
    }
  } catch (e) {
    console.error("Unexpected error:", e);
  }
}

checkExtension();
