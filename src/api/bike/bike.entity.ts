import { Types } from 'mongoose';

// Definisci BikeStatus se non già presente in utils/constants.ts
export enum BikeStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
  UNAVAILABLE = 'unavailable',
}

export interface Bike {
  id?: string;
  bikeType: Types.ObjectId | string; // Riferimento a BikeType.entity
  serialNumber?: string;
  currentLocation: Types.ObjectId | string; // Riferimento a Location.entity
  status: BikeStatus;
  notes?: string; // Note per manutenzione o altro
  createdAt?: Date;
  updatedAt?: Date;
}