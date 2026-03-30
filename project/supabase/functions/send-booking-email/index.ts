import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BookingRequest {
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
  accompteAmount?: number;
  cautionAmount?: number;
  amountPaid?: number;
  checkoutSessionId?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload = (await req.json()) as Partial<BookingRequest> & {
      checkoutSessionId?: string;
    };

    const agentEmail = "marthedufour23@gmail.com";

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const emailFrom = Deno.env.get("EMAIL_FROM") ?? agentEmail;

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "RESEND_API_KEY manquante (à configurer côté Supabase Edge Functions).",
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          status: 500,
        }
      );
    }

    async function sendResendEmail(opts: {
      to: string;
      subject: string;
      html: string;
    }) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: emailFrom,
          to: opts.to,
          subject: opts.subject,
          html: opts.html,
        }),
      });

      if (!res.ok) {
        const err = await res.text().catch(() => "");
        throw new Error(`Erreur Resend: ${err || res.statusText}`);
      }
    }

    // Construction des infos à envoyer
    let bookingData = payload as BookingRequest;
    let checkoutSessionId = payload.checkoutSessionId ?? "";

    if (checkoutSessionId) {
      if (!stripeSecretKey) {
        return new Response(
          JSON.stringify({
            success: false,
            error:
              "STRIPE_SECRET_KEY manquante (à configurer côté Supabase Edge Functions).",
          }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
            status: 500,
          }
        );
      }

      const stripeRes = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(
          checkoutSessionId
        )}?expand[]=payment_intent`,
        {
          headers: {
            Authorization: `Bearer ${stripeSecretKey}`,
          },
        }
      );

      const stripeData = await stripeRes.json();
      if (!stripeRes.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            error:
              stripeData?.error?.message ||
              "Erreur Stripe lors de la récupération de la session.",
          }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
            status: 400,
          }
        );
      }

      if (stripeData?.payment_status !== "paid") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Paiement non confirmé par Stripe.",
          }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
            status: 400,
          }
        );
      }

      const md = stripeData?.metadata ?? {};

      bookingData = {
        propertyId: Number(md.propertyId),
        propertyTitle: String(md.propertyTitle ?? ""),
        checkInDate: String(md.checkInDate ?? ""),
        checkOutDate: String(md.checkOutDate ?? ""),
        nights: Number(md.nights ?? 0),
        guests: Number(md.guests ?? 0),
        totalPrice: Number(md.totalPrice ?? 0),
        guestName: String(md.guestName ?? ""),
        guestEmail: String(md.guestEmail ?? ""),
        guestPhone: String(md.guestPhone ?? ""),
        accompteAmount: Number(md.accompteAmount ?? 0),
        cautionAmount: Number(md.cautionAmount ?? 0),
        amountPaid: Number(md.accompteAmount ?? 0),
        checkoutSessionId,
      };
    } else {
      // Compatibilité: si l'app appelle encore avec un BookingRequest “brut”
      bookingData = {
        ...bookingData,
        amountPaid: bookingData.amountPaid ?? bookingData.accompteAmount ?? 0,
        checkoutSessionId: bookingData.checkoutSessionId ?? "",
      };
    }

    const checkInFormatted = new Date(bookingData.checkInDate).toLocaleDateString(
      "fr-FR"
    );
    const checkOutFormatted = new Date(bookingData.checkOutDate).toLocaleDateString(
      "fr-FR"
    );

    const accompteAmount = Number(bookingData.accompteAmount ?? 0);
    const cautionAmount = Number(bookingData.cautionAmount ?? 0);
    const amountPaid = Number(bookingData.amountPaid ?? accompteAmount);

    const agentEmailContent = `
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(to right, #2563eb, #06b6d4); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
      <h2 style="margin: 0;">Nouvelle Demande de Réservation</h2>
    </div>

    <div style="border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 8px 8px;">
      <h3 style="color: #2563eb; margin-top: 0;">Détails de la Propriété</h3>
      <p><strong>Propriété:</strong> ${bookingData.propertyTitle}</p>
      <p><strong>ID Propriété:</strong> ${bookingData.propertyId}</p>

      <h3 style="color: #2563eb;">Informations du Voyageur</h3>
      <p><strong>Nom:</strong> ${bookingData.guestName}</p>
      <p><strong>Email:</strong> ${bookingData.guestEmail}</p>
      <p><strong>Téléphone:</strong> ${bookingData.guestPhone}</p>
      <p><strong>Nombre de voyageurs:</strong> ${bookingData.guests}</p>

      <h3 style="color: #2563eb;">Dates de Réservation</h3>
      <p><strong>Arrivée:</strong> ${checkInFormatted}</p>
      <p><strong>Départ:</strong> ${checkOutFormatted}</p>
      <p><strong>Durée:</strong> ${bookingData.nights} nuit${bookingData.nights > 1 ? 's' : ''}</p>

      <h3 style="color: #2563eb;">Montant Estimé</h3>
      <p style="font-size: 24px; color: #06b6d4; font-weight: bold; margin: 10px 0;">${bookingData.totalPrice}€</p>

      <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin-top: 20px;">
        <p style="margin: 0; color: #333;"><strong>Accompte payé:</strong> ${amountPaid}€</p>
        <p style="margin: 8px 0 0; color: #333;"><strong>Caution à verser ultérieurement:</strong> ${cautionAmount}€</p>
        <p style="margin: 8px 0 0; color: #666;">Stripe session: ${checkoutSessionId}</p>
      </div>

      <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin-top: 20px;">
        <p style="margin: 0; color: #666;">Veuillez contacter le voyageur au plus tôt pour finaliser la réservation et le mettre en relation avec le propriétaire.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const guestEmailContent = `
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(to right, #2563eb, #06b6d4); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
      <h2 style="margin: 0;">Demande de Réservation Reçue</h2>
    </div>

    <div style="border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 8px 8px;">
      <p>Bonjour ${bookingData.guestName},</p>

      <p>Merci pour votre intérêt ! Nous avons reçu votre demande de réservation. Un agent immobilier vous contactera très bientôt pour finaliser les détails et vous mettre en relation directe avec le propriétaire.</p>

      <h3 style="color: #2563eb; margin-top: 20px;">Récapitulatif de votre Demande</h3>

      <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #2563eb; border-radius: 4px;">
        <p><strong>Propriété:</strong> ${bookingData.propertyTitle}</p>
        <p><strong>Arrivée:</strong> ${checkInFormatted}</p>
        <p><strong>Départ:</strong> ${checkOutFormatted}</p>
        <p><strong>Durée:</strong> ${bookingData.nights} nuit${bookingData.nights > 1 ? 's' : ''}</p>
        <p><strong>Nombre de voyageurs:</strong> ${bookingData.guests}</p>
        <p style="font-size: 18px; color: #06b6d4; font-weight: bold; margin-top: 15px;">Montant estimé: ${bookingData.totalPrice}€</p>
      </div>

      <h3 style="color: #2563eb; margin-top: 20px;">Prochaines Étapes</h3>
      <ol style="line-height: 1.8;">
        <li>Un agent immobilier vous contactera par email ou via WhatsApp/SMS</li>
        <li>Vous discuterez des détails finaux et confirmerez les dates</li>
        <li>Caution à verser ultérieurement: ${cautionAmount}€</li>
        <li>L'agent vous mettra en contact avec le propriétaire</li>
        <li>Vous pourrez organiser directement votre séjour</li>
      </ol>

      <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">Cordialement,<br><strong>L'équipe VacancesDream</strong></p>
    </div>
  </div>
</body>
</html>
    `;

    console.log("Demande de réservation reçue:", bookingData);
    console.log("Email agent:", agentEmail);
    console.log("Email client:", bookingData.guestEmail);

    await sendResendEmail({
      to: agentEmail,
      subject: "Nouvelle réservation - VacancesDream",
      html: agentEmailContent,
    });

    await sendResendEmail({
      to: bookingData.guestEmail,
      subject: "Votre demande de réservation - VacancesDream",
      html: guestEmailContent,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Emails envoyés avec succès",
        booking: {
          propertyId: bookingData.propertyId,
          propertyTitle: bookingData.propertyTitle,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          nights: bookingData.nights,
          guests: bookingData.guests,
          totalPrice: bookingData.totalPrice,
          accompteAmount,
          cautionAmount,
          amountPaid,
          paymentStatus: "paid",
          checkoutSessionId,
          guestName: bookingData.guestName,
          guestEmail: bookingData.guestEmail,
          guestPhone: bookingData.guestPhone,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erreur:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }
});
