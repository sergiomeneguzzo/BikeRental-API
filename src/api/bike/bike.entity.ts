import { Types } from 'mongoose';
import { Location } from '../location/location.entity';
import { BikeType } from '../biketype/biketype.entity';

export enum BikeStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
  UNAVAILABLE = 'unavailable',
}

export interface Bike {
  id?: string;
  bikeType: BikeType | string;
  serialNumber?: string;
  currentLocation: Location | string;
  status: BikeStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}