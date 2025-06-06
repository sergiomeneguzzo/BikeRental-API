import { Types } from 'mongoose';
import { Bike } from '../bike/bike.entity';
import { Location } from '../location/location.entity';
import { User } from '../user/user.entity';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface Reservation {
  id?: string;
  userId?: User | string | Types.ObjectId;
  guestEmail?: string;
  pickupDate: Date;
  pickupLocation: Location | string | Types.ObjectId;
  dropoffDate: Date;
  dropoffLocation: Location | string | Types.ObjectId;
  items: Types.ObjectId[] | string[];
  accessories?: Types.ObjectId[] | string[];
  insurances?: Types.ObjectId[] | string[];
  extraLocationFee: number;
  totalPrice: number;
  status: ReservationStatus;
  reminderSent: boolean;
  paymentMethod?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
