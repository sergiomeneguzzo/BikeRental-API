import mongoose, { Schema, Document } from 'mongoose';
import { Bike as IBike, BikeStatus } from './bike.entity';

export interface BikeDocument extends IBike, Document {
  id: string;
}

const bikeSchema = new Schema<BikeDocument>(
  {
    bikeType: {
      type: Schema.Types.ObjectId,
      ref: 'BikeType',
      required: true,
    },
    serialNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    currentLocation: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
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
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
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

bikeSchema.index({ currentLocation: 1, bikeType: 1, size: 1, status: 1 });
bikeSchema.index({ serialNumber: 1 }, { unique: true, sparse: true });

export const BikeModel = mongoose.model<BikeDocument>('Bike', bikeSchema);