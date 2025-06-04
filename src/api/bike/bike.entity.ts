import { Types } from 'mongoose';

export enum BikeStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
  UNAVAILABLE = 'unavailable',
}

export interface Bike {
  id?: string;
  bikeType: Types.ObjectId | string;
  serialNumber?: string;
  currentLocation: Location | string;
  status: BikeStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}