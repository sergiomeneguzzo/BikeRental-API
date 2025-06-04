import 'reflect-metadata';
import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.MONGO_URI!;
const port = process.env.PORT!;

mongoose.set('debug', true);
mongoose
  .connect(connectionString, {})
  .then((_) => {
    console.log('Connected to the online database');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
