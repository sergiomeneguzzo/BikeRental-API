import nodemailer from 'nodemailer';

export const sendReminderEmail = async (
    email: string,
    reservationId: string,
    pickupDate: Date
): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const formattedDate = pickupDate.toLocaleString('it-IT', {
        timeZone: 'Europe/Rome',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const mailOptions = {
        from: 'noreply.fifthpocket@gmail.com',
        to: email,
        subject: 'Promemoria Prenotazione: tra 1 ora il ritiro bici',
        html: `
      <!DOCTYPE html>
      <html lang="it">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Promemoria Prenotazione</title>
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
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
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
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #9ca3af;
              margin-top: 20px;
            }
            .logo {
              margin-bottom: 20px;
            }
            .logo img {
              max-width: 150px;
              height: auto;
              border-radius: 20%;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="logo">
              <img src="cid:logo" alt="Logo" />
            </div>
            <h1>Promemoria Prenotazione</h1>
            <p>Ciao,</p>
            <p>
              Ti ricordiamo che la tua prenotazione per il ritiro bici (ID: ${reservationId})
              è fissata per il <strong>${formattedDate}</strong>, ovvero tra circa un'ora.
            </p>
            <p>
              Se hai bisogno di assistenza o vuoi modificare la prenotazione, visita il nostro sito oppure contattaci.
            </p>
            <div class="footer">
              <p>Il Team di Rent Bike</p>
            </div>
          </div>
        </body>
      </html>
    `,
        attachments: [
            {
                filename: 'LogoPW1.png',
                path: 'RentBike.webp',
                cid: 'logo',
            },
        ],
    };

    await transporter.sendMail(mailOptions);
};
