import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO || EMAIL_USER;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error('Missing EMAIL_USER or EMAIL_PASS in environment variables.');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

app.use(cors());
app.use(express.json());

app.post('/api/send-booking', async (req, res) => {
  const {
    propertyId,
    propertyTitle,
    propertyPrice,
    propertyType,
    checkInDate,
    checkOutDate,
    nights,
    guests,
    totalPrice,
    accompteAmount,
    cautionAmount,
    guestName,
    guestEmail,
    guestPhone,
  } = req.body;

  if (!propertyTitle || !guestName || !guestEmail || !guestPhone || !checkInDate || !checkOutDate) {
    return res.status(400).json({ error: 'Informations de réservation manquantes.' });
  }

  const subject = `Nouvelle réservation VacancesDream — ${propertyTitle}`;
  const html = `
    <h1>Nouvelle réservation VacancesDream</h1>
    <p>Une nouvelle réservation a été effectuée pour la propriété <strong>${propertyTitle}</strong>.</p>
    <h2>Détails de la réservation</h2>
    <ul>
      <li><strong>ID de la propriété :</strong> ${propertyId}</li>
      <li><strong>Type :</strong> ${propertyType}</li>
      <li><strong>Prix par nuit :</strong> ${propertyPrice}€</li>
      <li><strong>Dates :</strong> ${checkInDate} → ${checkOutDate}</li>
      <li><strong>Nombre de nuits :</strong> ${nights}</li>
      <li><strong>Voyageurs :</strong> ${guests}</li>
      <li><strong>Total estimé :</strong> ${totalPrice}€</li>
      <li><strong>Acompte :</strong> ${accompteAmount}€</li>
      <li><strong>Caution :</strong> ${cautionAmount}€</li>
    </ul>
    <h2>Informations du client</h2>
    <ul>
      <li><strong>Nom :</strong> ${guestName}</li>
      <li><strong>Email :</strong> ${guestEmail}</li>
      <li><strong>Téléphone :</strong> ${guestPhone}</li>
    </ul>
  `;

  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_TO,
      subject,
      text: `Nouvelle réservation pour ${propertyTitle} (${checkInDate} → ${checkOutDate})`,
      html,
      replyTo: guestEmail,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return res.status(500).json({ error: 'Impossible d\'envoyer l\'email de réservation. Vérifiez la configuration du serveur.' });
  }
});

app.listen(PORT, () => {
  console.log(`Email API server started on http://localhost:${PORT}`);
});
