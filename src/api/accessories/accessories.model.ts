import mongoose from 'mongoose';
import { Accessory } from './accessories.entity';

const accessorySchema = new mongoose.Schema<Accessory>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
  },
  { timestamps: true },
);

export const AccessoryModel = mongoose.model<Accessory>(
  'Accessory',
  accessorySchema,
);
