import mongoose from 'mongoose';
import { Insurance } from './insurances.entity';

const insuranceSchema = new mongoose.Schema<Insurance>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
  },
  { timestamps: true },
);

export const InsuranceModel = mongoose.model<Insurance>(
  'Insurance',
  insuranceSchema,
);
