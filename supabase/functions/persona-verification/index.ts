import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PERSONA_API_KEY = Deno.env.get("PERSONA_API_KEY");
    const PERSONA_TEMPLATE_ID = Deno.env.get("PERSONA_TEMPLATE_ID");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

    if (!PERSONA_API_KEY || !PERSONA_TEMPLATE_ID || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Validate Authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("User not found or authentication failed");
    }

    // Create Persona verification session
    const response = await fetch("https://withpersona.com/api/v1/inquiries", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERSONA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        templateId: PERSONA_TEMPLATE_ID,
        referenceId: user.id, // Associate with user ID
      }),
    });

    const data = await response.json();

    if (!data?.data?.id || !data?.data?.attributes?.inquiryUrl) {
      throw new Error("Failed to create Persona inquiry");
    }

    return new Response(
      JSON.stringify({
        inquiryId: data.data.id,
        inquiryUrl: data.data.attributes.inquiryUrl,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("Error in persona-verification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
