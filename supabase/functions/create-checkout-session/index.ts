import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!stripeKey || !supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing required environment variables.");
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Initialize Supabase client
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided.");

    // Extract JWT token
    const token = authHeader.replace("Bearer ", "");

    // Retrieve user from Supabase
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) throw new Error("User not found or authentication failed.");

    // Parse request body
    const { featureType, listingId, amount, packageId } = await req.json();
    amount*100;
    // console.log(amount, featureType, listingId, "Checking feature type");

    // Retrieve or create a Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId = customers.data[0]?.id;

    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;
    }

    let session;

    // Handle different payment feature types
    switch (featureType) {
      case "setup_intent":
        session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ["card"],
          mode: "setup",
          success_url: `${req.headers.get("origin")}/profile?setup=success`,
          cancel_url: `${req.headers.get("origin")}/profile`,
        });
        break;

      case "show_more_info":
        session = await stripe.checkout.sessions.create({
          customer: customerId,
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Additional Business Information",
                  description: "Access to detailed business metrics and information",
                },
                unit_amount: amount,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${req.headers.get("origin")}/browse?purchase=success`,
          cancel_url: `${req.headers.get("origin")}/browse`,
          metadata: {
            user_id: user.id,
            feature_type: featureType,
            listing_id: listingId,
          },
        });
        break;

      case "due_diligence":
        session = await stripe.checkout.sessions.create({
          customer: customerId,
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Due Diligence Package",
                  description: "Comprehensive analysis of business listings",
                },
                unit_amount: amount,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${req.headers.get("origin")}/packages?purchase=success`,
          cancel_url: `${req.headers.get("origin")}/packages`,
          metadata: {
            user_id: user.id,
            feature_type: featureType,
            package_id: packageId,
          },
        });
        break;

      default:
        throw new Error("Invalid feature type.");
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in checkout process:", error);
    return new Response(
      JSON.stringify({ error: error.message, details: "Please check your request parameters." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
