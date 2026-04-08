import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Supabase Connection", () => {
  it("should connect to Supabase with valid credentials", async () => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    expect(supabaseUrl).toBeDefined();
    expect(supabaseKey).toBeDefined();

    const client = createClient(supabaseUrl!, supabaseKey!);
    
    // Test basic connectivity by fetching auth state
    const { data, error } = await client.auth.getSession();
    
    // If we got here without throwing, the credentials are valid
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
