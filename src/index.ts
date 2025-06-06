import 'reflect-metadata';
import app from './app';
import cron from 'node-cron';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {processReminders} from "./scheduled-services/email-reminder";
dotenv.config();

const connectionString = process.env.MONGO_URI!;
const port = 8080;

mongoose.set('debug', true);
mongoose
  .connect(connectionString, {})
  .then((_) => {

      cron.schedule('* * * * *', async () => {
          try {
              await processReminders();
          } catch (err) {
              console.error('Errore nel job reminder:', err);
          }
      }, {
          timezone: 'Europe/Rome'
      });

    console.log('Connected to the online database');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
