import { Types } from 'mongoose';

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  picture?: string;
  username: string;
  phone?: string;
  role: string;
  isConfirmed: boolean;
}
