import { Types } from 'mongoose';

export enum UserRole {
  CUSTOMER = 'customer',
  OPERATOR = 'operator',
  ADMIN = 'admin'
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  picture?: string;
  username: string;
  phone?: string;
  role: UserRole;
  isConfirmed: boolean;
}
