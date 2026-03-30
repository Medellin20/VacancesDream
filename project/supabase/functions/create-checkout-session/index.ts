import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CheckoutRequest {
  propertyId: number;
  propertyTitle: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  totalPrice: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  accompteAmount: number;
  cautionAmount: number;
}

function getOriginFromHeaders(req: Request): string {
  const origin = req.headers.get("origin");
  if (origin) return origin;

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      // ignore
    }
  }

  return "http://localhost:5173";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = (await req.json()) as CheckoutRequest;

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "STRIPE_SECRET_KEY manquante (à configurer côté Supabase Edge Functions).",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const siteOrigin = getOriginFromHeaders(req);

    const amountCents = Math.round(body.accompteAmount * 100);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Montant d'acompte invalide.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const successUrl = `${siteOrigin}/paiement/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${siteOrigin}/property/${body.propertyId}`;

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("payment_method_types[0]", "card");
    params.set("customer_email", body.guestEmail);
    params.set("success_url", successUrl);
    params.set("cancel_url", cancelUrl);

    params.set("line_items[0][quantity]", "1");
    params.set("line_items[0][price_data][currency]", "eur");
    params.set(
      "line_items[0][price_data][unit_amount]",
      String(amountCents)
    );
    params.set(
      "line_items[0][price_data][product_data][name]",
      `Acompte réservation - ${body.propertyTitle}`
    );

    params.set("metadata[propertyId]", String(body.propertyId));
    params.set("metadata[propertyTitle]", body.propertyTitle);
    params.set("metadata[checkInDate]", body.checkInDate);
    params.set("metadata[checkOutDate]", body.checkOutDate);
    params.set("metadata[nights]", String(body.nights));
    params.set("metadata[guests]", String(body.guests));
    params.set("metadata[totalPrice]", String(body.totalPrice));
    params.set("metadata[guestName]", body.guestName);
    params.set("metadata[guestEmail]", body.guestEmail);
    params.set("metadata[guestPhone]", body.guestPhone);
    params.set("metadata[accompteAmount]", String(body.accompteAmount));
    params.set("metadata[cautionAmount]", String(body.cautionAmount));

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const stripeData = await stripeRes.json();

    if (!stripeRes.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: stripeData?.error?.message || "Erreur Stripe",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        url: stripeData.url,
        sessionId: stripeData.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

