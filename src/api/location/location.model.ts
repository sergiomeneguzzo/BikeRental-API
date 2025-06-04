import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zip: { type: String, required: true },
      province: { type: String, required: true },
    },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const LocationModel = mongoose.model('Location', LocationSchema);
