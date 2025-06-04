import nodemailer from 'nodemailer';
import { User } from '../user/user.entity';
import { Reservation } from '../booking/booking.entity';

export const sendReservationConfirmation = async (
  email: string,
  reservation: Reservation,
  user?: User,
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'noreply.fifthpocket@gmail.com',
    to: email,
    subject: 'Conferma Prenotazione - Bike Rental',
    attachments: [
      {
        filename: 'LogoPW1.png',
        path: 'since2024.png',
        cid: 'logo',
      },
    ],
    html: `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #1f1f1f;
      color: #d1d5db;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #2d2d2d;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    h1 {
      font-size: 24px;
      color: #f9fafb;
      margin-bottom: 20px;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      color: #9ca3af;
    }
    .footer {
      font-size: 14px;
      color: #9ca3af;
      margin-top: 20px;
    }
    .logo img {
      max-width: 150px;
      border-radius: 20%;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="logo">
      <img src="cid:logo" alt="Logo" />
    </div>
    <h1>Prenotazione Confermata</h1>
    <p>Ciao ${user?.firstName || 'ospite'},</p>
    <p>La tua prenotazione è stata confermata con successo!</p>
    <p><strong>Data ritiro:</strong> ${new Date(
      reservation.pickupDate,
    ).toLocaleString()}</p>
    <p><strong>Luogo ritiro:</strong> ${
      typeof reservation.pickupLocation === 'string'
        ? reservation.pickupLocation
        : reservation.pickupLocation.name
    }</p>
    <p><strong>Data riconsegna:</strong> ${new Date(
      reservation.dropoffDate,
    ).toLocaleString()}</p>
    <p><strong>Luogo riconsegna:</strong> ${
      typeof reservation.dropoffLocation === 'string'
        ? reservation.dropoffLocation
        : reservation.dropoffLocation.name
    }</p>
    <p><strong>Totale:</strong> €${reservation.totalPrice.toFixed(2)}</p>
    <p><strong>Metodo di pagamento:</strong> ${
      reservation.paymentMethod || 'Non specificato'
    }</p>

    <div class="footer">
      <p>Grazie per aver scelto FifthPocket!</p>
    </div>
  </div>
</body>
</html>
`,
  };

  await transporter.sendMail(mailOptions);
};
