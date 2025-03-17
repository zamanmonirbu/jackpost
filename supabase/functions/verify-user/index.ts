import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, dob, address } = await req.json();
    const ONFIDO_API_KEY = Deno.env.get("ONFIDO_API_KEY");

    if (!ONFIDO_API_KEY) {
      throw new Error("Missing Onfido API key");
    }

    console.log("Creating Onfido applicant...");

    // Step 1: Create an applicant in Onfido
    const applicantResponse = await fetch("https://api.onfido.com/v3.6/applicants", {
      method: "POST",
      headers: {
        Authorization: `Token token=${ONFIDO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        dob,
        address,
      }),
    });

    const applicantData = await applicantResponse.json();
    if (!applicantResponse.ok) throw new Error(applicantData.error || "Failed to create applicant");

    console.log("Applicant created:", applicantData);

    // Step 2: Create a check (verification process)
    const checkResponse = await fetch("https://api.onfido.com/v3.6/checks", {
      method: "POST",
      headers: {
        Authorization: `Token token=${ONFIDO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicant_id: applicantData.id,
        report_names: ["identity"],
      }),
    });

    const checkData = await checkResponse.json();
    if (!checkResponse.ok) throw new Error(checkData.error || "Failed to create check");

    console.log("Verification check created:", checkData);

    // Step 3: Store verification result in Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error: integrationError } = await supabase
      .from("user_verifications")
      .insert({
        user_id: applicantData.id,
        verification_type: "onfido",
        status: checkData.status,
        metadata: checkData,
        verified_at: new Date().toISOString(),
      });

    if (integrationError) {
      console.error("Error storing verification result:", integrationError);
      throw integrationError;
    }

    return new Response(JSON.stringify({ success: true, data: checkData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Onfido verification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
