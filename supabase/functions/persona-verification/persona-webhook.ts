import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const { data } = await req.json();

    if (!data || !data.id || !data.attributes) {
      return new Response(JSON.stringify({ error: "Invalid request payload" }), { status: 400 });
    }

    const { id, attributes } = data;
    const { status, referenceId } = attributes; // `referenceId` is useful for linking users

    // Ensure Supabase environment variables are set
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    // Initialize Supabase client
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Update verification status in the database
    const { error } = await supabaseClient
      .from("profile")
      .update({ status })
      .eq("inquiry_id", id);

    if (error) {
      throw new Error(`Failed to update verification status: ${error.message}`);
    }

    return new Response(JSON.stringify({ message: "Verification updated successfully" }), {
      status: 200,
    });

  } catch (error) {
    console.error("Error processing Persona webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
