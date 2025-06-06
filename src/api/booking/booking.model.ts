import mongoose from 'mongoose';
import { Reservation, ReservationStatus } from './booking.entity';

const ReservationSchema = new mongoose.Schema<Reservation>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    guestEmail: {
      type: String,
      required: function () {
        return !this.userId;
      },
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    pickupLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    dropoffDate: {
      type: Date,
      required: true,
    },
    dropoffLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bike',
        required: true,
      },
    ],
      accessories: [
          {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Accessory',
              required: false,
          },
      ],
      insurances: [
          {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Insurance',
              required: false,
          },
      ],
    extraLocationFee: {
      type: Number,
      default: 0,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ReservationStatus),
      default: ReservationStatus.PENDING,
      required: true,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

export const ReservationModel = mongoose.model<Reservation>(
  'Reservation',
  ReservationSchema,
);
