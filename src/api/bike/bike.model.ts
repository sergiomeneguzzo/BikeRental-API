import mongoose, { Schema, Document } from 'mongoose';
import { Bike as IBike, BikeStatus } from './bike.entity';

export interface BikeDocument extends IBike, Document {
  id: string; // Sovrascrive _id di Mongoose per coerenza con l'entity
}

const bikeSchema = new Schema<BikeDocument>(
  {
    bikeType: {
      type: Schema.Types.ObjectId,
      ref: 'BikeType', // Nome del modello BikeType
      required: true,
    },
    serialNumber: {
      type: String,
      unique: true,
      sparse: true, // Permette valori nulli ma se presente deve essere unico
    },
    currentLocation: {
      type: Schema.Types.ObjectId,
      ref: 'Location', // Nome del modello Location
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BikeStatus),
      default: BikeStatus.AVAILABLE,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true, // Aggiunge createdAt e updatedAt automaticamente
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id; // Mappa _id a id
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

// Indici per query comuni
bikeSchema.index({ currentLocation: 1, bikeType: 1, size: 1, status: 1 });
bikeSchema.index({ serialNumber: 1 }, { unique: true, sparse: true });

export const BikeModel = mongoose.model<BikeDocument>('Bike', bikeSchema);